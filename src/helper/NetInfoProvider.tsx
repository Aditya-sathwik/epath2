import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

// Create a context
const NetInfoContext = createContext(null);

// Provider component
export const NetInfoProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Initial fetch
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NetInfoContext.Provider value={isConnected}>
            {children}
        </NetInfoContext.Provider>
    );
};

// Custom hook to use NetInfo
export const useNetInfo = () => {
    return useContext(NetInfoContext);
};
