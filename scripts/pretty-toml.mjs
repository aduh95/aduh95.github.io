import { createReadStream, createWriteStream, promises as fs } from "fs";
import { join, resolve } from "path";
import { tmpdir } from "os";
import { createInterface as readLines } from "readline";
import TOML from "@aduh95/toml";

const LINE_LENGTH_LIMIT = 80;

const NORMAL_MODE = Symbol("normal mode");
const MULTILINE_ARRAY_MODE = Symbol("array mode");
const MULTILINE_STRING_MODE = Symbol("multiline mode");

const importantBits = /^\s*([^#]*)\s*(#+.*)?$/;
const indent = (indentationLevel) => " ".repeat(indentationLevel * 2);

const unquoteKey = /^["'](\w+)["']\s*$/;
const renderKey = (key) => {
  const [, actualKey] = key.match(unquoteKey) || [, key.trim()];
  return actualKey;
};

function* printPrettyArray(buffer, indentationLevel) {
  const [key, ...rest] = buffer.split("=");
  const values = TOML.parse(`values=${rest.join("=")}`).values.map((val) => {
    return "string" === typeof val || "number" === typeof val
      ? JSON.stringify(val)
      : Array.isArray(val)
      ? `[${val.join(", ")}]`
      : `{ ${TOML.stringify(val).trim().split("\n").join(", ")} }`;
  });
  const keyLine = indent(indentationLevel) + key.trim() + " = [";
  const oneLine = keyLine + values.join(", ") + "]";
  if (oneLine.length <= LINE_LENGTH_LIMIT) {
    yield oneLine;
  } else {
    yield keyLine;
    for (const value of values) {
      yield indent(indentationLevel + 1) + value + ",";
    }
    yield indent(indentationLevel) + "]";
  }
}

async function* prettier(input) {
  let mode = NORMAL_MODE;
  let indentationLevel = 0;

  let buffer;

  for await (const line of readLines({ input, crlfDelay: Infinity })) {
    const [, actualLine, comment] = line.match(importantBits) || [];
    if (!actualLine) {
      yield line.trim();
      continue; // skip empty lines
    }

    switch (mode) {
      case MULTILINE_ARRAY_MODE:
        buffer += actualLine;
        if (actualLine.endsWith("]")) {
          mode = NORMAL_MODE;
          yield* printPrettyArray(buffer, indentationLevel);
        }
        break;

      case MULTILINE_STRING_MODE:
        buffer += actualLine + " ";
        if (actualLine.endsWith('"""')) {
          mode = NORMAL_MODE;
          const words = buffer.slice(0, -4).split(/\s/);
          buffer = words.shift();
          for (const word of words) {
            if (word.length === 0) continue;
            if (buffer.length + word.length + 1 <= LINE_LENGTH_LIMIT) {
              buffer += " " + word;
            } else {
              yield buffer;
              buffer = word;
            }
          }
          yield buffer;
          yield '"""';
        }
        break;

      case NORMAL_MODE:
        if (actualLine.startsWith("[")) {
          indentationLevel = actualLine.split(".").length;
          yield indent(indentationLevel - 1) + actualLine;
          continue;
        } else if (actualLine.includes("[")) {
          if (actualLine.endsWith("]")) {
            yield* printPrettyArray(actualLine, indentationLevel);
          } else {
            mode = MULTILINE_ARRAY_MODE;
            buffer = actualLine;
          }
          continue;
        } else if (actualLine.endsWith('"""')) {
          mode = MULTILINE_STRING_MODE;
          buffer = "";
        }
        const [key, ...value] = actualLine.split("=");
        yield indent(indentationLevel) +
          renderKey(key) +
          " = " +
          value.join("=").trim() +
          (comment || "");
        break;
    }
  }
}

export async function prettierFile(output, input) {
  const reader = createReadStream(input);
  const writer = createWriteStream(output);
  for await (const line of prettier(reader)) {
    writer.write(line + "\n");
  }
  return new Promise((done) => writer.end(done));
}

const TMP_DIR = join(tmpdir(), "prettier");
const TARGET_DIR = resolve(process.argv[2]);

Promise.all([fs.mkdtemp(TMP_DIR), fs.readdir(TARGET_DIR)])
  .then(([tmp, files]) =>
    Promise.all(
      files
        .filter((f) => f.endsWith(".toml"))
        .map((f) => [TARGET_DIR, tmp].map((d) => join(d, f)))
        .map((args) => fs.rename(...args).then(() => prettierFile(...args)))
    )
  )
  .catch(console.error);
