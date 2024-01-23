import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
    ActivityIndicator,
    BackHandler,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import VehicleSelectionButton from "../components/map/VehicleSelectionButton";
import CustomMarker from "../components/map/CustomMarker";
import { calculateTotalDistance } from "../helpers/distanceCalculator";
import { useUserLocationChange } from "../hooks/userLocationChange";
import { FIREBASE_APP, FIRESTORE_DB } from "../firebaseConfig";
import {
    FieldValue,
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    increment,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { Coordinate, MovementTrailWithoutID } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SafeAreaView } from "react-native-safe-area-context";
import AbsoluteBackButton from "../components/headers/AbsoluteBackButton";
import { COLORS } from "../styles";

const delta = 0.0922; // approximately 10km

export default function MapScreen({ navigation }) {
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Coordinate | null>();
    const [currentMovementTrails, setCurrentMovementTrails] = useState<
        Coordinate[]
    >([]);
    const [allMovementTrail, setAllMovementTrail] = useState<
        { latitude: number; longitude: number }[][]
    >([[]]);

    const [selectedTransport, setSelectedTransport] =
        useState<string>("walking");

    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [startTime, setStartTime] = useState<Timestamp>();

    const [loading, setLoading] = useState(false);

    //Time Tracker
    const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTracking) {
            interval = setInterval(() => {
                const currentTime = Timestamp.fromDate(new Date());
                const diffInSeconds = Math.abs(
                    currentTime.seconds - startTime.seconds
                );

                const h = formatTime(Math.floor(diffInSeconds / 3600));
                const m = formatTime(Math.floor((diffInSeconds / 60) % 60));
                const s = formatTime(diffInSeconds % 60);
                setTime({ h, m, s });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [startTime, isTracking]);

    useEffect(() => {
        // We are subscribing to the `beforeRemove` event
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            // Preventing default behavior
            e.preventDefault();
            // Do not allow to go back until data is_loaded
            if (!loading) {
                // If loading is false, allow navigation
                unsubscribe();
                navigation.dispatch(e.data.action);
            } else {
                console.log("Blocked navigation");
            }
        });
        return unsubscribe;
    }, [navigation, loading]);

    const formatTime = (time: number) => {
        return time < 10 ? `0${time}` : time.toString();
    };

    const mapRef = useRef<MapView>(null);

    useUserLocationChange(() => {});

    const addDataToFirestore = async ({
        distance,
        startTime,
        endTime,
        vehicle,
        coordinates,
    }: MovementTrailWithoutID) => {
        try {
            const credentialsStorage = await AsyncStorage.getItem(
                "credentials"
            );

            if (credentialsStorage) {
                setLoading(true);

                const { userId } = JSON.parse(credentialsStorage);

                const userRef = doc(FIRESTORE_DB, "trackingActivities", userId);
                const trackingActivitiesRef = collection(
                    userRef,
                    "userTrackingActivities"
                );

                if (!(await getDoc(userRef)).exists()) {
                    await setDoc(userRef, {});
                }

                // await addDoc(trackingActivitiesRef, {
                //     distance,
                //     startTime,
                //     endTime,
                //     vehicle,
                //     coordinates,
                //     xp: 10,
                // });

                const newDocRef = await addDoc(trackingActivitiesRef, {
                    distance,
                    startTime,
                    endTime,
                    vehicle,
                    coordinates,
                    xp: 10,
                });

                const docSnap = await getDoc(newDocRef);
                const data = docSnap.data();

                const leaderboardRef = doc(FIRESTORE_DB, "leaderboard", userId);
                await updateDoc(leaderboardRef, {
                    xp: increment(10),
                });
                //later on I need a way to calculate the xp and emission using helper class

                console.log("[DATA SENT]", trackingActivitiesRef);

                setLoading(false);

                setTimeout(() => {
                    // navigation.goBack();

                    navigation.navigate("ReportSummary", { data: data });
                }, 100);
            }
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleUserLocationChange = (event: any) => {
        if (isTracking) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setCurrentLocation({ latitude, longitude });

            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }

            setCurrentMovementTrails((prevTrail) => [
                ...prevTrail,
                { latitude, longitude },
            ]);

            const distance = calculateTotalDistance(currentMovementTrails);
            setTotalDistance(distance);
        }
    };

    const handleToggleTracking = () => {
        if (!isTracking) {
            setStartTime(Timestamp.fromDate(new Date()));
        }

        setIsTracking(!isTracking);

        if (isTracking) {
            setAllMovementTrail((prevTrails) => [
                ...prevTrails,
                currentMovementTrails,
            ]);
            setCurrentMovementTrails([]);
            setCurrentLocation(null);

            const distance = calculateTotalDistance(currentMovementTrails);

            setTotalDistance(0);
            setTime({ h: "00", m: "00", s: "00" });

            addDataToFirestore({
                distance: distance,
                startTime: startTime,
                endTime: Timestamp.fromDate(new Date()),
                vehicle: selectedTransport,
                coordinates: currentMovementTrails,
            });
        }
    };

    const handleTransportSelection = (transport: string) => {
        setSelectedTransport(transport);
    };

    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setCurrentLocation({ latitude, longitude });

        setCurrentMovementTrails((prevTrail) => [
            ...prevTrail,
            { latitude, longitude },
        ]);

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }

        const distance = calculateTotalDistance(currentMovementTrails);
        setTotalDistance(distance);
    };

    return (
        <View style={styles.container}>
            <AbsoluteBackButton navigation={navigation} />

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: 3.1232,
                    longitude: 101.6544,
                    latitudeDelta: delta,
                    longitudeDelta: delta,
                }}
                onUserLocationChange={handleUserLocationChange}
                minZoomLevel={15}
                zoomEnabled={true}
                showsCompass={true}
                showsUserLocation={true}
                onPress={handleMapPress}
                initialRegion={
                    currentLocation
                        ? {
                              latitude: currentLocation.latitude,
                              longitude: currentLocation.longitude,
                              latitudeDelta: delta,
                              longitudeDelta: delta,
                          }
                        : undefined
                }
            >
                {currentMovementTrails.length > 1 && (
                    <Polyline
                        coordinates={currentMovementTrails}
                        strokeWidth={4}
                        strokeColor="#FF0000"
                    />
                )}

                {allMovementTrail.map((trail, index) => (
                    <Polyline
                        key={index}
                        coordinates={trail}
                        strokeWidth={4}
                        strokeColor="#FF0000"
                    />
                ))}
                {currentLocation && (
                    <CustomMarker
                        coordinate={currentLocation}
                        transport={selectedTransport}
                    />
                )}
            </MapView>

            <View
                style={{
                    padding: 20,
                    paddingBottom: 30,
                    gap: 20,
                    backgroundColor: COLORS.OFFWHITE,
                }}
            >
                {isTracking && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 14, fontWeight: "300" }}>
                                TIME
                            </Text>
                            <Text
                                style={{ fontSize: 26, fontWeight: "bold" }}
                            >{`${time.h}:${time.m}:${time.s}`}</Text>
                        </View>

                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 14, fontWeight: "300" }}>
                                DISTANCE (km)
                            </Text>
                            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                                {totalDistance.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* When tracking start this should disapear */}
                {!isTracking && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            paddingVertical: 5,
                        }}
                    >
                        <VehicleSelectionButton
                            transport="walking"
                            selectedTransport={selectedTransport}
                            onSelectTransport={handleTransportSelection}
                            icon="walking"
                        />
                        <VehicleSelectionButton
                            transport="motorcycle"
                            selectedTransport={selectedTransport}
                            onSelectTransport={handleTransportSelection}
                            icon="motorcycle"
                        />
                        <VehicleSelectionButton
                            transport="car"
                            selectedTransport={selectedTransport}
                            onSelectTransport={handleTransportSelection}
                            icon="car"
                        />
                        <VehicleSelectionButton
                            transport="bus"
                            selectedTransport={selectedTransport}
                            onSelectTransport={handleTransportSelection}
                            icon="bus-alt"
                        />
                    </View>
                )}

                {isTracking ? (
                    <TouchableOpacity
                        onPress={handleToggleTracking}
                        style={{
                            padding: 17,
                            backgroundColor: "transparent",
                            alignItems: "center",
                            borderRadius: 20,
                            borderWidth: 3,
                            borderColor: COLORS.GREEN,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.OFFWHITE} />
                        ) : (
                            <Text
                                style={{
                                    color: COLORS.GREEN,
                                    fontSize: 16,
                                    fontWeight: "800",
                                }}
                            >
                                STOP AND FINISH
                            </Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleToggleTracking}
                        style={{
                            padding: 20,
                            backgroundColor: COLORS.GREEN,
                            alignItems: "center",
                            borderRadius: 20,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.OFFWHITE} />
                        ) : (
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontSize: 16,
                                    fontWeight: "800",
                                }}
                            >
                                START
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    distanceText: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 18,
    },
});
