/**
 * @author WMXPY
 * @namespace Database
 * @description Create
 */

import { IImbricateOrigin, ImbricateAuthor, ImbricateDatabaseManagerCreateDatabaseOutcome } from "@imbricate/core";
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

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        try {

            const database: ImbricateDatabaseManagerCreateDatabaseOutcome = await origin.getDatabaseManager().createDatabase(
                body.databaseName,
                body.schema,
                {
                    author,
                },
            );

            if (typeof database === "symbol") {

                console.error("Create Database Failed", database);
                res.status(404).send("Create Database Failed");
                return;
            }

            res.send({
                databaseUniqueIdentifier: database.database.uniqueIdentifier,
                databaseVersion: database.database.databaseVersion,
            });
        } catch (error) {

            console.error(error);

            res.status(500).send({
                error: (error as any).message,
            });
        }
    });
};
