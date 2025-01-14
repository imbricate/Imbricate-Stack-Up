/**
 * @author WMXPY
 * @namespace Origin
 * @description Query Origin Action
 */

import { IImbricateOrigin, ImbricateCommonQueryOriginActionsOutcome, ImbricateCommonQueryOriginActionsQuery, ImbricateOriginAction, S_Common_QueryOriginActions_Unknown } from "@imbricate/core";
import express from "express";

export const attachOriginQueryQueryActionRoute = async (
    application: express.Express,
    originMap: Map<string, IImbricateOrigin>,
): Promise<void> => {

    application.post("/:origin/query-origin-action", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;
        const body: any = req.body;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {

            console.error("Origin Not Found", originUniqueIdentifier);
            res.status(404).send(S_Common_QueryOriginActions_Unknown.description);
            return;
        }

        const query: ImbricateCommonQueryOriginActionsQuery = body.query ?? {};
        const actions: ImbricateCommonQueryOriginActionsOutcome = await origin.queryOriginActions(query);

        if (typeof actions === "symbol") {

            console.error("Actions Not Found", actions);
            res.status(404).send(actions.description);
            return;
        }

        const response = {

            actions: actions.actions.map((action: ImbricateOriginAction) => {

                return {
                    actionIdentifier: action.actionIdentifier,
                    actionName: action.actionName,
                    actionDescription: action.actionDescription,
                    parameters: action.parameters,
                    appearance: action.appearance,
                    disabled: action.disabled,
                };
            }),
            count: actions.count,
        };

        res.send(response);
    });
};
