/**
 * @author WMXPY
 * @namespace Document
 * @description Put
 */

import { DocumentProperties, IImbricateDatabase, IImbricateDocument, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDocumentPutRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.put("/:origin/database/:database/document/:document", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;
        const documentUniqueIdentifier: string = req.params.document;

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

        const document: IImbricateDocument | null = await database.getDocument(
            documentUniqueIdentifier,
        );

        if (!document) {
            res.status(404).send("Document Not Found");
            return;
        }

        await document.putProperties(
            body.properties,
        );

        const properties: DocumentProperties = await document.getProperties();

        res.send({
            properties,
        });
    });
};
