import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { TrackingActivity } from "../types";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { getTimeDifference } from "../helpers/helpers";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
                    });

                    setTrackingActivities(trackingActivities);
                    setLoading(false);
                }
            }

            fetchData();
        }, [])
    );

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
                            backgroundColor: "#F1F4F2",
                            height: 50,
                            width: 50,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesome5 name={item.vehicle} size={24} />
                    </View>
                    <View style={{ gap: 15 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                ID:{item.id}
                            </Text>
                            <Text>{item.startTime.toDate().toUTCString()}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
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
                                    backgroundColor: "black",
                                    paddingVertical: 5,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                    alignSelf: "flex-start",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <Text style={{ color: "white", fontSize: 14 }}>
                                    Details
                                </Text>
                                <FontAwesome5
                                    name="arrow-circle-right"
                                    size={14}
                                    color="white"
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
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ columnGap: 20 }}
                        data={trackingActivities}
                        keyExtractor={(item) => item.id}
                        // ListHeaderComponent={() => (
                        //     <Text style={styles.title}>Activity</Text>
                        // )}
                        renderItem={({ item }) => <ActivityList item={item} />}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
