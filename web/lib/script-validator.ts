export type ValidationResult = { ok: true } | { ok: false; reason: string };

export function validateSetupScript(
  script: string,
  labId: string,
): ValidationResult {
  const tag = `AutoLabId=${labId}`;
  if (!script.includes(tag)) {
    return {
      ok: false,
      reason: `Setup script must tag at least one resource with ${tag}`,
    };
  }
  return { ok: true };
}

export function validateCleanupScript(
  script: string,
  _labId: string,
): ValidationResult {
  const hasGroupDelete = /\baz\s+group\s+delete\b/.test(script);
  const hasResourceDelete = /\baz\s+resource\s+delete\b.*--ids\b/s.test(script);
  if (!hasGroupDelete && !hasResourceDelete) {
    return {
      ok: false,
      reason:
        "Cleanup script must include `az group delete` or `az resource delete --ids`",
    };
  }
  return { ok: true };
}
