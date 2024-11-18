/**
 * @author WMXPY
 * @namespace Database
 * @description List
 */

import { IImbricateDatabase, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDatabaseListRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/list-database", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const databases: IImbricateDatabase[] = await origin.getDatabaseManager().listDatabases();

        res.send({
            databases: databases.map((database: IImbricateDatabase) => {
                return {
                    databaseUniqueIdentifier: database.uniqueIdentifier,
                    databaseName: database.databaseName,
                    databaseSchema: database.schema,
                };
            }),
        });
    });
};
