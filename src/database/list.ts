/**
 * @author WMXPY
 * @namespace Database
 * @description List
 */

import { IImbricateDatabase, IImbricateOrigin, ImbricateDatabaseManagerListDatabasesOutcome } from "@imbricate/core";
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

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        const databases: ImbricateDatabaseManagerListDatabasesOutcome = await origin.getDatabaseManager().listDatabases();

        if (typeof databases === "symbol") {

            console.error("List Databases Failed", databases);
            res.status(404).send("List Databases Failed");
            return;
        }

        res.send({
            databases: databases.databases.map((database: IImbricateDatabase) => {
                return {
                    databaseUniqueIdentifier: database.uniqueIdentifier,
                    databaseVersion: database.databaseVersion,
                    databaseName: database.databaseName,
                    databaseSchema: database.schema,
                    databaseAnnotations: database.annotations,
                };
            }),
        });
    });
};
