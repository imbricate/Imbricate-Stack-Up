/**
 * @author WMXPY
 * @namespace Database
 * @description Put Schema
 */

import { IImbricateOrigin, ImbricateAuthor, ImbricateDatabaseManagerGetDatabaseOutcome, ImbricateDatabasePutSchemaOutcome } from "@imbricate/core";
import express from "express";

export const attachDatabasePutSchemaRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
    author: ImbricateAuthor,
): Promise<void> => {

    application.put("/:origin/database/:database/schema", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;

        const body: any = req.body;

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

        const result: ImbricateDatabasePutSchemaOutcome = await database.database.putSchema(
            body.schema,
            {
                author,
            },
        );

        if (typeof result === "symbol") {

            console.error("Put Schema Failed", result);
            res.status(404).send("Put Schema Failed");
            return;
        }

        res.send({
            databaseUniqueIdentifier: database.database.uniqueIdentifier,
            databaseVersion: database.database.databaseVersion,
        });
    });
};
