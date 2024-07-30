import { PredictOptionsDto } from '@libs/models/ai';
import { RpcException } from '@nestjs/microservices';
import * as tf from '@tensorflow/tfjs-node-gpu';
import { TFSavedModel } from "@tensorflow/tfjs-node/dist/saved_model";
import { DbService } from "../../data-source/db.service";

export abstract class BaseModel {
  tfSavedModel: TFSavedModel;
  options: PredictOptionsDto;

  constructor(model: TFSavedModel, options: PredictOptionsDto) {
    this.tfSavedModel = model;
    this.options = options;
  }

  abstract makeInput(dbService: DbService);
  abstract makeResult(out);

  async predict(dbService: DbService) {
    const [rs, rsNorm] = await this.makeInput(dbService);

    if (rsNorm && rsNorm.length > 0) {
      let input: tf.Tensor = tf.tensor([rsNorm]);
      const out = <tf.Tensor>this.tfSavedModel.predict(input);
      return [rs, this.makeResult(out.dataSync())];
    } else {
      throw new RpcException('Failed to make input dataset. No data.');
    }
  }
}
