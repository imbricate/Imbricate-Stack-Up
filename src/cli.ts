/**
 * @author WMXPY
 * @description CLI
 */

import { IImbricateOrigin } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { Command } from "commander";
import { getApplicationDescription } from "./util/description";

export const execute = async (): Promise<void> => {

    await executeWithConfiguration(
        process.argv,
    );
};

export const executeWithConfiguration = async (
    commands: string[],
): Promise<void> => {

    const program = new Command();
    const origins: IImbricateOrigin[] = [];

    try {

        program
            .version("<current-version>")
            .name("imbricate stack up")
            .configureHelp({
                showGlobalOptions: true,
            })
            .description(getApplicationDescription())
            .option('-d, --debug', 'output extra debugging')
            .argument('<config-file>', 'configurations file path')
            .action(async (configFile: string) => {

                const rawConfig = await readTextFile(configFile);
                const config: any = JSON.parse(rawConfig);

                console.log(config);
            });

        await program.parseAsync(commands);
    } catch (error) {

        console.error(error);
    } finally {

        for (const origin of origins) {
            if (origin.dispose) {
                await origin.dispose();
            }
        }
    }
};