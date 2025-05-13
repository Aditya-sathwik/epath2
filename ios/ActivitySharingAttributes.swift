//
//  ActivitySharingAttributes.swift
//  BTPASTraM
//
//  Created by Gaurav Jain on 13/03/25.
//

import Foundation
import ActivityKit

struct ePathLiveActivityExtensionAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var subTitle: String
    }
    // Fixed non-changing properties about your activity go here!
    var titleNotification: String
}
