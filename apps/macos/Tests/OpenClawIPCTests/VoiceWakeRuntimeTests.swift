import Foundation
import SwabbleKit
import Testing
@testable import RadioClaw

@Suite struct VoiceWakeRuntimeTests {
    @Test func trimsAfterTriggerKeepsPostSpeech() {
        let triggers = ["claude", "RadioClaw"]
        let text = "hey Claude how are you"
        #expect(VoiceWakeRuntime._testTrimmedAfterTrigger(text, triggers: triggers) == "how are you")
    }

    @Test func trimsAfterTriggerReturnsOriginalWhenNoTrigger() {
        let triggers = ["claude"]
        let text = "good morning friend"
        #expect(VoiceWakeRuntime._testTrimmedAfterTrigger(text, triggers: triggers) == text)
    }

    @Test func trimsAfterFirstMatchingTrigger() {
        let triggers = ["buddy", "claude"]
        let text = "hello buddy this is after trigger claude also here"
        #expect(VoiceWakeRuntime
            ._testTrimmedAfterTrigger(text, triggers: triggers) == "this is after trigger claude also here")
    }

    @Test func hasContentAfterTriggerFalseWhenOnlyTrigger() {
        let triggers = ["RadioClaw"]
        let text = "hey RadioClaw"
        #expect(!VoiceWakeRuntime._testHasContentAfterTrigger(text, triggers: triggers))
    }

    @Test func hasContentAfterTriggerTrueWhenSpeechContinues() {
        let triggers = ["claude"]
        let text = "claude write a note"
        #expect(VoiceWakeRuntime._testHasContentAfterTrigger(text, triggers: triggers))
    }

    @Test func trimsAfterChineseTriggerKeepsPostSpeech() {
        let triggers = ["小爪", "RadioClaw"]
        let text = "�?小爪 帮我打开设置"
        #expect(VoiceWakeRuntime._testTrimmedAfterTrigger(text, triggers: triggers) == "帮我打开设置")
    }

    @Test func trimsAfterTriggerHandlesWidthInsensitiveForms() {
        let triggers = ["RadioClaw"]
        let text = "ＯｐｅｎＣｌａｗ 请帮�?
        #expect(VoiceWakeRuntime._testTrimmedAfterTrigger(text, triggers: triggers) == "请帮�?)
    }

    @Test func gateRequiresGapBetweenTriggerAndCommand() {
        let transcript = "hey RadioClaw do thing"
        let segments = makeWakeWordSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("RadioClaw", 0.2, 0.1),
                ("do", 0.35, 0.1),
                ("thing", 0.5, 0.1),
            ])
        let config = WakeWordGateConfig(triggers: ["RadioClaw"], minPostTriggerGap: 0.3)
        #expect(WakeWordGate.match(transcript: transcript, segments: segments, config: config) == nil)
    }

    @Test func gateAcceptsGapAndExtractsCommand() {
        let transcript = "hey RadioClaw do thing"
        let segments = makeWakeWordSegments(
            transcript: transcript,
            words: [
                ("hey", 0.0, 0.1),
                ("RadioClaw", 0.2, 0.1),
                ("do", 0.9, 0.1),
                ("thing", 1.1, 0.1),
            ])
        let config = WakeWordGateConfig(triggers: ["RadioClaw"], minPostTriggerGap: 0.3)
        #expect(WakeWordGate.match(transcript: transcript, segments: segments, config: config)?.command == "do thing")
    }
}
