//
//  ePathLiveActivityExtensionLiveActivity.swift
//  ePathLiveActivityExtension
//
//  Created by Apple on 01/05/25.
//

import ActivityKit
import WidgetKit
import SwiftUI


struct ePathLiveActivityExtensionLiveActivity: Widget {
  var body: some WidgetConfiguration {
         ActivityConfiguration(for: ePathLiveActivityExtensionAttributes.self) { context in
             // Lock screen/banner UI goes here
             VStack {
                 Text(context.attributes.titleNotification)
                 Spacer()
                 Text(context.state.subTitle)
             }
             .activityBackgroundTint(Color.cyan)
             .activitySystemActionForegroundColor(Color.black)
         } dynamicIsland: { context in
             DynamicIsland {
                 DynamicIslandExpandedRegion(.center) {
                     EmptyView()
                 }
             } compactLeading: {
                 EmptyView()
             } compactTrailing: {
                 EmptyView()
             } minimal: {
                 EmptyView()
             }
         }
     }
}
