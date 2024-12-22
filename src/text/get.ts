/**
 * @author WMXPY
 * @namespace Text
 * @description Get
 */

import { IImbricateOrigin, ImbricateTextGetContentOutcome, ImbricateTextManagerGetTextOutcome, S_TextManager_GetText_Unknown } from "@imbricate/core";
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

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send(S_TextManager_GetText_Unknown.description);
            return;
        }

        const text: ImbricateTextManagerGetTextOutcome = await origin.getTextManager().getText(
            textUniqueIdentifier,
        );

        if (typeof text === "symbol") {

            console.error("Text Not Found", text);
            res.status(404).send(text.description);
            return;
        }

        const textContent: ImbricateTextGetContentOutcome = await text.text.getContent();

        if (typeof textContent === "symbol") {

            console.error("Text Content Not Found", textContent);
            res.status(404).send(textContent.description);
            return;
        }

        res.send({
            textUniqueIdentifier: text.text.uniqueIdentifier,
            content: textContent.content,
        });
    });
};
