package `in`.epathtracking.locationsharing


import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.provider.Settings
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import android.content.IntentFilter
import android.os.Build
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.facebook.react.modules.core.DeviceEventManagerModule
import `in`.epathtracking.locationsharing.LocationService


class LocationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var locationCallback: Callback? = null
    private var isReceiverRegistered = false // Flag to track receiver status
    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun startLocation() {
        Log.e("startLocation", "Fetching location...")
        startLocationService()
    }

   @ReactMethod
    fun stopLocation() {
        Log.e("stopLocation", "Fetching location...")
        val intent = Intent(reactContext, LocationService::class.java)
            intent.action = "STOP_SERVICE"
        reactContext.startService(intent)  // Directly stop the service
    }

    @ReactMethod
    fun getLocation(callback: Callback) {
        Log.e("getLocation", "Fetching location...")
        locationCallback = callback  // Store the callback to return data later
    }


    private fun startLocationService() {
        Log.e("startLocationService", "started")
        if (isGpsEnabled()) {
            val intent = Intent(reactContext, LocationService::class.java)
            ContextCompat.startForegroundService(reactContext, intent)
        } else {
            enableGps()
        }
    }

    private fun isGpsEnabled(): Boolean {
        val locationManager =
            reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    private fun enableGps() {
        val activity = currentActivity ?: return
        val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
        activity.startActivity(intent)
    }


    // BroadcastReceiver to receive location updates
    private val locationReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            Log.e("intent?.action", intent?.action.toString())
            if (intent?.action == "in.epathtracking.LOCATION_UPDATE") {
                val latitude = intent.getDoubleExtra("latitude", 0.0)
                val longitude = intent.getDoubleExtra("longitude", 0.0)
                Log.e("locationReceiver-->", "Received location: $latitude, $longitude")
                sendLocationUpdateToJS(latitude, longitude)
//                locationCallback?.invoke(latitude, longitude)
            }
        }
    }

    private fun sendLocationUpdateToJS(latitude: Double, longitude: Double) {
        if (reactContext.hasActiveCatalystInstance()) {
            val locationData: WritableMap = Arguments.createMap()
            locationData.putDouble("latitude", latitude)
            locationData.putDouble("longitude", longitude)

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("LocationUpdate", locationData)
        }
    }


    @ReactMethod
    fun startListening() {
        if (isReceiverRegistered) {
            Log.e("LocationModule", "Receiver already registered, skipping...")
            return  // Prevent multiple registrations
        }

        val filter = IntentFilter("in.epathtracking.LOCATION_UPDATE")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            reactContext.registerReceiver(locationReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            ContextCompat.registerReceiver(
                reactContext,
                locationReceiver,
                filter,
                ContextCompat.RECEIVER_NOT_EXPORTED
            )
        }

        isReceiverRegistered = true  // Set flag to indicate receiver is registered
        Log.e("LocationModule", "Receiver Registered")
    }

    @ReactMethod
    fun stopListening() {
        try {
            reactContext.unregisterReceiver(locationReceiver)
            Log.d("LocationModule", "Receiver Unregistered")
        } catch (e: IllegalArgumentException) {
            Log.e("LocationModule", "Receiver was not registered or already unregistered")
        }
    }

    override fun initialize() {
        super.initialize()
        Log.e("LocationModule", "Registering BroadcastReceiver")
        val filter = IntentFilter("in.epathtracking.LOCATION_UPDATE")
        startListening()
        // Register receiver with LocalBroadcastManager
        LocalBroadcastManager.getInstance(reactContext).registerReceiver(locationReceiver, filter)
    }

//    override fun onCatalystInstanceDestroy() {
//        stopListening() // Stop receiving updates when React Native instance is destroyed
//    }

}
