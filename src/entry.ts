/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateOrigin } from "@imbricate/core";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import { attachDatabaseCreateRoute } from "./database/create";
import { attachDatabaseGetRoute } from "./database/get";
import { attachDatabaseListRoute } from "./database/list";
import { attachDatabasePutSchemaRoute } from "./database/put-schema";
import { StackUpConfig } from "./definition";
import { attachDocumentCreateRoute } from "./document/create";
import { attachDocumentGetEditRecordsRoute } from "./document/edit-records";
import { attachDocumentGetRoute } from "./document/get";
import { attachDocumentPutRoute } from "./document/put";
import { attachDocumentQueryRoute } from "./document/query";
import { attachSearchSearchRoute } from "./search/search";
import { attachTextCreateRoute } from "./text/create";
import { attachTextGetRoute } from "./text/get";
import { loadOriginsFromConfig } from "./util/load";

export const createStackUpServer = async (config: StackUpConfig): Promise<express.Express> => {

    const originMap: Map<string, IImbricateOrigin> =
        await loadOriginsFromConfig(config);

    const application = express();
    application.use(json());
    application.use(cors());
    application.use((req, _res, next) => {
        console.log(req.method, req.url);
        next();
    });

    attachDatabaseListRoute(application, originMap);
    attachDatabaseGetRoute(application, originMap);
    attachDatabaseCreateRoute(application, originMap);
    attachDatabasePutSchemaRoute(application, originMap);

    attachDocumentCreateRoute(application, originMap);
    attachDocumentGetEditRecordsRoute(application, originMap);
    attachDocumentGetRoute(application, originMap);
    attachDocumentPutRoute(application, originMap);
    attachDocumentQueryRoute(application, originMap);

    attachSearchSearchRoute(application, originMap);

    attachTextCreateRoute(application, originMap);
    attachTextGetRoute(application, originMap);

    return application;
};
