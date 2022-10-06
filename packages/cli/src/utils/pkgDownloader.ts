import tar from "tar";
import axios from "axios";
import { createWriteStream, mkdirSync, existsSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import {
  __DOWNLOADED,
  __DOWNLOADING,
  __INSTALLED,
  __SKIPPED,
  downloadFile,
} from "../commands/install.js";

// Get system temp directory
const tmpDir = os.tmpdir();

const cacheBasePath = path.join(tmpDir, "ultra_tmp");

export async function ultraExtract(target: string, tarball: string) {
  if (!tarball) {
    throw new Error("No tarball provided");
  }

  // Read .ultra file to know if it's fully installed
  const ultraFile = path.join(target, downloadFile);
  const ultraFileExists = existsSync(ultraFile);

  if (ultraFileExists) {
    return {
      res: "skipped",
    };
  }

  __DOWNLOADING.push(tarball);

  // @ts-ignore-next-line
  const file = path.join(cacheBasePath, tarball.split("/").pop());

  if (!existsSync(cacheBasePath)) {
    mkdirSync(cacheBasePath);
  }

  if (!existsSync(file)) {
    const writer = createWriteStream(file);
    const response = await axios({
      url: tarball,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  // Extract "package" directory from tarball to "target" directory
  mkdirSync(target, { recursive: true });
  await tar.extract({
    file,
    cwd: target,
    strip: 1,
  });

  // Create .ultra file
  writeFileSync(ultraFile, "{}");

  __DOWNLOADING.splice(__DOWNLOADING.indexOf(tarball), 1);

  return {
    res: "extracted",
  };
}