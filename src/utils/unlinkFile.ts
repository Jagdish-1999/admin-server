import path from "path";
import fs from "fs";
import { logger } from "./logger";

const unlinkFile = (filePath?: string) => {
  Promise.resolve(async () => {
    if (filePath) await fs.promises.unlink(path.resolve(filePath));
    else throw new Error("Invalid file path");
  })
    .then((unlink) => {
      unlink();
    })
    .catch((err) => {
      logger("local file not deleted", err);
    });
};

export { unlinkFile };
