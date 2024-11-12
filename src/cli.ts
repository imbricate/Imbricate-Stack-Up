/**
 * @author WMXPY
 * @description CLI
 */

import { IImbricateOrigin } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { Command } from "commander";
import { StackUpConfig } from "./definition";
import { createStackUpServer } from "./entry";
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
            .name("stack-up")
            .configureHelp({
                showGlobalOptions: true,
            })
            .description(getApplicationDescription())
            .option('-d, --debug', 'output extra debugging')
            .argument('<config-file>', 'configurations file path')
            .action(async (configFile: string) => {

                const rawConfig = await readTextFile(configFile);
                const config: StackUpConfig = JSON.parse(rawConfig);

                await createStackUpServer(config);

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

execute();