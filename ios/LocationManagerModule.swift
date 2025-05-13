//
//  LocationManager.swift
//  locationSharing
//
//  Created by Yashish on 04/03/25.
//

import Foundation
import CoreLocation
import UserNotifications
import React
import ActivityKit


@objc(LocationManagerModule)
class LocationManagerModule: RCTEventEmitter, CLLocationManagerDelegate {
    
    static let shared = LocationManagerModule()
    
    private let locationManager = CLLocationManager()
    @Published var currentLocation: CLLocation?
    
    private var singleUseLocationCallback: ((CLLocation?) -> Void)?
    private var resolveLocationPromise: RCTPromiseResolveBlock?
    private var rejectLocationPromise: RCTPromiseRejectBlock?
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
    }
    
    @objc func startLocationSharing() {
      
      let initialContentState = ePathLiveActivityExtensionAttributes.ContentState(subTitle: "Tracking your location in the background")
              let attributes = ePathLiveActivityExtensionAttributes(titleNotification: "Location Sharing")
              
              do {
                if #available(iOS 16.1, *) {
                  let activity = try Activity<ePathLiveActivityExtensionAttributes>.request(
                    attributes: attributes,
                    contentState: initialContentState,
                    pushType: nil
                  )
                  let status = locationManager.authorizationStatus
                  if status == .authorizedAlways || status == .authorizedWhenInUse {
                      locationManager.allowsBackgroundLocationUpdates = true
                      locationManager.pausesLocationUpdatesAutomatically = false
                      locationManager.startUpdatingLocation()
                      locationManager.startMonitoringSignificantLocationChanges()
                  } else if status == .notDetermined {
                      locationManager.requestAlwaysAuthorization()
                  } else {
                      print("❌ Location permissions not granted.")
                  }
                  print("Started travel activity: \(activity.id)")

                } else {
                  // Fallback on earlier versions
                }
                  
              } catch {
                  print("Failed to start activity: \(error.localizedDescription)")
              }
      
      
       
    }
  
   
    
    /// 🔹 Fetch current location on-demand using Promise
    @objc func getCurrentLocation(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let location = currentLocation {
            print("📍 Returning cached location")
            resolve(["latitude": location.coordinate.latitude, "longitude": location.coordinate.longitude])
        } else {
            print("📍 Fetching one-time location")
            resolveLocationPromise = resolve
            rejectLocationPromise = reject
            locationManager.requestLocation()
        }
    }
    
    @objc func stopLocationSharing() {
      Task {
        if #available(iOS 16.2, *) {
          for activity in Activity<ePathLiveActivityExtensionAttributes>.activities {
            await activity.end(activity.content, dismissalPolicy: .immediate)
          }
        } else {
          // Fallback on earlier versions
        }
        locationManager.stopUpdatingLocation()
        locationManager.stopMonitoringSignificantLocationChanges()
        print("Stopped all Live Activities.")
      }
      
       
    }
    
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
      if #available(iOS 14.0, *) {
        switch manager.authorizationStatus {
        case .authorizedAlways:
          print("✅ Authorized Always - starting location updates")
          locationManager.allowsBackgroundLocationUpdates = true
          locationManager.startUpdatingLocation()
          locationManager.startMonitoringSignificantLocationChanges()
        case .authorizedWhenInUse:
          print("✅ Authorized When In Use - consider prompting for Always")
        case .denied, .restricted:
          print("❌ Location access denied or restricted.")
        default:
          break
        }
      } else {
        // Fallback on earlier versions
      }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        currentLocation = location
        print("📍 New location: \(location.coordinate.latitude), \(location.coordinate.longitude)")
        
        // Resolve Promise if waiting
        resolveLocationPromise?(["latitude": location.coordinate.latitude, "longitude": location.coordinate.longitude])
        resolveLocationPromise = nil
        rejectLocationPromise = nil
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        let clError = error as? CLError
        if clError?.code == .locationUnknown || clError?.code == CLError.Code(rawValue: 0) {
            print("⚠️ Location unknown, retrying...")
            return
        }
        
        // Reject the promise if there was an error
        rejectLocationPromise?("LOCATION_ERROR", "Failed to get location", error)
        resolveLocationPromise = nil
        rejectLocationPromise = nil
        print("❌ Location failed with error: \(error.localizedDescription)")
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return []
    }
}
