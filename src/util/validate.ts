/**
 * @author WMXPY
 * @namespace Util
 * @description Validate
 */

import { StackUpConfig } from "../definition";

export const validateStackUpConfig = (
    config: StackUpConfig,
): boolean => {

    if (!config) {
        return false;
    }

    if (!config.originPersistencies) {
        return false;
    }

    if (!config.authenticationSecret) {
        return false;
    }

    if (typeof config.author !== "object") {
        return false;
    }

    if (typeof config.author.category !== "string"
        || typeof config.author.identifier !== "string"
        || typeof config.author.isAutomation !== "boolean"
    ) {
        return false;
    }

    return true;
};
