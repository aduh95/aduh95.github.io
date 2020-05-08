import { promises as fs } from "fs";
import path from "path";
import assert from "assert";
import parse from "pdf-parse";

const dir = path.resolve(process.argv[2]);

fs.readdir(dir)
  .then((files) =>
    Promise.all(
      files.map((file) => fs.readFile(path.join(dir, file)).then(parse))
    )
  )
  .then((parseResults) =>
    assert(
      parseResults.every(({ numpages }) => numpages === 1),
      "All PDF documents should contain only one page."
    )
  );
