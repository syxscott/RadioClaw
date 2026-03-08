import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          RadioClaw_STATE_DIR: "/tmp/RadioClaw-state",
          RadioClaw_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/RadioClaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/RadioClaw-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u RadioClaw-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "RadioClaw Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "RadioClaw gateway install",
        startCommand: "RadioClaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.RadioClaw.gateway.plist",
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual([
      "RadioClaw gateway install",
      "RadioClaw gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.RadioClaw.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "RadioClaw gateway install",
        startCommand: "RadioClaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.RadioClaw.gateway.plist",
        systemdServiceName: "RadioClaw-gateway",
        windowsTaskName: "RadioClaw Gateway",
      }),
    ).toEqual([
      "RadioClaw gateway install",
      "RadioClaw gateway",
      "systemctl --user start RadioClaw-gateway.service",
    ]);
  });
});
