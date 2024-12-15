/**
 * @author WMXPY
 * @namespace Database
 * @description Create
 */

import { IImbricateDatabase, IImbricateOrigin, ImbricateAuthor } from "@imbricate/core";
import express from "express";

export const attachDatabaseCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
    author: ImbricateAuthor,
): Promise<void> => {

    application.post("/:origin/create-database", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        try {

            const database: IImbricateDatabase = await origin.getDatabaseManager().createDatabase(
                body.databaseName,
                body.schema,
                {
                    author,
                },
            );

            res.send({
                databaseUniqueIdentifier: database.uniqueIdentifier,
            });
        } catch (error) {

            console.error(error);

            res.status(500).send({
                error: (error as any).message,
            });
        }
    });
};
