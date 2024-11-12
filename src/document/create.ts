/**
 * @author WMXPY
 * @namespace Document
 * @description Create
 */

import { IImbricateDatabase, IImbricateDocument, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDocumentCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.post("/:origin/database/:database/document/create", async (req, res) => {

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

        const document: IImbricateDocument = await database.createDocument(body.properties);

        res.send({
            documentUniqueIdentifier: document.uniqueIdentifier,
        });
    });
};
