import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import * as tf from '@tensorflow/tfjs-node-gpu';
import { CommonConfigService } from "@libs/config";
import { join } from "path";
import { BaseModel } from "./models/base-model";
import { DbService } from "../data-source/db.service";
import { PredictOptionsDto, PredictEnvOptionsDto } from "@libs/models/ai";
import { InternalBasic } from "./models/internal-basic";
import { ExternalBasic } from "./models/external-basic";
import { ExternalWfs } from "./models/external-wfs";
import { CalcUtils, DateUtils } from "@libs/utils";
import { TFSavedModel } from "@tensorflow/tfjs-node-gpu/dist/saved_model";

@Injectable()
export class ModelService {
  private static AI_MODELS_DIR = 'ai_models';
  private modelClasses = {ExternalBasic, ExternalWfs, InternalBasic};
  //public static models: BaseModel[] = [];
  public static tfModels = new Map<string, TFSavedModel>();

  constructor(
    private configService: CommonConfigService,
    private dbService: DbService
  ) { }

  getModelPath(modelName: string) {
    return join(this.configService.root, ModelService.AI_MODELS_DIR, modelName);
  }

  async getModel(modelId, options): Promise<BaseModel> {
    let tfModel = ModelService.tfModels.get(modelId);
    if (!tfModel) {
      tfModel = await tf.node.loadSavedModel(this.getModelPath(modelId));
      const modelInfo = await tf.node.getMetaGraphsFromSavedModel(this.getModelPath(modelId));
      ModelService.tfModels.set(modelId, tfModel);
    }

    const model = new this.modelClasses[modelId](tfModel, options);
    return model;
  }

  /**
   * predict 24 hours environment
   * @param options 
   * @returns 
   */
  async predictEnv(options: PredictEnvOptionsDto) {
    if (!options.inDeviceIdx || !options.exDeviceIdx) {
      return new RpcException("Invalid deviceIdx");
    }

    const time = options.time? options.time : new Date().toISOString();

    const inOptions: PredictOptionsDto = {
      deviceIdx: options.inDeviceIdx,
      time: time
    }

    const exOptions: PredictOptionsDto = {
      deviceIdx: options.exDeviceIdx,
      time: time
    }

    // const exEnv = await (await this.getModel("ExternalWfs")).predict(this.dbService, exOptions);
    //let [exEnvPast, exEnvPred] = await (await this.getModel("ExternalBasic")).predict(this.dbService, exOptions);
    //let [inEnvPast, inEnvPred] = await (await this.getModel("InternalBasic")).predict(this.dbService, inOptions);
    let [exEnvPast, exEnvPred] = await (await this.getModel("ExternalBasic", exOptions)).predict(this.dbService);
    let [inEnvPast, inEnvPred] = await (await this.getModel("InternalBasic", inOptions)).predict(this.dbService);

    if (!exEnvPast || !exEnvPred || !inEnvPast || !inEnvPred) {
      throw new RpcException('No Result');
    }

    return {time, inEnvPred, exEnvPred};
  }

  async predict(options: PredictOptionsDto) {
    if (!options.modelId) {
      return new RpcException("Invalid modelId");
    }

    return (await this.getModel(options.modelId, options)).predict(this.dbService);
  }

}