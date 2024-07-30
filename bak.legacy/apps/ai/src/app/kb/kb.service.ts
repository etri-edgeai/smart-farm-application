import { Injectable, Logger } from '@nestjs/common';
import { PestPredictRequestDto, PestPredictResultDto, PestRuleCondition, PestRuleDto } from '@libs/models/ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SdhBase, SdhInternal } from '@libs/db/sensor';
import { DateUtils } from '@libs/utils';
import { promises as fs } from 'fs';

const leafMoldRule = `{
      "name": "leaf mold",
      "period": 7,
      "conditions": [
        {"type": "crop", "value": 1, "score": 2},
        {"type": "internal", "field": "sie_temp", "aggr": "avg", "from": 20, "to": 25, "score": 2},
        {"type": "internal", "field": "sie_temp", "aggr": "avg", "from": 22, "to": 24, "score": 3},
        {"type": "internal", "field": "sie_humidity", "aggr": "avg", "from": 85, "to": 100, "score": 2},
        {"type": "internal", "field": "sie_humidity", "aggr": "avg", "from": 90, "to": 100, "score": 3}
      ]
    }`;

const powderyMildewRule = `
    {
      "name": "powdery mildew",
      "period": 7,
      "conditions": [
        {"type": "crop", "value": 1, "score": 2},
        {"type": "date", "from": "03-01", "to": "06-30", "score": 3},
        {"type": "date", "from": "09-01", "to": "10-31", "score": 3},
        {"type": "internal", "field": "sie_temp", "aggr": "avg", "from": 20, "to": 25, "score": 5},
        {"type": "internal", "field": "sie_humidity", "aggr": "avg", "from": 0, "to": 60, "score": 5}
      ]
    }`;

const grayMoldRule = `{
      "name": "gray mold",
      "period": 14,
      "conditions": [
        {"type": "crop", "value": 1, "score": 2},
        {"type": "date", "from": "12-01", "to": "05-31", "score": 3},
        {"type": "internal", "field": "sie_temp", "aggr": "avg", "from": 18, "to": 22, "score": 5},
        {"type": "internal", "field": "sie_humidity", "aggr": "avg", "from": 85, "to": 100, "score": 2},
        {"type": "internal", "field": "sie_humidity", "aggr": "avg", "from": 90, "to": 100, "score": 3}
      ]
    }`;



@Injectable()
export class KbService {
  constructor(@InjectRepository(SdhInternal) private sdhInternalRepo: Repository<SdhInternal>) {
    let testRule;
    testRule = JSON.parse(powderyMildewRule);
    this.predictPestAll(testRule, new Date('2022-01-01'), new Date());

    testRule = JSON.parse(leafMoldRule);
    this.predictPestAll(testRule, new Date('2022-01-01'), new Date());

    testRule = JSON.parse(grayMoldRule);
    this.predictPestAll(testRule, new Date('2022-01-01'), new Date());
  }

  /**
   * predict by date range and all farm for analysis
   */
  async predictPestAll(rule: PestRuleDto, startDate: Date, endDate: Date) {
    Logger.log("Start predictPestAll");
    const all: { date: string, scores: Map<number, number> }[] = [];
    const idxSet = new Set<number>();

    const dates = DateUtils.getDatesByRange(startDate, endDate);
    for (const date of dates) {
      const scores = await this.evalRule(rule, date);
      if (scores.size > 0) {
        all.push({ date, scores });
        for (const idx of scores.keys()) {
          idxSet.add(idx);
        }
      }
    }

    const fileName = "predict_" + rule.name.replace(" ", "_") + ".csv";
    try {
      await fs.truncate(fileName);
    } catch {
      // passthrough
    }

    // header
    await fs.appendFile(fileName, "date, ");
    for (const idx of idxSet) {
      await fs.appendFile(fileName, idx + ", ");
    }
    await fs.appendFile(fileName, "\n");

    for (const date of all) {
      let line = DateUtils.format(date.date, DateUtils.simpleDateFormat) + ", ";
      for (const idx of idxSet) {
        const score = date.scores.get(idx);
        if (score) {
          line += score + ", "
        } else {
          line += "0, "
        }
      }

      line = line.substring(0, line.length - 2);
      line += "\n";

      await fs.appendFile(fileName, line);
    }

    Logger.log("End predictPestAll!");
  }

  async predictPest(data: PestPredictRequestDto): Promise<PestPredictResultDto> {
    let testRule = JSON.parse(powderyMildewRule);

    const baseDate = new Date(data.baseTime);
    const scores = await this.evalRule(testRule, baseDate, [data.deviceIdx]);
    return { name: testRule.name, scores:Array.from(scores.entries()).map(e => { return {deviceIdx: e[0], score: e[1]} }) };
  }

  /**
   *
   * @param baseDate
   */
  async evalRule(rule: PestRuleDto, baseDate = new Date(), deviceIdxes?: number[]) {
    let startDate = DateUtils.add(baseDate, -rule.period);
    let endDate = baseDate;
    const startDk = DateUtils.toDayKey(startDate);
    const endDk = DateUtils.toDayKey(endDate);

    const scores = new Map<number, number>(); // idx, score
    if (deviceIdxes) {
      for (const idx of deviceIdxes) {
        scores.set(idx, 0);
      }
    }

    let uniScore = 0; // same to all devices;

    for (const cond of rule.conditions) {
      const condScores = await this.evalCondition(cond, startDk, endDk, deviceIdxes);
      if (!condScores) continue;

      if (typeof condScores == 'number') {
        uniScore += condScores;

      } else {
        for (const deviceIdx of condScores.keys()) {
          let score = condScores.get(deviceIdx);
          score = (scores.get(deviceIdx) || 0) + score;
          scores.set(deviceIdx, score);
        }
      }
    }

    for (const deviceIdx of scores.keys()) {
      let score = scores.get(deviceIdx);
      score = (scores.get(deviceIdx) || 0) + uniScore;
      scores.set(deviceIdx, score);
    }

    return scores;
  }

  async evalCondition(cond: PestRuleCondition, startDk, endDk, deviceIdxes?) {
    switch (cond.type) {
      case 'date':
        return await this.evalDateCondition(cond, startDk, endDk, deviceIdxes);
      case 'internal':
      case 'external':
      case 'culture':
        return await this.evalEnvCondition(cond, startDk, endDk, deviceIdxes);
    }

    return null;
  }

  async evalDateCondition(cond: PestRuleCondition, startDk, endDk, deviceIdxes?) {
    const year = new Date().getFullYear();
    const _from = new Date(year + '-' + cond.from);
    const _to = new Date(year + '-' + cond.to);

    if (_from > _to) {
      _to.setFullYear(year + 1);
    }

    const _startDate = DateUtils.dayKeyToDate(startDk);
    const _endDate = DateUtils.dayKeyToDate(endDk);

    if (_endDate < _from) {
      _from.setFullYear(_from.getFullYear() - 1);
      _to.setFullYear(_to.getFullYear() - 1);
    }

    const evalStartDate = _from > _startDate ? _from : _startDate;
    const evalEndDate = _to < _endDate ? _to : _endDate;

    //console.log("ft", _from, _to);
    //console.log("se", _startDate, _endDate);
    //console.log("ev", evalStartDate, evalEndDate);

    if (evalStartDate > evalEndDate) {
      return null;
    }

    const diff = DateUtils.diff(evalStartDate, evalEndDate);
    const score = (diff + 1) * cond.score;

    return score;
  }

  async evalEnvCondition(cond: PestRuleCondition, startDk, endDk, deviceIdxes?: []) {
    let repo: Repository<SdhBase>;

    switch (cond.type) {
      case 'internal':
        repo = this.sdhInternalRepo;
        break;
      case 'external':
      case 'culture':
    }

    let field = cond.aggr ? `${cond.aggr}(${cond.field})` : cond.field;

    let query = repo
      .createQueryBuilder()
      .select(['device_idx', 'dayKey'])
      .addSelect(field, 'value')
      .where('daykey between :startDk and :endDk', { startDk: startDk, endDk: endDk });

    if (deviceIdxes) {
      query = query.andWhere('device_idx in (:devices)', { devices: deviceIdxes.toString() });
    }

    query = query.groupBy('device_idx').addGroupBy('dayKey');

    const queryString = query.getSql();
    // console.log(queryString);

    let rs = await query.getRawMany();
    const scores = new Map<number, number>();

    for (const r of rs) {
      if (cond.value != null && +r.value == +cond.value) {
        let score = (scores.get(+r.device_idx) || 0) + cond.score;
        scores.set(+r.device_idx, score);
      } else if (cond.from != null && cond.to != null && +r.value >= +cond.from && +r.value <= +cond.to) {
        let score = (scores.get(+r.device_idx) || 0) + cond.score;
        scores.set(+r.device_idx, score);
      }
    }

    return scores;
  }
}
