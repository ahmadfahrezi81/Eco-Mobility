import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
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
import { styles } from "../styles";
import { TrackingActivity } from "../types";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCO2EmissionRate } from "../helpers/helpers";
import {
    AntDesign,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

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
                    const snapshot = await getDocs(querying);

                    const trackingActivities: TrackingActivity[] = [];

                    let distance = 0;
                    let emission = 0;

                    snapshot.docs.map((doc) => {
                        const trackingActivity = doc.data() as TrackingActivity;

                        trackingActivities.push({
                            id: doc.id,
                            vehicle: trackingActivity.vehicle,
                            coordinates: trackingActivity.coordinates,
                            startTime: trackingActivity.startTime,
                            endTime: trackingActivity.endTime,
                            distance: trackingActivity.distance,
                            xp: trackingActivity.xp,
                        });

                        distance += trackingActivity.distance;

                        emission +=
                            trackingActivity.distance *
                            getCO2EmissionRate(trackingActivity.vehicle);

                        // setTotalDistance(
                        //     (prevTotalDistance) =>
                        //         prevTotalDistance + trackingActivity.distance
                        // );

                        // setTotalEmission(
                        //     (prevTotalEmission) =>
                        //         prevTotalEmission +
                        //         trackingActivity.distance *
                        //             getCO2EmissionRate(trackingActivity.vehicle)
                        // );
                    });

                    setTotalDistance(distance);
                    setTotalEmission(emission);

                    // console.log(trackingActivities);

                    // console.log(totalDistance);

                    setTrackingActivities(trackingActivities);
                    setLoading(false);
                }
            }

            fetchData();
        }, [])
    );

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
                            <Text style={{ fontSize: 18 }}>Total Distance</Text>

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
                                    color: "grey",
                                }}
                            >
                                Traveled
                            </Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: "#F1F4F2",
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
                                color="black"
                            />
                        </View>
                    </View>

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
                            <Text style={{ fontSize: 18 }}>Total Emission</Text>

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
                                    color: "grey",
                                }}
                            >
                                of CO2 Emitted
                            </Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: "#F1F4F2",
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
                                color="black"
                            />
                        </View>
                    </View>

                    {/* Track Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Map")}
                    >
                        <View
                            style={{
                                padding: 20,
                                backgroundColor: "black",
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
                                    color: "white",
                                    fontSize: 20,
                                    fontWeight: "500",
                                    fontStyle: "italic", // Set the fontStyle to italic
                                }}
                            >
                                TRACK NOW
                            </Text>
                            <AntDesign
                                name="rightcircleo"
                                size={26}
                                color="white"
                            />
                        </View>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}
