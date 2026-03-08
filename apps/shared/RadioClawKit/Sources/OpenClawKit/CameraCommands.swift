import Foundation

public enum RadioClawCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum RadioClawCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum RadioClawCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum RadioClawCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct RadioClawCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: RadioClawCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: RadioClawCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: RadioClawCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: RadioClawCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct RadioClawCameraClipParams: Codable, Sendable, Equatable {
    public var facing: RadioClawCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: RadioClawCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: RadioClawCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: RadioClawCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
