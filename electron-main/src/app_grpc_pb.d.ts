// package: 
// file: app.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as app_pb from "./app_pb";

interface IPreviewerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    renderPlantUML: IPreviewerService_IRenderPlantUML;
}

interface IPreviewerService_IRenderPlantUML extends grpc.MethodDefinition<app_pb.PlantUMLRenderingRequest, app_pb.PlantUMLRenderingResponse> {
    path: "/Previewer/RenderPlantUML";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<app_pb.PlantUMLRenderingRequest>;
    requestDeserialize: grpc.deserialize<app_pb.PlantUMLRenderingRequest>;
    responseSerialize: grpc.serialize<app_pb.PlantUMLRenderingResponse>;
    responseDeserialize: grpc.deserialize<app_pb.PlantUMLRenderingResponse>;
}

export const PreviewerService: IPreviewerService;

export interface IPreviewerServer {
    renderPlantUML: grpc.handleUnaryCall<app_pb.PlantUMLRenderingRequest, app_pb.PlantUMLRenderingResponse>;
}

export interface IPreviewerClient {
    renderPlantUML(request: app_pb.PlantUMLRenderingRequest, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
    renderPlantUML(request: app_pb.PlantUMLRenderingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
    renderPlantUML(request: app_pb.PlantUMLRenderingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
}

export class PreviewerClient extends grpc.Client implements IPreviewerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public renderPlantUML(request: app_pb.PlantUMLRenderingRequest, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
    public renderPlantUML(request: app_pb.PlantUMLRenderingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
    public renderPlantUML(request: app_pb.PlantUMLRenderingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: app_pb.PlantUMLRenderingResponse) => void): grpc.ClientUnaryCall;
}
