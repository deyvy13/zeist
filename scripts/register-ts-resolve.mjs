// Registers a resolve hook for `npm run test:tools` (--import): extensionless
// relative imports ("./zip") resolve to their .ts file, as in the bundler.
import * as nodeModule from "node:module";

function resolveTs(specifier, context, nextResolve) {
  try {
    return nextResolve(specifier, context);
  } catch (error) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);
    if (error?.code === "ERR_MODULE_NOT_FOUND" && relative && !hasExtension) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw error;
  }
}

if (typeof nodeModule.registerHooks === "function") {
  nodeModule.registerHooks({ resolve: resolveTs }); // synchronous hooks (Node ≥ 22.15)
} else {
  nodeModule.register("./ts-resolve-hook.mjs", import.meta.url);
}
