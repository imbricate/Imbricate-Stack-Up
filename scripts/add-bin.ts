/**
 * @author WMXPY
 * @namespace Script
 * @description Add Bin
 */

import { readTextFile, writeTextFile } from "@sudoo/io";

(async () => {

    const packagePath: string = "./app/package.json";
    const packageFile: string = await readTextFile(packagePath);

    const packageObject: any = JSON.parse(packageFile);

    const updatedPackageObject: any = {
        ...packageObject,
        bin: {
            "stack-up": "./cli.js",
        },
    };

    console.log("[Build] Added bin to package.json");

    await writeTextFile(packagePath, updatedPackageObject);
})();
