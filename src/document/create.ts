/**
 * @author WMXPY
 * @namespace Document
 * @description Create
 */

import { IImbricateOrigin, IMBRICATE_DOCUMENT_FEATURE, ImbricateAuthor, ImbricateDatabaseCreateDocumentOutcome, ImbricateDatabaseManagerGetDatabaseOutcome, S_Database_CreateDocument_Unknown } from "@imbricate/core";
import express from "express";

export type ImbricateDocumentCreateResponse = {

    readonly supportedFeatures: IMBRICATE_DOCUMENT_FEATURE[];

    readonly documentUniqueIdentifier: string;
    readonly documentVersion: string;
};

export const attachDocumentCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
    author: ImbricateAuthor,
): Promise<void> => {

    application.post("/:origin/database/:database/create-document", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const databaseUniqueIdentifier: string = req.params.database;

        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send(S_Database_CreateDocument_Unknown.description);
            return;
        }

        const database: ImbricateDatabaseManagerGetDatabaseOutcome = await origin.getDatabaseManager().getDatabase(
            databaseUniqueIdentifier,
        );

        if (typeof database === "symbol") {

            console.error("Database Not Found", database);
            res.status(404).send(database.description);
            return;
        }

        try {
            const document: ImbricateDatabaseCreateDocumentOutcome = await database.database.createDocument(
                body.properties,
                {
                    author,
                },
            );

            if (typeof document === "symbol") {

                console.error("Document Not Found", document);
                res.status(404).send(document.description);
                return;
            }

            const response: ImbricateDocumentCreateResponse = {
                supportedFeatures: document.document.supportedFeatures,
                documentUniqueIdentifier: document.document.uniqueIdentifier,
                documentVersion: document.document.documentVersion,
            };

            res.send(response);
        } catch (error) {

            console.error(error);

            res.status(500).send(S_Database_CreateDocument_Unknown.description);
        }
    });
};
