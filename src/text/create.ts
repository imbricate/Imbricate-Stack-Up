/**
 * @author WMXPY
 * @namespace Text
 * @description Create
 */

import { IImbricateOrigin, IImbricateText } from "@imbricate/core";
import express from "express";

export const attachTextCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.post("/:origin/create-text", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        const text: IImbricateText = await origin.getTextManager().createText(
            body.textName,
            body.textContent,
        );

        res.send({
            textUniqueIdentifier: text.uniqueIdentifier,
        });
    });
};
