/**
 * @author WMXPY
 * @description Definition
 */

import { ImbricateAuthor, ImbricateOriginPersistenceOrigin } from "@imbricate/core";

export type StackUpConfig = {

    readonly originPersistencies: ImbricateOriginPersistenceOrigin[];

    readonly authenticationSecret: string;
    readonly author: ImbricateAuthor;
};
