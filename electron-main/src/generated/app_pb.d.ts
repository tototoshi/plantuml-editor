// package: 
// file: app.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PlantUMLRenderingRequest extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): PlantUMLRenderingRequest;
    getFormat(): FileFormat;
    setFormat(value: FileFormat): PlantUMLRenderingRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlantUMLRenderingRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PlantUMLRenderingRequest): PlantUMLRenderingRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlantUMLRenderingRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlantUMLRenderingRequest;
    static deserializeBinaryFromReader(message: PlantUMLRenderingRequest, reader: jspb.BinaryReader): PlantUMLRenderingRequest;
}

export namespace PlantUMLRenderingRequest {
    export type AsObject = {
        data: Uint8Array | string,
        format: FileFormat,
    }
}

export class PlantUMLRenderingResponse extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): PlantUMLRenderingResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlantUMLRenderingResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PlantUMLRenderingResponse): PlantUMLRenderingResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlantUMLRenderingResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlantUMLRenderingResponse;
    static deserializeBinaryFromReader(message: PlantUMLRenderingResponse, reader: jspb.BinaryReader): PlantUMLRenderingResponse;
}

export namespace PlantUMLRenderingResponse {
    export type AsObject = {
        data: Uint8Array | string,
    }
}

export enum FileFormat {
    SVG = 0,
    PNG = 1,
}
