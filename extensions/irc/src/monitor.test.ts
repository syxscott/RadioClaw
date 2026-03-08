import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#RadioClaw",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#RadioClaw",
      rawTarget: "#RadioClaw",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "RadioClaw-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "RadioClaw-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "RadioClaw-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "RadioClaw-bot",
      rawTarget: "RadioClaw-bot",
    });
  });
});
