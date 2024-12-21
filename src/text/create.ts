/**
 * @author WMXPY
 * @namespace Text
 * @description Create
 */

import { IImbricateOrigin, ImbricateAuthor, ImbricateTextManagerCreateTextOutcome } from "@imbricate/core";
import express from "express";

export const attachTextCreateRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
    author: ImbricateAuthor,
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

        const text: ImbricateTextManagerCreateTextOutcome = await origin.getTextManager().createText(
            body.content,
            {
                author,
            },
        );

        if (typeof text === "symbol") {

            console.error("Text Not Found", text);
            res.status(404).send("Text Not Found");
            return;
        }

        res.send({
            textUniqueIdentifier: text.text.uniqueIdentifier,
        });
    });
};
