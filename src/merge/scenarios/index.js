import { mainControllerDocument } from './mainController.js';
import { utilsConfigDocument } from './utilsConfig.js';

/** @type {Record<string, import('../types.js').MergeDocument>} */
export const MERGE_SCENARIOS = {
    main_controller: mainControllerDocument,
    utils_config: utilsConfigDocument,
};

export const DEFAULT_SCENARIO_ID = 'main_controller';

/**
 * @param {string} scenarioId
 */
export function getMergeScenario(scenarioId) {
    const document = MERGE_SCENARIOS[scenarioId];
    if (!document) {
        throw new Error(`Unknown merge scenario: ${scenarioId}`);
    }
    return document;
}

export function listMergeScenarios() {
    return Object.entries(MERGE_SCENARIOS).map(([id, document]) => ({
        id,
        path: document.path,
        blockCount: document.blocks.length,
        lineCount: document.rows.length,
    }));
}

function initialFileState(fileId, document) {
    const firstBlock = document.blocks[0];
    return {
        fileId,
        document,
        blockChoices: {},
        mergedEdits: {},
        activeBlockId: firstBlock?.id ?? null,
    };
}

/** Symulowana sesja merge z wszystkimi plikami konfliktowymi naraz (jak po `git pull`). */
export function createDemoMergeSession() {
    const files = Object.entries(MERGE_SCENARIOS).map(([id, document]) =>
        initialFileState(id, document)
    );
    return {
        files,
        activeFileId: files[0]?.fileId ?? DEFAULT_SCENARIO_ID,
    };
}
