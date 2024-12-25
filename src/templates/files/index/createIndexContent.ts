import { toCamelCase } from "../../../utils/toCamelCase";

export const createIndexContent = (
  repositoryAlias: string,
  filesMetadata: {
    version: string;
    filepath: string;
  }[],
) => {
  const [indexImports, indexExportNames] = filesMetadata.reduce(
    (acc, { version, filepath }) => {
      acc[0].push(`import * as ${toCamelCase(version)} from './${filepath}';`);
      acc[1].push(toCamelCase(version));
      return acc;
    },
    [[], []] as [string[], string[]],
  );
  const importsClause = indexImports.join("\n");
  const exportsClause = indexExportNames.join(",");
  return `${importsClause}
export const ${toCamelCase(repositoryAlias)} = {${exportsClause}};`;
};
