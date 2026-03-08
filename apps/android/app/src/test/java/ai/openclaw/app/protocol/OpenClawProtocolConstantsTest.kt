package ai.RadioClaw.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class RadioClawProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", RadioClawCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", RadioClawCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", RadioClawCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", RadioClawCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", RadioClawCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", RadioClawCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", RadioClawCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", RadioClawCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", RadioClawCapability.Canvas.rawValue)
    assertEquals("camera", RadioClawCapability.Camera.rawValue)
    assertEquals("screen", RadioClawCapability.Screen.rawValue)
    assertEquals("voiceWake", RadioClawCapability.VoiceWake.rawValue)
    assertEquals("location", RadioClawCapability.Location.rawValue)
    assertEquals("sms", RadioClawCapability.Sms.rawValue)
    assertEquals("device", RadioClawCapability.Device.rawValue)
    assertEquals("notifications", RadioClawCapability.Notifications.rawValue)
    assertEquals("system", RadioClawCapability.System.rawValue)
    assertEquals("appUpdate", RadioClawCapability.AppUpdate.rawValue)
    assertEquals("photos", RadioClawCapability.Photos.rawValue)
    assertEquals("contacts", RadioClawCapability.Contacts.rawValue)
    assertEquals("calendar", RadioClawCapability.Calendar.rawValue)
    assertEquals("motion", RadioClawCapability.Motion.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", RadioClawCameraCommand.List.rawValue)
    assertEquals("camera.snap", RadioClawCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", RadioClawCameraCommand.Clip.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", RadioClawScreenCommand.Record.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", RadioClawNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", RadioClawNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", RadioClawDeviceCommand.Status.rawValue)
    assertEquals("device.info", RadioClawDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", RadioClawDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", RadioClawDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", RadioClawSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", RadioClawPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", RadioClawContactsCommand.Search.rawValue)
    assertEquals("contacts.add", RadioClawContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", RadioClawCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", RadioClawCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", RadioClawMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", RadioClawMotionCommand.Pedometer.rawValue)
  }
}
