/**
 * @author WMXPY
 * @namespace Database
 * @description Get
 */

import { IImbricateDatabase, IImbricateOrigin } from "@imbricate/core";
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

        res.send({
            databaseUniqueIdentifier: database.uniqueIdentifier,
            databaseName: database.databaseName,
            databaseSchema: database.schema,
            databaseAnnotations: database.annotations,
        });
    });
};
