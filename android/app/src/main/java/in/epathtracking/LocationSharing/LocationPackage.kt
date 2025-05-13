package `in`.epathtracking.locationsharing

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.Collections

class LocationPackage :ReactPackage{
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val module = ArrayList<NativeModule>();
        module.add(LocationModule(reactContext));
        return module;
    }

    override fun createViewManagers(p0: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        return Collections.emptyList<ViewManager<* , *>>();
    }
}