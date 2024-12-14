/**
 * @author WMXPY
 * @namespace Document
 * @description Edit Records
 */

import { DocumentEditRecord, IImbricateDatabase, IImbricateDocument, IImbricateOrigin } from "@imbricate/core";
import express from "express";

export const attachDocumentGetEditRecordsRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/database/:database/document/:document/edit-records", async (req, res) => {

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

        if (typeof document.getEditRecords !== "function") {
            res.status(501).send("Document Not Support Edit Records");
            return;
        }

        const editRecords: DocumentEditRecord[] = await document.getEditRecords();

        res.send({
            editRecords,
        });
    });
};
