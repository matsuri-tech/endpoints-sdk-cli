import jsonSchemaRefParser from "@apidevtools/json-schema-ref-parser";

export async function parseJsonSchema<S extends object>(data: unknown) {
  const parsed = await jsonSchemaRefParser.dereference<S>(data);

  if ("$defs" in parsed) {
    delete parsed.$defs;
  }

  return parsed;
}
