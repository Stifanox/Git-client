/** @typedef {import('../types.js').MergeDocument} MergeDocument */

/** @type {MergeDocument} */
export const utilsConfigDocument = {
    path: 'src/config/utils.ts',
    baseBranch: 'develop',
    incomingBranch: 'origin/refactor/config-split',
    blocks: [
        { id: 'retry', startLine: 6, endLine: 7, label: 'Retry policy defaults' },
        { id: 'cache', startLine: 12, endLine: 12, label: 'Cache TTL export' },
    ],
    rows: [
        { local: '/** Shared runtime configuration. */', incoming: '/** Shared runtime configuration. */' },
        { local: '', incoming: '' },
        { local: "export const APP_NAME = 'TheMonolithic';", incoming: "export const APP_NAME = 'TheMonolithic';" },
        { local: '', incoming: '' },
        { local: 'export const MAX_RETRIES = 3;', incoming: 'export const MAX_RETRIES = 5;' },
        { local: 'export const RETRY_DELAY_MS = 250;', incoming: 'export const RETRY_DELAY_MS = 500;' },
        { local: '', incoming: '' },
        { local: 'export const FEATURE_FLAGS = {', incoming: 'export const FEATURE_FLAGS = {' },
        { local: "  mergeTool: true,", incoming: "  mergeTool: true," },
        { local: '} as const;', incoming: '} as const;' },
        { local: '', incoming: '' },
        { local: 'export const CACHE_TTL_SEC = 60;', incoming: 'export const CACHE_TTL_SEC = 120;' },
        { local: '', incoming: '' },
        { local: 'export function isProduction(): boolean {', incoming: 'export function isProduction(): boolean {' },
        { local: '  return import.meta.env.PROD;', incoming: '  return import.meta.env.PROD;' },
        { local: '}', incoming: '}' },
    ],
};
