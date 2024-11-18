/**
 * @author WMXPY
 * @namespace Text
 * @description Get
 */

import { IImbricateOrigin, IImbricateText } from "@imbricate/core";
import express from "express";

export const attachTextGetRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.get("/:origin/text/:text", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const textUniqueIdentifier: string = req.params.text;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const text: IImbricateText | null = await origin.getTextManager().getText(
            textUniqueIdentifier,
        );

        if (!text) {
            res.status(404).send("Text Not Found");
            return;
        }

        const textContent: string = await text.getContent();

        res.send({
            textUniqueIdentifier: text.uniqueIdentifier,
            content: textContent,
        });
    });
};
