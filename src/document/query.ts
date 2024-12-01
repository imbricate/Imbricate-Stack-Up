/**
 * @author WMXPY
 * @namespace Document
 * @description Query
 */

import { IImbricateDatabase, IImbricateDocument, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDocumentQueryRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.post("/:origin/database/:database/query-documents", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;

        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            console.log("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        const database: IImbricateDatabase | null = await origin.getDatabaseManager().getDatabase(
            databaseUniqueIdentifier,
        );

        if (!database) {
            console.log("Database Not Found", databaseUniqueIdentifier);
            res.status(404).send("Database Not Found");
            return;
        }

        const documents: IImbricateDocument[] = await database.queryDocuments(body.query);
        const response: any[] = [];

        for (const document of documents) {
            response.push({
                uniqueIdentifier: document.uniqueIdentifier,
                properties: document.properties,
                annotations: document.annotations,
            });
        }

        res.send({
            documents: response,
        });
    });
};
