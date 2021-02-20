import * as jspb from 'google-protobuf'



export class PlantUMLRenderingRequest extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): PlantUMLRenderingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlantUMLRenderingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlantUMLRenderingRequest): PlantUMLRenderingRequest.AsObject;
  static serializeBinaryToWriter(message: PlantUMLRenderingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlantUMLRenderingRequest;
  static deserializeBinaryFromReader(message: PlantUMLRenderingRequest, reader: jspb.BinaryReader): PlantUMLRenderingRequest;
}

export namespace PlantUMLRenderingRequest {
  export type AsObject = {
    data: Uint8Array | string,
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
  static serializeBinaryToWriter(message: PlantUMLRenderingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlantUMLRenderingResponse;
  static deserializeBinaryFromReader(message: PlantUMLRenderingResponse, reader: jspb.BinaryReader): PlantUMLRenderingResponse;
}

export namespace PlantUMLRenderingResponse {
  export type AsObject = {
    data: Uint8Array | string,
  }
}

