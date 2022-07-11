import {find} from "lodash-es";
import {PassportReg} from "@/utils/config";

export enum RuleKey {
  "require" = "require",
  "max" = "max",
  "reg" = "reg",
  "min" = "min",
  "sameOther" = "sameOther",
}

export function checkInput(name: string, allValue: any, rules: any) {
  let thisRule = find(rules, {key: name})
  if (!thisRule) {
    return '';
  }
  let value = allValue[name];
  let {rule} = thisRule;
  for (let i = 0; i < rule?.length; i++) {
    if (rule[i].require) {
      if (!value) {
        return rule[i].msg;
      }
    }
    if (rule[i].max) {
      if (value.length > rule[i].max) {
        return rule[i].msg
      }
    }
    if (rule[i].min) {
      if (value.length < rule[i].min) {
        return rule[i].msg
      }
    }
    if (rule[i].reg) {
      if (!rule[i].reg.test(value)) {
        return rule[i].msg
      }
    }
    if (rule[i].sameOther) {
      let otherValue = allValue[rule[i].sameOther];
      if (otherValue !== value) {
        return rule[i].msg;
      }
    }
  }
  return "";
}

export function checkAllParams(params: object, rules: any) {
  let arr: string[] = Object.keys(params);
  let errMsg = '';
  arr.forEach((item) => {
    if (!errMsg) {
      errMsg = checkInput(item, params, rules);
    }
  })
  return errMsg;
}

export interface RuleItem {
  key: string,
  rule: any[]
}

