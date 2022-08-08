
export  function parseEnvToJson(string:string): object{
  const obj: {
    [key in string]: any;
  } = {};

  const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

  // Convert buffer to string
  let lines = string

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key: string = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key]= value;
  }
  console.log("[ obj ] >", obj);
  return obj
}
