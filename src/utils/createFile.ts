import * as fs from "fs";
import * as path from "path";

export function createFile(
  output: string,
  filename: string,
  contents: string,
): void {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
  const filePath = path.join(output, filename);
  fs.writeFileSync(filePath, contents + "\n");
}
