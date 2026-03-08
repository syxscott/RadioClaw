import Foundation
import SwiftUI

enum SessionRole {
    case main
    case other
}

enum ToolKind: String, Codable {
    case bash, read, write, edit, attach, other
}

enum ActivityKind: Codable, Equatable {
    case job
    case tool(ToolKind)
}

enum IconState: Equatable {
    case idle
    case workingMain(ActivityKind)
    case workingOther(ActivityKind)
    case overridden(ActivityKind)

    enum BadgeProminence: Equatable {
        case primary
        case secondary
        case overridden
    }

    var badgeSymbolName: String {
        switch self.activity {
        case .tool(.bash): "chevron.left.slash.chevron.right"
        case .tool(.read): "doc"
        case .tool(.write): "pencil"
        case .tool(.edit): "pencil.tip"
        case .tool(.attach): "paperclip"
        case .tool(.other), .job: "gearshape.fill"
        }
    }

    var badgeProminence: BadgeProminence? {
        switch self {
        case .idle: nil
        case .workingMain: .primary
        case .workingOther: .secondary
        case .overridden: .overridden
        }
    }

    var isWorking: Bool {
        switch self {
        case .idle: false
        default: true
        }
    }

    private var activity: ActivityKind {
        switch self {
        case let .workingMain(kind),
             let .workingOther(kind),
             let .overridden(kind):
            kind
        case .idle:
            .job
        }
    }
}

enum IconOverrideSelection: String, CaseIterable, Identifiable {
    case system
    case idle
    case mainBash, mainRead, mainWrite, mainEdit, mainOther
    case otherBash, otherRead, otherWrite, otherEdit, otherOther

    var id: String {
        self.rawValue
    }

    var label: String {
        switch self {
        case .system: "System (auto)"
        case .idle: "Idle"
        case .mainBash: "Working main â€?bash"
        case .mainRead: "Working main â€?read"
        case .mainWrite: "Working main â€?write"
        case .mainEdit: "Working main â€?edit"
        case .mainOther: "Working main â€?other"
        case .otherBash: "Working other â€?bash"
        case .otherRead: "Working other â€?read"
        case .otherWrite: "Working other â€?write"
        case .otherEdit: "Working other â€?edit"
        case .otherOther: "Working other â€?other"
        }
    }

    func toIconState() -> IconState {
        let map: (ToolKind) -> ActivityKind = { .tool($0) }
        switch self {
        case .system: return .idle
        case .idle: return .idle
        case .mainBash: return .workingMain(map(.bash))
        case .mainRead: return .workingMain(map(.read))
        case .mainWrite: return .workingMain(map(.write))
        case .mainEdit: return .workingMain(map(.edit))
        case .mainOther: return .workingMain(map(.other))
        case .otherBash: return .workingOther(map(.bash))
        case .otherRead: return .workingOther(map(.read))
        case .otherWrite: return .workingOther(map(.write))
        case .otherEdit: return .workingOther(map(.edit))
        case .otherOther: return .workingOther(map(.other))
        }
    }
}
