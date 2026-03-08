import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "RadioClaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "RadioClaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "RadioClaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "RadioClaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "RadioClaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "RadioClaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "RadioClaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "RadioClaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "RadioClaw", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".RadioClaw-dev");
    expect(env.RadioClaw_PROFILE).toBe("dev");
    expect(env.RadioClaw_STATE_DIR).toBe(expectedStateDir);
    expect(env.RadioClaw_CONFIG_PATH).toBe(path.join(expectedStateDir, "RadioClaw.json"));
    expect(env.RadioClaw_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      RadioClaw_STATE_DIR: "/custom",
      RadioClaw_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.RadioClaw_STATE_DIR).toBe("/custom");
    expect(env.RadioClaw_GATEWAY_PORT).toBe("19099");
    expect(env.RadioClaw_CONFIG_PATH).toBe(path.join("/custom", "RadioClaw.json"));
  });

  it("uses RadioClaw_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      RadioClaw_HOME: "/srv/RadioClaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/RadioClaw-home");
    expect(env.RadioClaw_STATE_DIR).toBe(path.join(resolvedHome, ".RadioClaw-work"));
    expect(env.RadioClaw_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".RadioClaw-work", "RadioClaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "RadioClaw doctor --fix",
      env: {},
      expected: "RadioClaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "RadioClaw doctor --fix",
      env: { RadioClaw_PROFILE: "default" },
      expected: "RadioClaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "RadioClaw doctor --fix",
      env: { RadioClaw_PROFILE: "Default" },
      expected: "RadioClaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "RadioClaw doctor --fix",
      env: { RadioClaw_PROFILE: "bad profile" },
      expected: "RadioClaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "RadioClaw --profile work doctor --fix",
      env: { RadioClaw_PROFILE: "work" },
      expected: "RadioClaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "RadioClaw --dev doctor",
      env: { RadioClaw_PROFILE: "dev" },
      expected: "RadioClaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("RadioClaw doctor --fix", { RadioClaw_PROFILE: "work" })).toBe(
      "RadioClaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("RadioClaw doctor --fix", { RadioClaw_PROFILE: "  jbRadioClaw  " })).toBe(
      "RadioClaw --profile jbRadioClaw doctor --fix",
    );
  });

  it("handles command with no args after RadioClaw", () => {
    expect(formatCliCommand("RadioClaw", { RadioClaw_PROFILE: "test" })).toBe(
      "RadioClaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm RadioClaw doctor", { RadioClaw_PROFILE: "work" })).toBe(
      "pnpm RadioClaw --profile work doctor",
    );
  });
});
