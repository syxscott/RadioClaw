package ai.RadioClaw.app.node

import ai.RadioClaw.app.protocol.RadioClawCalendarCommand
import ai.RadioClaw.app.protocol.RadioClawCanvasA2UICommand
import ai.RadioClaw.app.protocol.RadioClawCanvasCommand
import ai.RadioClaw.app.protocol.RadioClawCameraCommand
import ai.RadioClaw.app.protocol.RadioClawCapability
import ai.RadioClaw.app.protocol.RadioClawContactsCommand
import ai.RadioClaw.app.protocol.RadioClawDeviceCommand
import ai.RadioClaw.app.protocol.RadioClawLocationCommand
import ai.RadioClaw.app.protocol.RadioClawMotionCommand
import ai.RadioClaw.app.protocol.RadioClawNotificationsCommand
import ai.RadioClaw.app.protocol.RadioClawPhotosCommand
import ai.RadioClaw.app.protocol.RadioClawScreenCommand
import ai.RadioClaw.app.protocol.RadioClawSmsCommand
import ai.RadioClaw.app.protocol.RadioClawSystemCommand

data class NodeRuntimeFlags(
  val cameraEnabled: Boolean,
  val locationEnabled: Boolean,
  val smsAvailable: Boolean,
  val voiceWakeEnabled: Boolean,
  val motionActivityAvailable: Boolean,
  val motionPedometerAvailable: Boolean,
  val debugBuild: Boolean,
)

enum class InvokeCommandAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  MotionActivityAvailable,
  MotionPedometerAvailable,
  DebugBuild,
}

enum class NodeCapabilityAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  VoiceWakeEnabled,
  MotionAvailable,
}

data class NodeCapabilitySpec(
  val name: String,
  val availability: NodeCapabilityAvailability = NodeCapabilityAvailability.Always,
)

data class InvokeCommandSpec(
  val name: String,
  val requiresForeground: Boolean = false,
  val availability: InvokeCommandAvailability = InvokeCommandAvailability.Always,
)

object InvokeCommandRegistry {
  val capabilityManifest: List<NodeCapabilitySpec> =
    listOf(
      NodeCapabilitySpec(name = RadioClawCapability.Canvas.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.Screen.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.Device.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.Notifications.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.System.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.AppUpdate.rawValue),
      NodeCapabilitySpec(
        name = RadioClawCapability.Camera.rawValue,
        availability = NodeCapabilityAvailability.CameraEnabled,
      ),
      NodeCapabilitySpec(
        name = RadioClawCapability.Sms.rawValue,
        availability = NodeCapabilityAvailability.SmsAvailable,
      ),
      NodeCapabilitySpec(
        name = RadioClawCapability.VoiceWake.rawValue,
        availability = NodeCapabilityAvailability.VoiceWakeEnabled,
      ),
      NodeCapabilitySpec(
        name = RadioClawCapability.Location.rawValue,
        availability = NodeCapabilityAvailability.LocationEnabled,
      ),
      NodeCapabilitySpec(name = RadioClawCapability.Photos.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.Contacts.rawValue),
      NodeCapabilitySpec(name = RadioClawCapability.Calendar.rawValue),
      NodeCapabilitySpec(
        name = RadioClawCapability.Motion.rawValue,
        availability = NodeCapabilityAvailability.MotionAvailable,
      ),
    )

  val all: List<InvokeCommandSpec> =
    listOf(
      InvokeCommandSpec(
        name = RadioClawCanvasCommand.Present.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasCommand.Hide.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasCommand.Navigate.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasCommand.Eval.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasCommand.Snapshot.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasA2UICommand.Push.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasA2UICommand.PushJSONL.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawCanvasA2UICommand.Reset.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawScreenCommand.Record.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = RadioClawSystemCommand.Notify.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawCameraCommand.List.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = RadioClawCameraCommand.Snap.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = RadioClawCameraCommand.Clip.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = RadioClawLocationCommand.Get.rawValue,
        availability = InvokeCommandAvailability.LocationEnabled,
      ),
      InvokeCommandSpec(
        name = RadioClawDeviceCommand.Status.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawDeviceCommand.Info.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawDeviceCommand.Permissions.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawDeviceCommand.Health.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawNotificationsCommand.List.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawNotificationsCommand.Actions.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawPhotosCommand.Latest.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawContactsCommand.Search.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawContactsCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawCalendarCommand.Events.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawCalendarCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = RadioClawMotionCommand.Activity.rawValue,
        availability = InvokeCommandAvailability.MotionActivityAvailable,
      ),
      InvokeCommandSpec(
        name = RadioClawMotionCommand.Pedometer.rawValue,
        availability = InvokeCommandAvailability.MotionPedometerAvailable,
      ),
      InvokeCommandSpec(
        name = RadioClawSmsCommand.Send.rawValue,
        availability = InvokeCommandAvailability.SmsAvailable,
      ),
      InvokeCommandSpec(
        name = "debug.logs",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(
        name = "debug.ed25519",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(name = "app.update"),
    )

  private val byNameInternal: Map<String, InvokeCommandSpec> = all.associateBy { it.name }

  fun find(command: String): InvokeCommandSpec? = byNameInternal[command]

  fun advertisedCapabilities(flags: NodeRuntimeFlags): List<String> {
    return capabilityManifest
      .filter { spec ->
        when (spec.availability) {
          NodeCapabilityAvailability.Always -> true
          NodeCapabilityAvailability.CameraEnabled -> flags.cameraEnabled
          NodeCapabilityAvailability.LocationEnabled -> flags.locationEnabled
          NodeCapabilityAvailability.SmsAvailable -> flags.smsAvailable
          NodeCapabilityAvailability.VoiceWakeEnabled -> flags.voiceWakeEnabled
          NodeCapabilityAvailability.MotionAvailable -> flags.motionActivityAvailable || flags.motionPedometerAvailable
        }
      }
      .map { it.name }
  }

  fun advertisedCommands(flags: NodeRuntimeFlags): List<String> {
    return all
      .filter { spec ->
        when (spec.availability) {
          InvokeCommandAvailability.Always -> true
          InvokeCommandAvailability.CameraEnabled -> flags.cameraEnabled
          InvokeCommandAvailability.LocationEnabled -> flags.locationEnabled
          InvokeCommandAvailability.SmsAvailable -> flags.smsAvailable
          InvokeCommandAvailability.MotionActivityAvailable -> flags.motionActivityAvailable
          InvokeCommandAvailability.MotionPedometerAvailable -> flags.motionPedometerAvailable
          InvokeCommandAvailability.DebugBuild -> flags.debugBuild
        }
      }
      .map { it.name }
  }
}
