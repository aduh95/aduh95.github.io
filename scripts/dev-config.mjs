import path from "path";
import { fileURLToPath } from "url";

import tsconfig from "../tsconfig.json";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const { rootDir } = tsconfig.compilerOptions;

export const PROJECT_DIR = path.resolve(__dirname, "..");
export const INPUT_DIR = path.join(PROJECT_DIR, rootDir);
export const DATA_DIR = path.join(INPUT_DIR, "data");

export const BUNDLE_NAME = "bundle.js";
export const AUTO_REFRESH_MODULE = "autoRefresh.mjs";

export const PORT_NUMBER = 8080;
