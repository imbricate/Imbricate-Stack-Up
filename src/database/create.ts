/**
 * @author WMXPY
 * @namespace Database
 * @description Create
 */

import { IImbricateDatabase, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDatabaseCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

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
};
