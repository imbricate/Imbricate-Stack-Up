/**
 * @author WMXPY
 * @namespace Common
 * @description Properties
 */

import { IMBRICATE_PROPERTY_TYPE, ImbricatePropertyRecord, ImbricatePropertyValueObject } from "@imbricate/core";

export type DocumentPropertyInstance = {

    readonly key: string;
    readonly type: IMBRICATE_PROPERTY_TYPE;
    readonly value: ImbricatePropertyValueObject<IMBRICATE_PROPERTY_TYPE>;
};

export type DocumentPropertyInstanceRecord = Record<string, DocumentPropertyInstance>;

export const recordToInstanceRecord = (record: ImbricatePropertyRecord): DocumentPropertyInstanceRecord => {

    const result: DocumentPropertyInstanceRecord = Object.entries(record).reduce((
        instanceRecord,
        [key, value],
    ) => {

        return {
            ...instanceRecord,
            [key]: {
                key: value.propertyKey,
                type: value.propertyType,
                value: value.propertyValue,
            },
        };
    }, {} as DocumentPropertyInstanceRecord);

    return result;
};
