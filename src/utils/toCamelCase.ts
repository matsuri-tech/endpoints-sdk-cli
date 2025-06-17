export const toCamelCase = (str: string) => {
  let first = false;
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (i === 0) {
      result += s.toLowerCase();
    } else if (first) {
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
