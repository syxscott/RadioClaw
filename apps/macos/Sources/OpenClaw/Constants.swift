import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-RadioClaw writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.RadioClaw.mac"
let gatewayLaunchdLabel = "ai.RadioClaw.gateway"
let onboardingVersionKey = "RadioClaw.onboardingVersion"
let onboardingSeenKey = "RadioClaw.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "RadioClaw.pauseEnabled"
let iconAnimationsEnabledKey = "RadioClaw.iconAnimationsEnabled"
let swabbleEnabledKey = "RadioClaw.swabbleEnabled"
let swabbleTriggersKey = "RadioClaw.swabbleTriggers"
let voiceWakeTriggerChimeKey = "RadioClaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "RadioClaw.voiceWakeSendChime"
let showDockIconKey = "RadioClaw.showDockIcon"
let defaultVoiceWakeTriggers = ["RadioClaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "RadioClaw.voiceWakeMicID"
let voiceWakeMicNameKey = "RadioClaw.voiceWakeMicName"
let voiceWakeLocaleKey = "RadioClaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "RadioClaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "RadioClaw.voicePushToTalkEnabled"
let talkEnabledKey = "RadioClaw.talkEnabled"
let iconOverrideKey = "RadioClaw.iconOverride"
let connectionModeKey = "RadioClaw.connectionMode"
let remoteTargetKey = "RadioClaw.remoteTarget"
let remoteIdentityKey = "RadioClaw.remoteIdentity"
let remoteProjectRootKey = "RadioClaw.remoteProjectRoot"
let remoteCliPathKey = "RadioClaw.remoteCliPath"
let canvasEnabledKey = "RadioClaw.canvasEnabled"
let cameraEnabledKey = "RadioClaw.cameraEnabled"
let systemRunPolicyKey = "RadioClaw.systemRunPolicy"
let systemRunAllowlistKey = "RadioClaw.systemRunAllowlist"
let systemRunEnabledKey = "RadioClaw.systemRunEnabled"
let locationModeKey = "RadioClaw.locationMode"
let locationPreciseKey = "RadioClaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "RadioClaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "RadioClaw.deepLinkKey"
let modelCatalogPathKey = "RadioClaw.modelCatalogPath"
let modelCatalogReloadKey = "RadioClaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "RadioClaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "RadioClaw.heartbeatsEnabled"
let debugPaneEnabledKey = "RadioClaw.debugPaneEnabled"
let debugFileLogEnabledKey = "RadioClaw.debug.fileLogEnabled"
let appLogLevelKey = "RadioClaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
