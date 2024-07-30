import { PredictOptionsDto } from "@libs/models/ai";
import { AiUtils, DateUtils } from "@libs/utils";
import { RpcException } from "@nestjs/microservices";
import { DbService } from "../../data-source/db.service";
import { BaseModel } from "./base-model";

export class InternalBasic extends BaseModel {
  async makeInput(dbService: DbService) {
    if (!this.options.deviceIdx) {
      throw new RpcException("Invalid deviceIdx");
    }

    const rs = await dbService.loadInternalEnv(this.options);
    const rsRaw = [];
    const rsNorm = [];

    if (rs && rs.length > 0) {
      for (let i = 0; i < 288; i++) {
        const idx = Math.floor(rs.length * i / 288);
        const t = AiUtils.tempNorm(rs[idx]['t'])
        const h = rs[idx]['h'] / 100;
        const co2 = AiUtils.co2Norm(rs[idx]['co2'])
        const sincos = AiUtils.dateToSincos(rs[idx]['sdt']);
        const row = [t, h, co2, ...sincos];

        rsNorm.push(row);
      }

      for (const r of rs) {
        rsRaw.push([r['sdt'], r['t'], r['h'], r['co2']])
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

    for (let i = 0; i < rs.length; i = i + 3) {
      const time = DateUtils.add(new Date(this.options.time), 10 * (i / 3 + 1), 'm').toDate();
      out.push([time, AiUtils.tempDenorm(rs[i]), AiUtils.humidityDenorm(rs[i + 1]), AiUtils.co2Denorm(rs[i + 2])]);
    }

    return out;
  }
}