import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Leaderboard, TrackingActivity } from "../types";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, styles } from "../styles";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfilePicture from "../components/ui/ProfilePicture";
import { FirebaseError } from "firebase/app";

interface LeaderboardItemProps {
    item: Leaderboard;
}

export default function Tab3({ navigation }) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string>("");

    const avatar = "https://via.placeholder.com/150";

    useFocusEffect(
        useCallback(() => {
            let isMounted = true; // <--- The flag to track the component's mounted state

            const fetchData = async () => {
                const credentialsStorage = await AsyncStorage.getItem(
                    "credentials"
                );

                if (credentialsStorage) {
                    const { userId } = JSON.parse(credentialsStorage);

                    const collectionRef = collection(
                        FIRESTORE_DB,
                        "leaderboard"
                    );
                    const querying = query(
                        collectionRef,
                        orderBy("xp", "desc")
                    );

                    // Set up Firestore listener
                    const unsubscribe = onSnapshot(
                        querying,
                        (querySnapshot) => {
                            if (isMounted) {
                                const leaderboardData = querySnapshot.docs.map(
                                    (doc, i) => {
                                        const data = doc.data() as Leaderboard;
                                        return {
                                            ...data,
                                            ranking: i + 1,
                                        };
                                    }
                                );

                                setLeaderboard(leaderboardData);
                                setUserId(userId);
                                setLoading(false);
                            }
                        },
                        handleError
                    );

                    // Return unsubscribe function
                    return unsubscribe;
                }
            };

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

    const LeaderboardItem = ({ item }: LeaderboardItemProps) => {
        return (
            <View
                style={{
                    borderRadius: 20,
                    backgroundColor: "white",
                    padding: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    borderWidth: userId === item.userId ? 2 : 0,
                    borderColor: COLORS.GREEN,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ fontSize: 18 }}>{item.ranking}</Text>

                    <ProfilePicture data={item} />

                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                        {item.name.length > 18
                            ? `${item.name.substring(0, 18)}...`
                            : item.name}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Text>{item.xp}</Text>
                    <MaterialCommunityIcons
                        name="star-four-points"
                        size={20}
                        color={COLORS.GREEN}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <Text style={styles.title}>Ranking</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ columnGap: 20, marginBottom: 20 }}
                        data={leaderboard}
                        keyExtractor={(item) => item.userId}
                        renderItem={({ item }) => (
                            <LeaderboardItem item={item} />
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
