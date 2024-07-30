import { PredictOptionsDto } from "@libs/models/ai";
import { AiUtils, DateUtils } from "@libs/utils";
import { RpcException } from "@nestjs/microservices";
import { DbService } from "../../data-source/db.service";
import { BaseModel } from "./base-model";

export class ExternalBasic extends BaseModel {
  async makeInput(dbService: DbService) {
    if (!this.options.deviceIdx) {
      throw new RpcException("Invalid deviceIdx");
    }

    const rs = await dbService.loadExternalEnv(this.options);
    const rsRaw = [];
    const rsNorm = [];

    if (rs && rs.length > 288) {
      for (let i = 0; i < 288; i++) {
        const idx = Math.floor(rs.length * i / 288);
        const t = AiUtils.tempNorm(rs[idx]['t'])
        const h = rs[idx]['h'] / 100;
        const sincos = AiUtils.dateToSincos(rs[idx]['sdt']);
        const row = [t, h, ...sincos];

        rsNorm.push(row);
      }

      for (const r of rs) {
        rsRaw.push([r['sdt'], r['t'], r['h']])
      }
    }

    return [rsRaw, rsNorm];
  }

  /**
   * [temp, humidity] * 144(10분)
   * @param rs 
   * @returns 
   */
  makeResult(rs: []) {
    const out = [];

    for (let i = 0; i < rs.length; i = i + 2) {
      const time = DateUtils.add(new Date(this.options.time), 10 * (i / 2 + 1), 'm').toDate();
      out.push([time, AiUtils.tempDenorm(rs[i]), AiUtils.humidityDenorm(rs[i + 1])]);
    }

    return out;
  }
}