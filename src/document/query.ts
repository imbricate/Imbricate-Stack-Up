/**
 * @author WMXPY
 * @namespace Document
 * @description Query
 */

import { IImbricateOrigin, ImbricateDatabaseManagerGetDatabaseOutcome, ImbricateDatabaseQueryDocumentsOutcome, S_Database_QueryDocuments_Unknown } from "@imbricate/core";
import express from "express";
import { ImbricateDocumentGetResponse } from "./get";

export type ImbricateDocumentQueryResponse = {

    readonly documents: ImbricateDocumentGetResponse[];
};

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

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send(S_Database_QueryDocuments_Unknown.description);
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

        const documents: ImbricateDatabaseQueryDocumentsOutcome = await database.database.queryDocuments(body.query);

        if (typeof documents === "symbol") {

            console.error("Documents Not Found", documents);
            res.status(404).send(documents.description);
            return;
        }

        const response: ImbricateDocumentGetResponse[] = [];

        for (const document of documents.documents) {

            response.push({
                supportedFeatures: document.supportedFeatures,
                documentUniqueIdentifier: document.uniqueIdentifier,
                documentVersion: document.documentVersion,
                properties: document.properties,
                annotations: document.annotations,
            });
        }

        res.send({
            documents: response,
        });
    });
};
