export class PestRuleCondition {
  type: "crop" | "date" | "internal" | "external" | "culture";
  field: string;
  aggr?: "avg" | "min" | "max"
  from?: string|number;
  to?: string|number;
  value?: string|number;
  score: number;
}

export class PestRuleDto {
  period: number;
  conditions: (PestRuleCondition)[]
}