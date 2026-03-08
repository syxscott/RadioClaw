import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("RadioClaw", 16)).toBe("RadioClaw");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("RadioClaw-status-output", 10)).toBe("RadioClaw-â€?);
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("helloðŸ™‚world", 7)).toBe("helloðŸ™‚â€?);
  });
});
