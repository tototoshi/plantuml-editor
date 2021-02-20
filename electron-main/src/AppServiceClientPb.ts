/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as app_pb from './app_pb';


export class PreviewerClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoRenderPlantUML = new grpcWeb.AbstractClientBase.MethodInfo(
    app_pb.PlantUMLRenderingResponse,
    (request: app_pb.PlantUMLRenderingRequest) => {
      return request.serializeBinary();
    },
    app_pb.PlantUMLRenderingResponse.deserializeBinary
  );

  renderPlantUML(
    request: app_pb.PlantUMLRenderingRequest,
    metadata: grpcWeb.Metadata | null): Promise<app_pb.PlantUMLRenderingResponse>;

  renderPlantUML(
    request: app_pb.PlantUMLRenderingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: app_pb.PlantUMLRenderingResponse) => void): grpcWeb.ClientReadableStream<app_pb.PlantUMLRenderingResponse>;

  renderPlantUML(
    request: app_pb.PlantUMLRenderingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: app_pb.PlantUMLRenderingResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/Previewer/RenderPlantUML',
        request,
        metadata || {},
        this.methodInfoRenderPlantUML,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/Previewer/RenderPlantUML',
    request,
    metadata || {},
    this.methodInfoRenderPlantUML);
  }

}

