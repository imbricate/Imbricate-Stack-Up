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
import { validateStackUpConfig } from "./util/validate";

export const createStackUpServer = async (
    config: StackUpConfig,
    port: number,
): Promise<express.Express> => {

    const validationResult: boolean = validateStackUpConfig(config);

    if (!validationResult) {

        console.error("Invalid Stack Up Configuration");
        throw new Error("Invalid Stack Up Configuration");
    }

    const authenticationSecret: string = config.authenticationSecret;
    const author = config.author;

    const originMap: Map<string, IImbricateOrigin> =
        await loadOriginsFromConfig(config, port);

    const application = express();
    application.use(json());
    application.use(cors());

    application.use((req, res, next) => {

        console.log(req.method, req.url);

        if (req.headers.authorization !== `Bearer ${authenticationSecret}`) {

            console.log(`Unauthorized: ${req.headers.authorization}`);
            res.status(401).send("Unauthorized");
            return;
        }
        next();
    });

    attachDatabaseListRoute(application, originMap);
    attachDatabaseGetRoute(application, originMap);
    attachDatabaseCreateRoute(application, originMap, author);
    attachDatabasePutSchemaRoute(application, originMap, author);

    attachDocumentCreateRoute(application, originMap, author);
    attachDocumentGetEditRecordsRoute(application, originMap);
    attachDocumentGetRoute(application, originMap);
    attachDocumentPutRoute(application, originMap, author);
    attachDocumentQueryRoute(application, originMap);

    attachSearchSearchRoute(application, originMap);

    attachTextCreateRoute(application, originMap, author);
    attachTextGetRoute(application, originMap);

    return application;
};
