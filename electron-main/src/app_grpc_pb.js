// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var app_pb = require('./app_pb.js');

function serialize_PlantUMLRenderingRequest(arg) {
  if (!(arg instanceof app_pb.PlantUMLRenderingRequest)) {
    throw new Error('Expected argument of type PlantUMLRenderingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PlantUMLRenderingRequest(buffer_arg) {
  return app_pb.PlantUMLRenderingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PlantUMLRenderingResponse(arg) {
  if (!(arg instanceof app_pb.PlantUMLRenderingResponse)) {
    throw new Error('Expected argument of type PlantUMLRenderingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PlantUMLRenderingResponse(buffer_arg) {
  return app_pb.PlantUMLRenderingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PreviewerService = exports.PreviewerService = {
  renderPlantUML: {
    path: '/Previewer/RenderPlantUML',
    requestStream: false,
    responseStream: false,
    requestType: app_pb.PlantUMLRenderingRequest,
    responseType: app_pb.PlantUMLRenderingResponse,
    requestSerialize: serialize_PlantUMLRenderingRequest,
    requestDeserialize: deserialize_PlantUMLRenderingRequest,
    responseSerialize: serialize_PlantUMLRenderingResponse,
    responseDeserialize: deserialize_PlantUMLRenderingResponse,
  },
};

exports.PreviewerClient = grpc.makeGenericClientConstructor(PreviewerService);
