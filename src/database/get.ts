/**
 * @author WMXPY
 * @namespace Database
 * @description Get
 */

import { IImbricateOrigin, ImbricateDatabaseManagerGetDatabaseOutcome } from "@imbricate/core";
import express from "express";

export const attachDatabaseGetRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/database/:database", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        const database: ImbricateDatabaseManagerGetDatabaseOutcome = await origin.getDatabaseManager().getDatabase(
            databaseUniqueIdentifier,
        );

        if (typeof database === "symbol") {

            console.error("Database Not Found", database);
            res.status(404).send("Database Not Found");
            return;
        }

        res.send({
            databaseUniqueIdentifier: database.database.uniqueIdentifier,
            databaseVersion: database.database.databaseVersion,
            databaseName: database.database.databaseName,
            databaseSchema: database.database.schema,
            databaseAnnotations: database.database.annotations,
        });
    });
};
