/**
 * @author WMXPY
 * @namespace Util
 * @description Loader
 */

import { IImbricateOrigin, loadImbricateOriginFromPersistenceOrigin } from "@imbricate/core";
import { StackUpConfig } from "../definition";

export const loadOriginsFromConfig = async (config: StackUpConfig): Promise<Map<string, IImbricateOrigin>> => {

    const originMap: Map<string, IImbricateOrigin> = new Map();

    for (const origin of config.originPersistencies) {

        const originInstance: IImbricateOrigin | null = await loadImbricateOriginFromPersistenceOrigin(origin);

        if (originInstance) {

            console.log(`Loaded origin: ${origin.originName} - ${originInstance.uniqueIdentifier}`);
            originMap.set(originInstance.uniqueIdentifier, originInstance);
        }
    }

    return originMap;
};
