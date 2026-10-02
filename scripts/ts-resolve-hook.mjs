// Node resolve hook for the tool tests: resolves extensionless relative imports
// ("./zip") to their .ts file, the way the bundler does. Lets lib/tools modules
// import each other while Node runs them directly (type stripping).
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);
    if (error?.code === "ERR_MODULE_NOT_FOUND" && relative && !hasExtension) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw error;
  }
}
