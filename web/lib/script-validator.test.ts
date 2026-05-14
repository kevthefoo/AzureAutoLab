import { describe, it, expect } from "vitest";
import { validateSetupScript, validateCleanupScript } from "./script-validator";

describe("validateSetupScript", () => {
  it("accepts a script that tags resources with the lab id", () => {
    const script = "az group create -n RG-TS-101 --tags AutoLabId=101";
    expect(validateSetupScript(script, "101")).toEqual({ ok: true });
  });

  it("rejects a script with no AutoLabId tag for this lab", () => {
    const script = "az group create -n RG-TS-101";
    const r = validateSetupScript(script, "101");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/AutoLabId=101/);
  });

  it("rejects a script that tags with a different lab id", () => {
    const script = "az group create -n RG-TS-101 --tags AutoLabId=102";
    expect(validateSetupScript(script, "101").ok).toBe(false);
  });
});

describe("validateCleanupScript", () => {
  it("accepts a script with az group delete", () => {
    const script = "az group delete -n RG-TS-101 --yes --no-wait";
    expect(validateCleanupScript(script, "101")).toEqual({ ok: true });
  });

  it("accepts a script with az resource delete --ids", () => {
    const script =
      "az resource list --tag AutoLabId=101 --query \"[].id\" -o tsv | xargs -r -n1 az resource delete --ids";
    expect(validateCleanupScript(script, "101")).toEqual({ ok: true });
  });

  it("rejects a script that deletes nothing", () => {
    const script = "echo 'cleanup'";
    const r = validateCleanupScript(script, "101");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/az group delete|az resource delete/);
  });
});
