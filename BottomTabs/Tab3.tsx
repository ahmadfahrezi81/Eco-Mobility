import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Leaderboard, TrackingActivity } from "../types";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

interface LeaderboardItemProps {
    item: Leaderboard;
}

export default function Tab3({ navigation }) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string>("");

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
                        "leaderboard"
                    );

                    const querying = query(
                        collectionRef,
                        orderBy("xp", "desc")
                    );

                    const querySnapshot = await getDocs(querying);

                    const leaderboardData = querySnapshot.docs.map((doc, i) => {
                        const data = doc.data() as Leaderboard;
                        return {
                            ...data,
                            ranking: i + 1,
                        };
                    });

                    console.log(leaderboardData);

                    setLeaderboard(leaderboardData);
                    setUserId(userId);
                    setLoading(false);
                }
            }

            fetchData();
        }, [])
    );

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
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: 15,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 18 }}>{item.ranking}</Text>
                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                        {item.name}
                    </Text>
                    <Text>{item.xp} XP</Text>
                </View>

                {userId === item.userId && (
                    <FontAwesome5 name="dot-circle" size={16} color="black" />
                )}
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
                        style={{ columnGap: 20 }}
                        data={leaderboard}
                        keyExtractor={(item) => item.userId}
                        // ListHeaderComponent={() => (
                        //     <Text style={styles.title}>Activity</Text>
                        // )}
                        renderItem={({ item }) => (
                            <LeaderboardItem item={item} />
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
