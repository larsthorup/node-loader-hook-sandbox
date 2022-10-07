export async function resolve(specifier, context, nextResolve) {
  const { parentURL: parent } = context;
  const { format, shortCircuit, url } = await nextResolve(specifier, context);
  const urlWithParent = new URL(url);
  if (format === "module" && parent) {
    const parentURL = new URL(parent);
    parentURL.search = ""; // Note: strip grandparent
    urlWithParent.search = `?${new URLSearchParams({
      parent: parentURL.href,
    })}`;
  }
  return {
    format,
    shortCircuit: true,
    url: urlWithParent.toString(),
  };
}

export async function load(urlString, context, nextLoad) {
  const { format } = context;
  if (format === "module") {
    const url = new URL(urlString);
    const moduleUrl = new URL(url);
    const parent = moduleUrl.searchParams.get("parent");
    moduleUrl.search = "";
    const { source: originalSource } = await nextLoad(moduleUrl.href, context);
    const transformedSource = `${originalSource};\nconsole.log('loaded ${moduleUrl.href} from ${parent}');`;
    return { format: "module", source: transformedSource, shortCircuit: true };
  }
  return nextLoad(urlString);
}
