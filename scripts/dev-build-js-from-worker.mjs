import { Worker, isMainThread, parentPort } from "worker_threads";

let jobs = [];
let idCounter = 0;
let worker;

const startWorker = () => {
  // This re-loads the current file inside a Worker instance.
  worker = new Worker(new URL(import.meta.url));
  worker.on("message", ({ id, result, error }) => {
    worker.unref();
    if (error) {
      jobs[id].reject(error);
    } else {
      jobs[id].resolve(result);
    }
  });
  worker.on("error", (error) => {
    jobs.forEach(({ reject }) => reject(error));
    worker.terminate();
    worker = null;
  });
};

const getWorker = (keepAlive = false) => {
  if (worker == null) {
    startWorker();
    if (!worker.keepAlive) {
      worker.unref();
    }
  } else if (keepAlive) {
    worker.ref();
  }
  return worker;
};

if (isMainThread) {
  startWorker();
} else {
  let buildCache;
  const build = () => {
    buildCache = import("./dev-build-js.mjs")
      .then((m) => m.default())
      .then((result) => ({ result }))
      .catch((error) => ({ error }));
  };
  build();
  parentPort.on("message", ({ id, rebuild }) => {
    if (rebuild) {
      build();
    } else {
      buildCache.then((cache) => parentPort.postMessage({ id, ...cache }));
    }
  });
}

export function sendRebuildSignal() {
  getWorker().postMessage({ rebuild: true });
}

export default () =>
  new Promise((resolve, reject) => {
    const id = idCounter++;
    jobs[id] = { resolve, reject };
    getWorker(true).postMessage({ id });
  });
