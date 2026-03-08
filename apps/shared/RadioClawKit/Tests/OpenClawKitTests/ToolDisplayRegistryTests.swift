import RadioClawKit
import Foundation
import Testing

@Suite struct ToolDisplayRegistryTests {
    @Test func loadsToolDisplayConfigFromBundle() {
        let url = RadioClawKitResources.bundle.url(forResource: "tool-display", withExtension: "json")
        #expect(url != nil)
    }

    @Test func resolvesKnownToolFromConfig() {
        let summary = ToolDisplayRegistry.resolve(name: "bash", args: nil)
        #expect(summary.emoji == "ðŸ› ï¸?)
        #expect(summary.title == "Bash")
    }
}
