import { useGitStore } from '../store/useGitStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';

const PROMPT_USER = 'mateusz';
const PROMPT_HOST = 'monolithic';
const PROMPT_PATH = '~/TheMonolithic';

/** @typedef {{ lines?: string[]; clear?: boolean; close?: boolean }} TerminalResult */

/**
 * @param {string} raw
 * @returns {TerminalResult}
 */
export function executeTerminalCommand(raw) {
    const line = raw.trim();
    if (!line) return { lines: [] };

    const parts = line.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((p) => p.replace(/^"|"$/g, '')) ?? [];
    const [cmd, ...args] = parts;

    if (cmd === 'clear') return { clear: true };
    if (cmd === 'exit') return { close: true };

    if (cmd === 'help') return { lines: helpText() };

    if (cmd === 'pwd') return { lines: [`${PROMPT_PATH.replace('~', '/home/mateusz')}`] };

    if (cmd === 'whoami') return { lines: [PROMPT_USER] };

    if (cmd === 'echo') return { lines: [args.join(' ')] };

    if (cmd === 'git') return executeGit(args);

    return { lines: [`bash: ${cmd}: command not found`] };
}

export function terminalPrompt() {
    return `${PROMPT_USER}@${PROMPT_HOST}:${PROMPT_PATH}$`;
}

/** @param {string[]} args */
function executeGit(args) {
    const sub = args[0];

    if (!sub || sub === '--help' || sub === '-h') {
        return { lines: helpText().filter((l) => l.startsWith('  git')) };
    }

    switch (sub) {
        case 'status':
            return { lines: gitStatus() };
        case 'branch':
            return gitBranch(args.slice(1));
        case 'checkout':
            return gitCheckout(args[1]);
        case 'commit':
            return gitCommit(args.slice(1));
        case 'add':
            return gitAdd(args[1]);
        case 'reset':
            return gitReset(args);
        case 'log':
            return { lines: gitLog(args.slice(1)) };
        default:
            return { lines: [`git: '${sub}' is not a simulated git command. Try \`help\`.`] };
    }
}

function gitStatus() {
    const { HEAD, staged, unstaged, branches } = useGitStore.getState();
    const current = branches.local.find((b) => b.name === HEAD);
    const lines = [`On branch ${HEAD}`];

    if (current?.tracking) {
        const ahead = current.ahead ?? 0;
        const behind = current.behind ?? 0;
        if (ahead === 0 && behind === 0) {
            lines.push(`Your branch is up to date with '${current.tracking}'.`);
        } else {
            const bits = [];
            if (ahead > 0) bits.push(`${ahead} ahead`);
            if (behind > 0) bits.push(`${behind} behind`);
            lines.push(`Your branch is ${bits.join(', ')} of '${current.tracking}'.`);
        }
    } else {
        lines.push('No upstream configured.');
    }

    if (staged.length === 0 && unstaged.length === 0) {
        lines.push('nothing to commit, working tree clean');
        return lines;
    }

    if (staged.length > 0) {
        lines.push('Changes to be committed:', '  (use "git reset HEAD <file>..." to unstage)');
        staged.forEach((f) => lines.push(`\t${statusLabel(f.status)}:   ${f.path}`));
    }

    if (unstaged.length > 0) {
        if (staged.length > 0) lines.push('');
        lines.push('Changes not staged for commit:', '  (use "git add <file>..." to stage)');
        unstaged.forEach((f) => lines.push(`\t${statusLabel(f.status)}:   ${f.path}`));
    }

    return lines;
}

function statusLabel(status) {
    if (status === 'A') return 'new file';
    if (status === 'D') return 'deleted';
    return 'modified';
}

/** @param {string[]} args */
function gitBranch(args) {
    if (args.length === 0) {
        const { HEAD, branches } = useGitStore.getState();
        return {
            lines: branches.local.map((b) =>
                (b.name === HEAD ? '* ' : '  ') + b.name
            ),
        };
    }

    const name = args[0];
    if (args[0] === '-a' || args[0] === '--all') {
        const { HEAD, branches } = useGitStore.getState();
        const local = branches.local.map((b) => (b.name === HEAD ? '* ' : '  ') + b.name);
        const remote = branches.remote.map((b) => `  ${b.name}`);
        return { lines: [...local, ...remote] };
    }

    const exists = useGitStore.getState().branches.local.some((b) => b.name === name);
    if (exists) return { lines: [`fatal: A branch named '${name}' already exists.`] };

    useGitStore.getState().createBranch(name);
    return { lines: [`Created branch '${name}' and switched to it.`] };
}

/** @param {string | undefined} name */
function gitCheckout(name) {
    if (!name) return { lines: ['fatal: you must specify a branch to checkout'] };

    const { HEAD, branches } = useGitStore.getState();
    if (name === HEAD) return { lines: [`Already on '${name}'`] };

    if (!branches.local.some((b) => b.name === name)) {
        return { lines: [`error: pathspec '${name}' did not match any file(s) known to git`] };
    }

    useGitStore.getState().checkout(name);
    return { lines: [`Switched to branch '${name}'`] };
}

/** @param {string[]} args */
function gitCommit(args) {
    let message = '';
    const mIdx = args.indexOf('-m');
    if (mIdx >= 0 && args[mIdx + 1]) {
        message = args[mIdx + 1];
    }

    if (!message) {
        return { lines: ['error: switch `m` missing a value', 'usage: git commit -m <message>'] };
    }

    const result = useGitStore.getState().commit(message);
    if (!result?.ok) {
        return { lines: ['nothing to commit (stage files with git add first)'] };
    }

    return { lines: [`[${result.hash}] ${message}`, ` ${result.files.length} file(s) changed`] };
}

/** @param {string | undefined} path */
function gitAdd(path) {
    if (!path) return { lines: ['Nothing specified, nothing added.'] };

    const { unstaged } = useGitStore.getState();
    const file = unstaged.find((f) => f.path === path || f.id === path);
    if (!file) {
        return { lines: [`fatal: pathspec '${path}' did not match any unstaged files`] };
    }

    useGitStore.getState().stage(file.id);
    return { lines: [] };
}

/** @param {string[]} args */
function gitReset(args) {
    if (args[0] === 'HEAD' && args[1]) {
        const path = args[1];
        const { staged } = useGitStore.getState();
        const file = staged.find((f) => f.path === path || f.id === path);
        if (!file) {
            return { lines: [`fatal: pathspec '${path}' did not match any staged files`] };
        }
        useGitStore.getState().unstage(file.id);
        return { lines: [] };
    }

    return { lines: ['usage: git reset HEAD <file>'] };
}

/** @param {string[]} args */
function gitLog(args) {
    const { HEAD } = useGitStore.getState();
    let count = 10;
    const onelineIdx = args.indexOf('--oneline');
    const dashN = args.find((a) => /^-\d+$/.test(a));
    if (dashN) count = parseInt(dashN.slice(1), 10);
    const nFlag = args.indexOf('-n');
    if (nFlag >= 0 && args[nFlag + 1]) count = parseInt(args[nFlag + 1], 10);

    const commits = useHistoryStore.getState().branchHistories[HEAD] ?? [];
    const slice = commits.slice(0, count);

    if (slice.length === 0) return ['(no commits)'];

    if (onelineIdx >= 0) {
        return slice.map((c) => `${c.hash.toLowerCase()} ${c.message}`);
    }

    return slice.flatMap((c) => [
        `commit ${c.fullHash}`,
        `Author: ${c.author}`,
        `Date:   ${c.date}`,
        '',
        `    ${c.message}`,
        '',
    ]);
}

function helpText() {
    return [
        'Available commands:',
        '',
        '  help                     — this message',
        '  clear                    — clear terminal output',
        '  exit                     — close terminal panel',
        '  pwd, whoami, echo <text> — basic shell stubs',
        '',
        '  git status               — working tree (synced with Staging)',
        '  git branch               — list local branches',
        '  git branch -a            — list local + remote branches',
        '  git branch <name>        — create branch and checkout',
        '  git checkout <name>      — switch branch',
        '  git add <path>           — stage file',
        '  git reset HEAD <path>    — unstage file',
        '  git commit -m "<msg>"    — commit staged files',
        '  git log --oneline -5     — recent commits on current branch',
    ];
}
