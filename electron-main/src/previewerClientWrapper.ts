import { ServiceError } from "@grpc/grpc-js";
import { PreviewerClient } from "./generated/app_grpc_pb";
import {
  PlantUMLRenderingRequest,
  PlantUMLRenderingResponse,
} from "./generated/app_pb";

export class PreviewerClientWrapper {

    constructor(private client: PreviewerClient) {
      this.client = client;
    }

    async renderPlantUML(request: PlantUMLRenderingRequest): Promise<PlantUMLRenderingResponse> {
      return new Promise((resolve, reject) => {
        this.client.renderPlantUML(
          request,
          (err: ServiceError, response: PlantUMLRenderingResponse) => {
            if (err) {
              reject(err);
            } else {
              resolve(response)
            }
          }
        );
      });
    }
  }