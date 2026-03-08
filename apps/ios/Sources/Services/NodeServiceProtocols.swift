import CoreLocation
import Foundation
import RadioClawKit
import UIKit

typealias RadioClawCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias RadioClawCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: RadioClawCameraSnapParams) async throws -> RadioClawCameraSnapResult
    func clip(params: RadioClawCameraClipParams) async throws -> RadioClawCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: RadioClawLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: RadioClawLocationGetParams,
        desiredAccuracy: RadioClawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: RadioClawLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> RadioClawDeviceStatusPayload
    func info() -> RadioClawDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: RadioClawPhotosLatestParams) async throws -> RadioClawPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: RadioClawContactsSearchParams) async throws -> RadioClawContactsSearchPayload
    func add(params: RadioClawContactsAddParams) async throws -> RadioClawContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: RadioClawCalendarEventsParams) async throws -> RadioClawCalendarEventsPayload
    func add(params: RadioClawCalendarAddParams) async throws -> RadioClawCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: RadioClawRemindersListParams) async throws -> RadioClawRemindersListPayload
    func add(params: RadioClawRemindersAddParams) async throws -> RadioClawRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: RadioClawMotionActivityParams) async throws -> RadioClawMotionActivityPayload
    func pedometer(params: RadioClawPedometerParams) async throws -> RadioClawPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: RadioClawWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
