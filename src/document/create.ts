/**
 * @author WMXPY
 * @namespace Document
 * @description Create
 */

import { IImbricateDatabase, IImbricateDocument, IImbricateOrigin, ImbricateAuthor } from "@imbricate/core";
import express from "express";

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

        try {
            const document: IImbricateDocument = await database.createDocument(
                body.properties,
                {
                    author,
                },
            );

            res.send({
                documentUniqueIdentifier: document.uniqueIdentifier,
                documentVersion: document.documentVersion,
            });
        } catch (error) {

            console.error(error);

            res.status(500).send({
                error: (error as any).message,
            });
        }
    });
};
