import { dirname as pathDirname } from "path";
import { fileURLToPath } from "url";

export const dirname = (path) => {
  return pathDirname(fileURLToPath(path));
};
