import { useEffect } from "react";
import * as Location from "expo-location";

export const useUserLocationChange = (
    callback: (coords: Location.LocationObject) => void
) => {
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                callback(location.coords);

                const subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 5000,
                        distanceInterval: 20,
                    },
                    (newLocation) => {
                        callback(newLocation.coords);
                    }
                );

                return () => {
                    if (subscription) {
                        subscription.remove();
                    }
                };
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        })();
    }, [callback]);
};
