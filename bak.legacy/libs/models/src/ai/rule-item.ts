export enum RuleAggr {
  NONE="", AVG="avg", MAX="max", MIN="min"
}

export enum RuleRange {
  D1, D2, D3, W1, W2, M1, M2
}

export enum RuleDuration {
  ALL="all", DAY="day", NIGHT="night"
}
export enum RuleDiv {
  M5 = 300, H1 = 3600
}

export enum RuleComparison {
  EQ, GTE, GT, LT, LTE
}

export enum RuleOperator {
  AND, OR
}

export class RuleItem {
  field: string;
  aggr: RuleAggr;
  duration: RuleDuration;
  div: RuleDiv;
  comparison: RuleComparison;
  value: number; // or semantic, "normal, high, low, ..."
}

export class RuleGroup {
  op: RuleOperator; 
  groups: RuleGroup[];
  items: RuleItem[]
}

