import tsconfig from "../tsconfig.json" assert { type: "json" };

const { rootDir } = tsconfig.compilerOptions;

export const INPUT_HTML_FILE = `${rootDir}/index.html`;
export const OUTPUT_HTML_FILE = "index.html";

export const OUTPUT_PDF_LANGUAGES = ["en", "fr"];
export const OUTPUT_PDF_FILE_PREFIX = "Antoine du Hamel – CV";
