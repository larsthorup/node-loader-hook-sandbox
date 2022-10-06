export async function load(url, context, nextLoad) {
  const { format } = context;
  if (format === "module") {
    const { source: originalSource } = await nextLoad(url, context);
    const transformedSource = `${originalSource};\nconsole.log('loaded ${url}');`;
    return { format: "module", source: transformedSource, shortCircuit: true };
  }
  return nextLoad(url);
}
