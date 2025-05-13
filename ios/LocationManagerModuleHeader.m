//
//  LocationManagerModuleHeader.m
//  ePath
//
//  Created by Apple on 01/05/25.
//


#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LocationManagerModule, NSObject)

RCT_EXTERN_METHOD(startLocationSharing)
RCT_EXTERN_METHOD(stopLocationSharing)
RCT_EXTERN_METHOD(getCurrentLocation:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
