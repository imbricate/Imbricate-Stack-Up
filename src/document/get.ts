/**
 * @author WMXPY
 * @namespace Document
 * @description Create
 */

import { DocumentProperties, IImbricateDatabase, IImbricateDocument, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDocumentGetRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/database/:database/document/:document", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;
        const documentUniqueIdentifier: string = req.params.document;

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

        const document: IImbricateDocument | null = await database.getDocument(
            documentUniqueIdentifier,
        );

        if (!document) {
            res.status(404).send("Document Not Found");
            return;
        }

        const properties: DocumentProperties = await document.getProperties();

        console.log(properties);

        res.send({
            properties,
        });
    });
};
