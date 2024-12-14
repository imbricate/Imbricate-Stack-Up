/**
 * @author WMXPY
 * @description CLI
 */

import { IImbricateOrigin } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { Command } from "commander";
import { StackUpConfig } from "./definition";
import { createStackUpServer } from "./entry";
import { getApplicationDescription, getApplicationLogo } from "./util/description";

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
            .option("-d, --debug", "output extra debugging")
            .option("-p, --port <port>", "port to listen on", "3000")
            .argument("<config-file>", "configurations file path")
            .action(async (configFile: string, options) => {

                const logo = getApplicationLogo();
                console.log(logo);

                const rawConfig = await readTextFile(configFile);
                const config: StackUpConfig = JSON.parse(rawConfig);

                const application = await createStackUpServer(config);

                application.listen(options.port, () => {
                    console.log(`Server is running on port ${options.port}`);

                    for (const origin of config.originPersistencies) {
                        console.log(`Stack API: ${origin.originName} - ${origin.originLoadValue}`);
                    }
                });
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
