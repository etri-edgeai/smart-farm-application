import { promises as fs } from "fs";

export class FileUtils {
  static async getDirectories(path: string) {
    return (await fs.readdir(path, { withFileTypes: true}))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  }
}