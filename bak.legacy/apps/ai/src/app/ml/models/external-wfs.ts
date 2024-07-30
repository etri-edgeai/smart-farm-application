import { PredictOptionsDto } from "@libs/models/ai";
import { AiUtils } from "@libs/utils";
import { RpcException } from "@nestjs/microservices";
import { DbService } from "../../data-source/db.service";
import { BaseModel } from "./base-model";

export class ExternalWfs extends BaseModel {
  async makeInput(dbService: DbService) {
    if (!this.options.deviceIdx) {
      throw new RpcException("Invalid deviceIdx");
    }

    const rs = await dbService.loadExternalEnv(this.options);
    const ret = [];

    for (let i = 0; i < 288; i++) {
      const idx = Math.floor(rs.length * i / 288);
      const t = AiUtils.tempNorm(rs[idx]['t'])
      const h = rs[idx]['h'] / 100;
      const sincos = AiUtils.dateToSincos(rs[idx]['sdt']);
      const row = [t, h, ...sincos];

      ret.push(row);
    }

    return ret;
  }

  /**
   * [temp, humidity] * 144(10분)
   * @param rs 
   * @returns 
   */
  makeResult(rs: []) {
    const out = [];

    for (let i = 0; i < rs.length; i = i + 2) {
      out.push([AiUtils.tempDenorm(rs[i]), AiUtils.humidityDenorm(rs[i + 1])]);
    }

    return out;
  }
}