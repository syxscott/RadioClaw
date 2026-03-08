import { describe, expect, it } from "vitest";
import { renderWideAreaGatewayZoneText } from "./widearea-dns.js";

describe("wide-area DNS-SD zone rendering", () => {
  it("renders a zone with gateway PTR/SRV/TXT records", () => {
    const txt = renderWideAreaGatewayZoneText({
      domain: "RadioClaw.internal.",
      serial: 2025121701,
      gatewayPort: 18789,
      displayName: "Mac Studio (RadioClaw)",
      tailnetIPv4: "100.123.224.76",
      tailnetIPv6: "fd7a:115c:a1e0::8801:e04c",
      hostLabel: "studio-london",
      instanceLabel: "studio-london",
      sshPort: 22,
      cliPath: "/opt/homebrew/bin/RadioClaw",
    });

    expect(txt).toContain(`$ORIGIN RadioClaw.internal.`);
    expect(txt).toContain(`studio-london IN A 100.123.224.76`);
    expect(txt).toContain(`studio-london IN AAAA fd7a:115c:a1e0::8801:e04c`);
    expect(txt).toContain(`_RadioClaw-gw._tcp IN PTR studio-london._RadioClaw-gw._tcp`);
    expect(txt).toContain(`studio-london._RadioClaw-gw._tcp IN SRV 0 0 18789 studio-london`);
    expect(txt).toContain(`displayName=Mac Studio (RadioClaw)`);
    expect(txt).toContain(`gatewayPort=18789`);
    expect(txt).toContain(`sshPort=22`);
    expect(txt).toContain(`cliPath=/opt/homebrew/bin/RadioClaw`);
  });

  it("includes tailnetDns when provided", () => {
    const txt = renderWideAreaGatewayZoneText({
      domain: "RadioClaw.internal.",
      serial: 2025121701,
      gatewayPort: 18789,
      displayName: "Mac Studio (RadioClaw)",
      tailnetIPv4: "100.123.224.76",
      tailnetDns: "peters-mac-studio-1.sheep-coho.ts.net",
      hostLabel: "studio-london",
      instanceLabel: "studio-london",
    });

    expect(txt).toContain(`tailnetDns=peters-mac-studio-1.sheep-coho.ts.net`);
  });
});
