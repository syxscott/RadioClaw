import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("./launchd.js");
});

describe("buildPlatformRuntimeLogHints", () => {
  it("strips windows drive prefixes from darwin display paths", async () => {
    vi.doMock("./launchd.js", () => ({
      resolveGatewayLogPaths: () => ({
        stdoutPath: "C:\\tmp\\RadioClaw-state\\logs\\gateway.log",
        stderrPath: "C:\\tmp\\RadioClaw-state\\logs\\gateway.err.log",
      }),
    }));

    const { buildPlatformRuntimeLogHints } = await import("./runtime-hints.js");

    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/RadioClaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/RadioClaw-state/logs/gateway.err.log",
    ]);
  });
});
