import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { TrackingActivity } from "../types";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, styles } from "../styles";
import { getTimeDifference } from "../helpers/helpers";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseError } from "firebase/app";
import moment from "moment";

interface ActivityListProps {
    item: TrackingActivity;
}

export default function Tab2({ navigation }) {
    const [trackingActivities, setTrackingActivities] = useState<
        TrackingActivity[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

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

                    // Start listening to the query
                    const unsubscribe = onSnapshot(
                        querying,
                        (snapshot) => {
                            const trackingActivities: TrackingActivity[] = [];

                            snapshot.docs.map((doc) => {
                                const trackingActivity =
                                    doc.data() as TrackingActivity;

                                trackingActivities.push({
                                    id: doc.id,
                                    vehicle: trackingActivity.vehicle,
                                    coordinates: trackingActivity.coordinates,
                                    startTime: trackingActivity.startTime,
                                    endTime: trackingActivity.endTime,
                                    distance: trackingActivity.distance,
                                    xp: trackingActivity.xp,
                                });
                            });

                            if (isMounted) {
                                setTrackingActivities(trackingActivities);
                                setLoading(false);
                            }
                        },
                        handleError
                    ); // maybe you would like to handle the error here

                    // This is your cleanup function
                    return () => {
                        isMounted = false;
                        unsubscribe(); // Stop listening for changes
                    };
                }
            }

            fetchData();
        }, [])
    );

    function handleError(error: FirebaseError) {
        console.error("Error received in snapshot listener", error);
    }

    const ActivityList = ({ item }: ActivityListProps) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("Details", { data: item })}
            >
                <View
                    style={{
                        borderRadius: 20,
                        backgroundColor: "white",
                        padding: 15,
                        gap: 15,
                        flexDirection: "row",
                        marginBottom: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: `${COLORS.GREEN}1A`,
                            height: 50,
                            width: 50,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesome5
                            name={item.vehicle}
                            size={26}
                            color={COLORS.GREEN}
                        />
                    </View>
                    <View style={{ gap: 12 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "700" }}>
                                {moment(item.startTime.seconds * 1000).format(
                                    "ddd, MMM D YYYY h:mm A"
                                )}
                            </Text>

                            <Text style={{ fontSize: 14, fontStyle: "italic" }}>
                                Mode of Transport:{" "}
                                {item.vehicle.charAt(0).toUpperCase() +
                                    item.vehicle.slice(1)}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: -5,
                            }}
                        >
                            <View style={{ gap: 1 }}>
                                <Text
                                    style={{ fontSize: 14, fontWeight: "300" }}
                                >
                                    TIME
                                </Text>
                                <Text
                                    style={{ fontSize: 16, fontWeight: "600" }}
                                >
                                    {getTimeDifference(
                                        item.startTime.toDate(),
                                        item.endTime.toDate()
                                    )}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "300",
                                    }}
                                >
                                    Distance (km)
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}
                                >
                                    {item.distance.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Details", { data: item })
                            }
                        >
                            <View
                                style={{
                                    backgroundColor: COLORS.GREEN,
                                    paddingVertical: 5,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                    alignSelf: "flex-start",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.WHITE,
                                        fontSize: 14,
                                    }}
                                >
                                    Details
                                </Text>
                                <FontAwesome5
                                    name="arrow-circle-right"
                                    size={14}
                                    color={COLORS.WHITE}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <Text style={styles.title}>Activity</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    {trackingActivities.length > 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ columnGap: 20 }}
                            data={trackingActivities}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ActivityList item={item} />
                            )}
                        />
                    ) : (
                        <Text>
                            You currently have no activity. {"\n"}Please Start
                            `Track Now`.
                        </Text>
                    )}
                </>
            )}
        </SafeAreaView>
    );
}
