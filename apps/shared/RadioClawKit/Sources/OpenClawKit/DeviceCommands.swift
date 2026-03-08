import Foundation

public enum RadioClawDeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum RadioClawBatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum RadioClawThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum RadioClawNetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum RadioClawNetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct RadioClawBatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: RadioClawBatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: RadioClawBatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct RadioClawThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: RadioClawThermalState

    public init(state: RadioClawThermalState) {
        self.state = state
    }
}

public struct RadioClawStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct RadioClawNetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: RadioClawNetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [RadioClawNetworkInterfaceType]

    public init(
        status: RadioClawNetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [RadioClawNetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct RadioClawDeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: RadioClawBatteryStatusPayload
    public var thermal: RadioClawThermalStatusPayload
    public var storage: RadioClawStorageStatusPayload
    public var network: RadioClawNetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: RadioClawBatteryStatusPayload,
        thermal: RadioClawThermalStatusPayload,
        storage: RadioClawStorageStatusPayload,
        network: RadioClawNetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct RadioClawDeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}
