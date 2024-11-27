/**
 * @author WMXPY
 * @namespace Search
 * @description Search
 */

import { IImbricateOrigin, ImbricateSearchResult } from "@imbricate/core";
import express from "express";

export const attachSearchSearchRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.post("/:origin/search", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            console.log("Origin Not Found", originUniqueIdentifier);
            res.status(404).send("Origin Not Found");
            return;
        }

        const searchResult: ImbricateSearchResult = await origin.search(body.keyword);

        res.send({
            result: searchResult,
        });
    });
};
