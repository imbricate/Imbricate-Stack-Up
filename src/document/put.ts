/**
 * @author WMXPY
 * @namespace Document
 * @description Put
 */

import { IImbricateOrigin, IMBRICATE_DOCUMENT_FEATURE, ImbricateAuthor, ImbricateDatabaseGetDocumentOutcome, ImbricateDatabaseManagerGetDatabaseOutcome, ImbricateDocumentPutPropertyOutcome, checkImbricateDocumentFeatureSupported } from "@imbricate/core";
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

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        const database: ImbricateDatabaseManagerGetDatabaseOutcome = await origin.getDatabaseManager().getDatabase(
            databaseUniqueIdentifier,
        );

        if (typeof database === "symbol") {

            console.error("Database Not Found", database);
            res.status(404).send("Database Not Found");
            return;
        }

        const document: ImbricateDatabaseGetDocumentOutcome = await database.database.getDocument(
            documentUniqueIdentifier,
        );

        if (typeof document === "symbol") {

            console.error("Document Not Found", document);
            res.status(404).send("Document Not Found");
            return;
        }

        const editRecords: ImbricateDocumentPutPropertyOutcome = await document.document.putProperties(
            body.properties,
            {
                author,
            },
        );

        if (typeof editRecords === "symbol") {

            console.error("Edit Records Not Found", editRecords);
            res.status(404).send("Edit Records Not Found");
            return;
        }

        if (checkImbricateDocumentFeatureSupported(
            document.document.supportedFeatures,
            IMBRICATE_DOCUMENT_FEATURE.DOCUMENT_PUT_EDIT_RECORD,
        )) {

            console.log("Add Edit Records", editRecords.editRecords);
            await document.document.addEditRecords(editRecords.editRecords);
        } else {

            console.log("Edit Records Not Supported, skipping");
        }

        res.send({
            documentUniqueIdentifier: document.document.uniqueIdentifier,
            documentVersion: document.document.documentVersion,
            properties: document.document.properties,
        });
    });
};
