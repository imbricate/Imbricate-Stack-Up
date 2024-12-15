/**
 * @author WMXPY
 * @namespace Document
 * @description Put
 */

import { IImbricateDatabase, IImbricateDocument, IImbricateOrigin, ImbricateAuthor } from "@imbricate/core";
import express from "express";

export const attachDocumentPutRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
    author: ImbricateAuthor,
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

        const editRecords = await document.putProperties(
            body.properties,
            {
                author,
            },
        );

        if (document.addEditRecords) {
            await document.addEditRecords(editRecords);
        }

        res.send({
            documentUniqueIdentifier: document.uniqueIdentifier,
            documentVersion: document.documentVersion,
            properties: document.properties,
        });
    });
};
