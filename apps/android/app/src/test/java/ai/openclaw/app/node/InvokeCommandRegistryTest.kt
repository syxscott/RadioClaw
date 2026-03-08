package ai.RadioClaw.app.node

import ai.RadioClaw.app.protocol.RadioClawCalendarCommand
import ai.RadioClaw.app.protocol.RadioClawCameraCommand
import ai.RadioClaw.app.protocol.RadioClawCapability
import ai.RadioClaw.app.protocol.RadioClawContactsCommand
import ai.RadioClaw.app.protocol.RadioClawDeviceCommand
import ai.RadioClaw.app.protocol.RadioClawLocationCommand
import ai.RadioClaw.app.protocol.RadioClawMotionCommand
import ai.RadioClaw.app.protocol.RadioClawNotificationsCommand
import ai.RadioClaw.app.protocol.RadioClawPhotosCommand
import ai.RadioClaw.app.protocol.RadioClawSmsCommand
import ai.RadioClaw.app.protocol.RadioClawSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      RadioClawCapability.Canvas.rawValue,
      RadioClawCapability.Screen.rawValue,
      RadioClawCapability.Device.rawValue,
      RadioClawCapability.Notifications.rawValue,
      RadioClawCapability.System.rawValue,
      RadioClawCapability.AppUpdate.rawValue,
      RadioClawCapability.Photos.rawValue,
      RadioClawCapability.Contacts.rawValue,
      RadioClawCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      RadioClawCapability.Camera.rawValue,
      RadioClawCapability.Location.rawValue,
      RadioClawCapability.Sms.rawValue,
      RadioClawCapability.VoiceWake.rawValue,
      RadioClawCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      RadioClawDeviceCommand.Status.rawValue,
      RadioClawDeviceCommand.Info.rawValue,
      RadioClawDeviceCommand.Permissions.rawValue,
      RadioClawDeviceCommand.Health.rawValue,
      RadioClawNotificationsCommand.List.rawValue,
      RadioClawNotificationsCommand.Actions.rawValue,
      RadioClawSystemCommand.Notify.rawValue,
      RadioClawPhotosCommand.Latest.rawValue,
      RadioClawContactsCommand.Search.rawValue,
      RadioClawContactsCommand.Add.rawValue,
      RadioClawCalendarCommand.Events.rawValue,
      RadioClawCalendarCommand.Add.rawValue,
      "app.update",
    )

  private val optionalCommands =
    setOf(
      RadioClawCameraCommand.Snap.rawValue,
      RadioClawCameraCommand.Clip.rawValue,
      RadioClawCameraCommand.List.rawValue,
      RadioClawLocationCommand.Get.rawValue,
      RadioClawMotionCommand.Activity.rawValue,
      RadioClawMotionCommand.Pedometer.rawValue,
      RadioClawSmsCommand.Send.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          smsAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(RadioClawMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(RadioClawMotionCommand.Pedometer.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    smsAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      smsAvailable = smsAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
