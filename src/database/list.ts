/**
 * @author WMXPY
 * @namespace Database
 * @description List
 */

import { DatabaseAnnotations, IImbricateDatabase, IImbricateOrigin, IMBRICATE_DATABASE_FEATURE, ImbricateDatabaseManagerListDatabasesOutcome, ImbricateDatabaseSchema, S_DatabaseManager_ListDatabases_Unknown } from "@imbricate/core";
import express from "express";

export type ImbricateDatabaseListResponse = {

    readonly databases: {
        readonly supportedFeatures: IMBRICATE_DATABASE_FEATURE[];

        readonly databaseUniqueIdentifier: string;
        readonly databaseVersion: string;
        readonly databaseName: string;
        readonly databaseSchema: ImbricateDatabaseSchema;
        readonly databaseAnnotations: DatabaseAnnotations;
    }[];
};

export const attachDatabaseListRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/list-database", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send(S_DatabaseManager_ListDatabases_Unknown.description);
            return;
        }

        const databases: ImbricateDatabaseManagerListDatabasesOutcome = await origin.getDatabaseManager().listDatabases();

        if (typeof databases === "symbol") {

            console.error("List Databases Failed", databases);
            res.status(404).send(databases.description);
            return;
        }

        const response: ImbricateDatabaseListResponse = {
            databases: databases.databases.map((database: IImbricateDatabase) => {
                return {
                    supportedFeatures: database.supportedFeatures,
                    databaseUniqueIdentifier: database.uniqueIdentifier,
                    databaseVersion: database.databaseVersion,
                    databaseName: database.databaseName,
                    databaseSchema: database.schema,
                    databaseAnnotations: database.annotations,
                };
            }),
        };

        res.send(response);
    });
};
