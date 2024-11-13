/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateOrigin } from "@imbricate/core";
import { json } from "body-parser";
import express from "express";
import { attachDatabaseCreateRoute } from "./database/create";
import { attachDatabaseListRoute } from "./database/list";
import { StackUpConfig } from "./definition";
import { attachDocumentCreateRoute } from "./document/create";
import { attachDocumentGetRoute } from "./document/get";
import { attachDocumentPutRoute } from "./document/put";
import { loadOriginsFromConfig } from "./util/load";

export const createStackUpServer = async (config: StackUpConfig): Promise<void> => {

    const originMap: Map<string, IImbricateOrigin> = await loadOriginsFromConfig(config);

    const application = express();
    application.use(json());

    attachDatabaseListRoute(application, originMap);
    attachDatabaseCreateRoute(application, originMap);

    attachDocumentCreateRoute(application, originMap);
    attachDocumentGetRoute(application, originMap);
    attachDocumentPutRoute(application, originMap);

    application.listen(3000, () => {
        console.log("Server started on port 3000");
    });
};
