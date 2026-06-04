/**
 * Symulowany pełny plik main_controller.ts — 51 linii (1..51).
 */

export const MERGE_BLOCKS = [
    { id: 'ch-init', startLine: 15, endLine: 18, label: 'Connection initialization' },
    { id: 'c1', startLine: 20, endLine: 23, label: 'Profile export signature' },
    { id: 'c2', startLine: 35, endLine: 35, label: 'Session timeout constant' },
    { id: 'c3', startLine: 43, endLine: 44, label: 'Error handler return type' },
];

/** @deprecated alias */
export const CONFLICTS = MERGE_BLOCKS.filter((b) => b.id.startsWith('c'));

const FILE_ROWS = [
    { local: '/**', incoming: '/**' },
    { local: ' * Main controller — orchestrates auth, profile, and realtime channels.', incoming: ' * Main controller — orchestrates auth, profile, and realtime channels.' },
    { local: ' * @module main_controller', incoming: ' * @module main_controller' },
    { local: ' */', incoming: ' */' },
    { local: '', incoming: '' },
    { local: "import { useAuth } from './hooks/auth';", incoming: "import { useAuth } from './hooks/auth';" },
    { local: "import { api } from './services/api';", incoming: "import { api } from './services/api';" },
    { local: "import type { UserDTO, SessionConfig } from './types';", incoming: "import type { UserDTO, SessionConfig } from './types';" },
    { local: '', incoming: '' },
    { local: 'const DEFAULT_TIMEOUT_MS = 30_000;', incoming: 'const DEFAULT_TIMEOUT_MS = 30_000;' },
    { local: '', incoming: '' },
    { local: 'let activeSocket: WebSocket | null = null;', incoming: 'let activeSocket: WebSocket | null = null;' },
    { local: '', incoming: '' },
    { local: '/** Initializes the realtime connection for the active session. */', incoming: '/** Initializes the realtime connection for the active session. */' },
    { local: 'const initConnection = () => {', incoming: '// Old initialization removed in remote branch' },
    { local: '  console.log("Local initialization logic");', incoming: '' },
    { local: '  return socket.connect();', incoming: '' },
    { local: '};', incoming: '' },
    { local: '', incoming: '' },
    { local: 'export const updateProfile = async (data: any) => {', incoming: 'async function handleProfileUpdate(payload: UserDTO) {' },
    { local: "  const response = await api.put('/user', data);", incoming: "  const response = await api.put('/user', payload);" },
    { local: '  return response.data;', incoming: '  return response.data;' },
    { local: '};', incoming: '}' },
    { local: '', incoming: '' },
    { local: 'export function disconnect(): void {', incoming: 'export function disconnect(): void {' },
    { local: '  activeSocket?.close();', incoming: '  activeSocket?.close();' },
    { local: '  activeSocket = null;', incoming: '  activeSocket = null;' },
    { local: '}', incoming: '}' },
    { local: '', incoming: '' },
    { local: 'export async function refreshSession(token: string): Promise<SessionConfig> {', incoming: 'export async function refreshSession(token: string): Promise<SessionConfig> {' },
    { local: "  const response = await api.post<SessionConfig>('/session/refresh', { token });", incoming: "  const response = await api.post<SessionConfig>('/session/refresh', { token });" },
    { local: '  return response.data;', incoming: '  return response.data;' },
    { local: '}', incoming: '}' },
    { local: '', incoming: '' },
    { local: 'export const SESSION_TTL_MS = 30_000;', incoming: 'export const SESSION_TTL_MS = 45_000; // aligned with gateway idle timeout policy from origin/feature-session-lifecycle-and-connection-pooling-v2' },
    { local: '', incoming: '' },
    { local: 'export function logDiagnostic(event: string, payload: Record<string, unknown>): void {', incoming: 'export function logDiagnostic(event: string, payload: Record<string, unknown>): void {' },
    { local: '  if (import.meta.env.DEV) {', incoming: '  if (import.meta.env.DEV) {' },
    { local: '    console.debug(`[main_controller] ${event}`, payload);', incoming: '    console.debug(`[main_controller] ${event}`, payload);' },
    { local: '  }', incoming: '  }' },
    { local: '}', incoming: '}' },
    { local: '', incoming: '' },
    { local: 'export function handleApiError(err: unknown): string {', incoming: 'export function handleApiError(err: unknown): never {' },
    { local: '  return err instanceof Error ? err.message : String(err);', incoming: '  throw err instanceof Error ? err : new Error(String(err));' },
    { local: '', incoming: '' },
    { local: 'export const bootstrap = async (): Promise<void> => {', incoming: 'export const bootstrap = async (): Promise<void> => {' },
    { local: "  await refreshSession(localStorage.getItem('token') ?? '');", incoming: "  await refreshSession(localStorage.getItem('token') ?? '');" },
    { local: "  logDiagnostic('bootstrap_complete', { branch: import.meta.env.VITE_GIT_BRANCH ?? 'main' });", incoming: "  logDiagnostic('bootstrap_complete', { branch: import.meta.env.VITE_GIT_BRANCH ?? 'main' });" },
    { local: '};', incoming: '};' },
    { local: '', incoming: '' },
    { local: '// End of simulated file — merge preview shows full document context.', incoming: '// End of simulated file — merge preview shows full document context.' },
];

export const TOTAL_LINES = FILE_ROWS.length;

function rowEqual(row) {
    return row.local === row.incoming;
}

export function getBlockForLine(lineNum) {
    return MERGE_BLOCKS.find((b) => lineNum >= b.startLine && lineNum <= b.endLine) ?? null;
}

export function getBlockById(blockId) {
    return MERGE_BLOCKS.find((b) => b.id === blockId) ?? null;
}

/** Domyślna treść w merged result bez ręcznej edycji */
export function getBaselineMergedContent(lineNum, blockChoices = {}) {
    const row = FILE_ROWS[lineNum - 1];
    if (!row) return '';
    const block = getBlockForLine(lineNum);
    const choice = block ? blockChoices[block.id] : null;
    if (choice === 'right') return row.incoming;
    return row.local;
}

function sideLineType(line, block, blockChoice, side) {
    if (blockChoice === side) return 'applied';
    if (block && !blockChoice) {
        const row = FILE_ROWS[line - 1];
        if (!rowEqual(row)) {
            return block.id === 'ch-init' ? 'changed' : 'conflict';
        }
    }
    return 'normal';
}

export function buildLocalFile(blockChoices = {}) {
    return FILE_ROWS.map((row, i) => {
        const line = i + 1;
        const block = getBlockForLine(line);
        const blockChoice = block ? blockChoices[block.id] : null;
        return {
            id: `local-${line}`,
            line,
            content: row.local,
            blockId: block?.id ?? null,
            isBlockStart: block?.startLine === line,
            type: sideLineType(line, block, blockChoice, 'left'),
        };
    });
}

export function buildIncomingFile(blockChoices = {}) {
    return FILE_ROWS.map((row, i) => {
        const line = i + 1;
        const block = getBlockForLine(line);
        const blockChoice = block ? blockChoices[block.id] : null;
        return {
            id: `incoming-${line}`,
            line,
            content: row.incoming,
            blockId: block?.id ?? null,
            isBlockStart: block?.startLine === line,
            type: sideLineType(line, block, blockChoice, 'right'),
        };
    });
}

export function buildMergedLines(blockChoices = {}, mergedEdits = {}) {
    return FILE_ROWS.map((row, index) => {
        const line = index + 1;
        const block = getBlockForLine(line);
        const baseline = getBaselineMergedContent(line, blockChoices);

        if (Object.hasOwn(mergedEdits, line) && mergedEdits[line] !== baseline) {
            return {
                id: `merged-${line}`,
                line,
                content: mergedEdits[line],
                type: 'normal',
                source: 'manual',
            };
        }

        const choice = block ? blockChoices[block.id] : null;

        if (choice === 'left') {
            return {
                id: `merged-${line}`,
                line,
                content: row.local,
                type: 'resolved-result',
                source: 'left',
            };
        }

        if (choice === 'right') {
            return {
                id: `merged-${line}`,
                line,
                content: row.incoming,
                type: 'resolved-result',
                source: 'right',
            };
        }

        if (block && !rowEqual(row)) {
            return {
                id: `merged-${line}`,
                line,
                content: baseline,
                type: block.id === 'ch-init' ? 'changed' : 'conflict',
            };
        }

        return {
            id: `merged-${line}`,
            line,
            content: baseline,
            type: 'normal',
        };
    });
}

export function isBlockResolved(blockChoices, mergedEdits, blockId) {
    if (blockChoices[blockId]) return true;
    const block = getBlockById(blockId);
    if (!block) return false;
    for (let l = block.startLine; l <= block.endLine; l++) {
        const baseline = getBaselineMergedContent(l, blockChoices);
        const hasCustomEdit = Object.hasOwn(mergedEdits, l) && mergedEdits[l] !== baseline;
        if (!hasCustomEdit) return false;
    }
    return true;
}

export function countUnresolvedBlocks(blockChoices, mergedEdits = {}) {
    return MERGE_BLOCKS.filter((b) => !isBlockResolved(blockChoices, mergedEdits, b.id)).length;
}

export function countResolvedBlocks(blockChoices, mergedEdits = {}) {
    return MERGE_BLOCKS.filter((b) => isBlockResolved(blockChoices, mergedEdits, b.id)).length;
}

export function allBlocksResolved(blockChoices, mergedEdits = {}) {
    return countUnresolvedBlocks(blockChoices, mergedEdits) === 0;
}

export function linesInBlock(blockId) {
    const block = getBlockById(blockId);
    if (!block) return [];
    const lines = [];
    for (let l = block.startLine; l <= block.endLine; l++) lines.push(l);
    return lines;
}
