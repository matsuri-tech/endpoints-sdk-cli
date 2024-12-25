export const toCamelCase = (str: string) => {
  let first = false;
  let result = "";

  for (const s of str) {
    if (first) {
      result += s.toUpperCase();
      first = false;
    } else if (s === "-" || s === "_") {
      first = true;
    } else {
      result += s;
    }
  }

  return result;
};
