/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateDatabase, IImbricateOrigin } from "@imbricate/core";
import { json } from "body-parser";
import express from "express";
import { StackUpConfig } from "./definition";
import { loadOriginsFromConfig } from "./util/load";

export const createStackUpServer = async (config: StackUpConfig): Promise<void> => {

    const originMap: Map<string, IImbricateOrigin> = await loadOriginsFromConfig(config);

    const application = express();
    application.use(json());

    application.get("/:origin/database/list", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const databases: IImbricateDatabase[] = await origin.getDatabaseManager().getDatabases();

        res.send(databases.map((database: IImbricateDatabase) => {
            return {
                databaseUniqueIdentifier: database.uniqueIdentifier,
                databaseName: database.databaseName,
            };
        }));
    });

    application.post("/:origin/database/create", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const database: IImbricateDatabase = await origin.getDatabaseManager().createDatabase(
            body.databaseName,
            body.schema,
        );

        res.send({
            databaseUniqueIdentifier: database.uniqueIdentifier,
        });
    });

    application.listen(3000, () => {
        console.log("Server started on port 3000");
    });
};
