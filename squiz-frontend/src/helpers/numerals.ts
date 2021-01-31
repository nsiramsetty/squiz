/**
 * convert number into million, billion and in k's
 */
export const numberConvert = (labelValue: string | number, full = false) => {
  if (full) {
    // Nine Zeroes for Billions
    const number =
      Math.abs(Number(labelValue)) >= 1.0e9
        ? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(1)} billion`
        : // Six Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(1)} million`
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 100.0e3
        ? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed()}k`
        : Math.abs(Number(labelValue));

    return number;
  }
  // Nine Zeroes for Billions
  const number =
    Math.abs(Number(labelValue)) >= 1.0e9
      ? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(1)}b`
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(1)}m`
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed(1)}k`
      : Math.abs(Number(labelValue));

  return number;
};

/**
 * convert seconds into hour, min and seconds
 */
export const numberFormat = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
