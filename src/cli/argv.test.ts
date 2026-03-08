import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getCommandPositionalsWithRootOptions,
  getCommandPathWithRootOptions,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  isRootHelpInvocation,
  isRootVersionInvocation,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "RadioClaw", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "RadioClaw", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "RadioClaw", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "RadioClaw", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "RadioClaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "RadioClaw", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "RadioClaw", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "RadioClaw", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "RadioClaw", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --version",
      argv: ["node", "RadioClaw", "--version"],
      expected: true,
    },
    {
      name: "root -V",
      argv: ["node", "RadioClaw", "-V"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "RadioClaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "subcommand version flag",
      argv: ["node", "RadioClaw", "status", "--version"],
      expected: false,
    },
    {
      name: "unknown root flag with version",
      argv: ["node", "RadioClaw", "--unknown", "--version"],
      expected: false,
    },
  ])("detects root-only version invocations: $name", ({ argv, expected }) => {
    expect(isRootVersionInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --help",
      argv: ["node", "RadioClaw", "--help"],
      expected: true,
    },
    {
      name: "root -h",
      argv: ["node", "RadioClaw", "-h"],
      expected: true,
    },
    {
      name: "root --help with profile",
      argv: ["node", "RadioClaw", "--profile", "work", "--help"],
      expected: true,
    },
    {
      name: "subcommand --help",
      argv: ["node", "RadioClaw", "status", "--help"],
      expected: false,
    },
    {
      name: "help before subcommand token",
      argv: ["node", "RadioClaw", "--help", "status"],
      expected: false,
    },
    {
      name: "help after -- terminator",
      argv: ["node", "RadioClaw", "nodes", "run", "--", "git", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag before help",
      argv: ["node", "RadioClaw", "--unknown", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag after help",
      argv: ["node", "RadioClaw", "--help", "--unknown"],
      expected: false,
    },
  ])("detects root-only help invocations: $name", ({ argv, expected }) => {
    expect(isRootHelpInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "RadioClaw", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "RadioClaw", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "RadioClaw", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it("extracts command path while skipping known root option values", () => {
    expect(
      getCommandPathWithRootOptions(
        ["node", "RadioClaw", "--profile", "work", "--no-color", "config", "validate"],
        2,
      ),
    ).toEqual(["config", "validate"]);
  });

  it("extracts routed config get positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "RadioClaw", "config", "get", "--log-level", "debug", "update.channel", "--json"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("extracts routed config unset positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "RadioClaw", "config", "unset", "--profile", "work", "update.channel"],
        {
          commandPath: ["config", "unset"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("returns null when routed command sees unknown options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "RadioClaw", "config", "get", "--mystery", "value", "update.channel"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toBeNull();
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "RadioClaw", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "RadioClaw"],
      expected: null,
    },
    {
      name: "skips known root option values",
      argv: ["node", "RadioClaw", "--log-level", "debug", "status"],
      expected: "status",
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "RadioClaw", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "RadioClaw", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "RadioClaw", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "RadioClaw", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "RadioClaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "RadioClaw", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "RadioClaw", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "RadioClaw", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "RadioClaw", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "RadioClaw", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "RadioClaw", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "RadioClaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "RadioClaw", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "RadioClaw", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "RadioClaw", "status"],
        expected: ["node", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node-22", "RadioClaw", "status"],
        expected: ["node-22", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "RadioClaw", "status"],
        expected: ["node-22.2.0.exe", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node-22.2", "RadioClaw", "status"],
        expected: ["node-22.2", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "RadioClaw", "status"],
        expected: ["node-22.2.exe", "RadioClaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "RadioClaw", "status"],
        expected: ["/usr/bin/node-22.2.0", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node24", "RadioClaw", "status"],
        expected: ["node24", "RadioClaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "RadioClaw", "status"],
        expected: ["/usr/bin/node24", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node24.exe", "RadioClaw", "status"],
        expected: ["node24.exe", "RadioClaw", "status"],
      },
      {
        rawArgs: ["nodejs", "RadioClaw", "status"],
        expected: ["nodejs", "RadioClaw", "status"],
      },
      {
        rawArgs: ["node-dev", "RadioClaw", "status"],
        expected: ["node", "RadioClaw", "node-dev", "RadioClaw", "status"],
      },
      {
        rawArgs: ["RadioClaw", "status"],
        expected: ["node", "RadioClaw", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "RadioClaw",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "RadioClaw",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "RadioClaw", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "RadioClaw", "status"],
      ["node", "RadioClaw", "health"],
      ["node", "RadioClaw", "sessions"],
      ["node", "RadioClaw", "config", "get", "update"],
      ["node", "RadioClaw", "config", "unset", "update"],
      ["node", "RadioClaw", "models", "list"],
      ["node", "RadioClaw", "models", "status"],
      ["node", "RadioClaw", "memory", "status"],
      ["node", "RadioClaw", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "RadioClaw", "agents", "list"],
      ["node", "RadioClaw", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
