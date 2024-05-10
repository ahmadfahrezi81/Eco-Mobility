import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { FIREBASE_APP, FIRESTORE_DB } from "../firebaseConfig";
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, styles } from "../styles";
import { TrackingActivity } from "../types";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCO2EmissionRate } from "../helpers/helpers";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { FirebaseError } from "firebase/app";

export interface Todo {
    id: string;
    content: string;
    done: boolean;
}

export default function Tab1({ navigation }) {
    const [trackingActivities, setTrackingActivities] = useState<
        TrackingActivity[]
    >([]);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [totalEmission, setTotalEmission] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true; // <--- The flag to track the component's mounted state

            async function fetchData() {
                const credentialsStorage = await AsyncStorage.getItem(
                    "credentials"
                );

                if (credentialsStorage) {
                    const { userId } = JSON.parse(credentialsStorage);

                    const collectionRef = collection(
                        FIRESTORE_DB,
                        "trackingActivities",
                        userId,
                        "userTrackingActivities"
                    );

                    const querying = query(
                        collectionRef,
                        orderBy("startTime", "desc")
                    );

                    // Set up Firestore listener
                    const unsubscribe = onSnapshot(
                        querying,
                        (querySnapshot) => {
                            if (isMounted) {
                                let distance = 0;
                                let emission = 0;

                                const trackingActivities =
                                    querySnapshot.docs.map((doc, i) => {
                                        const data =
                                            doc.data() as TrackingActivity;

                                        distance += data.distance;
                                        emission +=
                                            data.distance *
                                            getCO2EmissionRate(data.vehicle);

                                        return {
                                            ...data,
                                        };
                                    });

                                setTotalDistance(distance);
                                setTotalEmission(emission);
                                setTrackingActivities(trackingActivities);
                                setLoading(false);
                            }
                        },
                        handleError
                    );

                    return unsubscribe;
                }
            }

            fetchData().then((unsubscribe) => {
                // Clean up function is run when the component is unmounted.
                // Here, we stop listening to the changes.
                return () => {
                    isMounted = false;
                    if (unsubscribe) {
                        unsubscribe();
                    }
                };
            });
        }, [])
    );

    function handleError(error: FirebaseError) {
        console.error("Error received in snapshot listener", error);
    }

    return (
        <SafeAreaView
            edges={["right", "left", "top"]}
            style={[styles.container]}
        >
            <Text style={styles.title}>Home</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DistanceChart")}
                    >
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: COLORS.WHITE,
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                marginBottom: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Total Distance
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {totalDistance.toFixed(2)}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        KM
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: COLORS.BLACK,
                                        fontWeight: "300",
                                    }}
                                >
                                    Traveled
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="map-marker-distance"
                                    size={24}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("EmissionChart")}
                    >
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                marginBottom: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Total Emission
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {totalEmission.toFixed(2)}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        KG
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: COLORS.BLACK,
                                        fontWeight: "300",
                                    }}
                                >
                                    of CO2 Emitted
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="molecule-co2"
                                    size={30}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Track Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Map")}
                    >
                        <View
                            style={{
                                padding: 20,
                                backgroundColor: COLORS.GREEN,
                                borderRadius: 20,
                                // height: 1000,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 40,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontSize: 20,
                                    fontWeight: "500",
                                    // fontStyle: "italic", // Set the fontStyle to italic
                                }}
                            >
                                TRACK NOW
                            </Text>
                            <AntDesign
                                name="rightcircleo"
                                size={26}
                                color={COLORS.OFFWHITE}
                            />
                        </View>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}
