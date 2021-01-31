/**
 * to crop string
 */
export const truncate = (length: number, string: string) => {
  if (string) {
    if (string.length > length) {
      return `${string.substring(0, length)}...`;
    }
    return string;
  }
  return string;
};

export function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
