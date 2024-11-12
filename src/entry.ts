/**
 * @author WMXPY
 * @description Entry
 */

import { IImbricateOrigin } from "@imbricate/core";
import express from "express";
import { StackUpConfig } from "./definition";
import { loadOriginsFromConfig } from "./util/load";

export const createStackUpServer = async (config: StackUpConfig): Promise<void> => {

    const originMap: Map<string, IImbricateOrigin> = await loadOriginsFromConfig(config);

    const application = express();

    application.get("/:origin/database/list", async (req, res) => {

        const originUniqueIdentifier: string = req.params.origin;

        const origin: IImbricateOrigin | null =
            originMap.get(originUniqueIdentifier) ?? null;

        if (!origin) {
            res.status(404).send("Origin Not Found");
            return;
        }

        res.send(await origin.getDatabaseManager().getDatabases());
    });

    application.listen(3000, () => {
        console.log("Server started on port 3000");
    });
};
