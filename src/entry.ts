/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateOrigin, loadImbricateOriginFromPersistanceOrigin } from "@imbricate/core";
import { StackUpConfig } from "./definition";

export const createStackUpServer = async (config: StackUpConfig): Promise<void> => {

    const originMap: Map<string, IImbricateOrigin> = new Map();

    for (const origin of config.originPersistencies) {

        const originInstance: IImbricateOrigin | null = await loadImbricateOriginFromPersistanceOrigin(origin);

        if (originInstance) {
            originMap.set(origin.originName, originInstance);
        }
    }

    console.log(originMap);
};
