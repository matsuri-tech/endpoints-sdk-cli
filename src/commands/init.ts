import { createConfigFile } from "../executers/config";

export const init = async () => {
  await createConfigFile();
};
