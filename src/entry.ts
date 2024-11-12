/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateOrigin, loadImbricateOriginsFromPersistance } from "@imbricate/core";
import { StackUpConfig } from "./definition";

export const createStackUpServer = async (config: StackUpConfig): Promise<void> => {

    const origins: IImbricateOrigin[] = await loadImbricateOriginsFromPersistance({
        origins: config.originPersistencies,
    });

    console.log(origins);
};
