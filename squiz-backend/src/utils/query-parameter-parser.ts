import { Request } from 'express';
import * as lodash from 'lodash';
import { ParsedQs } from 'qs';
import { convertDateToUnixTimeStamp, convertUnixTimeStampToDate } from './timestamp.service';

export function booleanOrDefault(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return lodash.isString(value) && value.trim().toLowerCase() === 'true' ? true : defaultValue;
}

export function checkIsNumber(value: string): boolean {
  try {
    const regEx = /^\d+$/;
    return regEx.test(value);
  } catch (error) {
    return false;
  }
}

export function checkIsDecimal(value: string): boolean {
  try {
    const regEx = /^\d*\.{0,1}\d+$/;
    return regEx.test(value);
  } catch (error) {
    return false;
  }
}

export function numberOrDefault(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
  defaultValue = 0,
): number {
  if (!value || !checkIsNumber(value.toString().trim())) {
    return defaultValue;
  }
  try {
    return +value;
  } catch (error) {
    return defaultValue;
  }
}

export function floatOrDefault(value: string | string[] | ParsedQs | ParsedQs[], defaultValue = 0): number {
  if (!value) {
    return defaultValue;
  }
  try {
    return parseFloat(value as string);
  } catch (error) {
    return defaultValue;
  }
}

export function csvStringToArray(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string[] {
  const arrayParam: string[] = [];

  if (!lodash.isEmpty(value) && typeof value === 'string') {
    value
      .split(',')
      .filter((l): boolean => l.trim() !== '')
      .map((l): string => l.trim())
      .forEach((l): number => arrayParam.push(l));
  }
  return lodash.uniq(arrayParam);
}

export function interceptEventQueryParams(req: Request, keyName: string): void {
  if (req.query[keyName]) {
    const formattedDateTime = convertUnixTimeStampToDate(+req.query[keyName].toString());
    const newTime = convertDateToUnixTimeStamp(formattedDateTime);
    if (newTime.toString() !== '') {
      req.query[keyName] = newTime.toString();
      const originUrlArr = req.originalUrl.split('?');
      const headerArr = originUrlArr.length > 1 ? originUrlArr[1].split('&') : [];
      if (headerArr.length) {
        const filteredHeaderArr: string[] = headerArr.filter((val: string): boolean => {
          return !val.includes(keyName);
        });
        filteredHeaderArr.push(`${keyName}=${newTime}`);
        req.originalUrl = `${originUrlArr[0]}?${filteredHeaderArr.join('&')}`;
      }
    }
  }
}
