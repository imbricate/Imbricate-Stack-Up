/**
 * @author WMXPY
 * @namespace Database
 * @description Put Schema
 */

import { IImbricateDatabase, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDatabasePutSchemaRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.put("/:origin/database/:database/schema", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;

        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const database: IImbricateDatabase | null = await origin.getDatabaseManager().getDatabase(
            databaseUniqueIdentifier,
        );

        if (!database) {
            res.status(404).send("Database Not Found");
            return;
        }

        database.putSchema(body.schema);

        res.send({
            databaseUniqueIdentifier: database.uniqueIdentifier,
        });
    });
};
