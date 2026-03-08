// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "RadioClawKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "RadioClawProtocol", targets: ["RadioClawProtocol"]),
        .library(name: "RadioClawKit", targets: ["RadioClawKit"]),
        .library(name: "RadioClawChatUI", targets: ["RadioClawChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "RadioClawProtocol",
            path: "Sources/RadioClawProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "RadioClawKit",
            dependencies: [
                "RadioClawProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/RadioClawKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "RadioClawChatUI",
            dependencies: [
                "RadioClawKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/RadioClawChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "RadioClawKitTests",
            dependencies: ["RadioClawKit", "RadioClawChatUI"],
            path: "Tests/RadioClawKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
