import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Leaderboard, TrackingActivity } from "../types";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, styles } from "../styles";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Entypo,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { getAllFromStorage } from "../helpers/printAllFromAsyncStorage";
import ProfilePicture from "../components/ui/ProfilePicture";
import { getInitials } from "../helpers/profileHelpers";

interface LeaderboardItemProps {
    item: Leaderboard;
}

export default function Tab3({ navigation }) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string>("");
    const [userData, setUserData] = useState(null);

    const avatar = "https://via.placeholder.com/150";

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                AsyncStorage.multiGet(["credentials", "user"]).then(
                    (response) => {
                        const user = JSON.parse(response[1][1]);

                        if (user) {
                            setUserData(user);
                            console.log(user);
                        }
                    }
                );

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

                    // console.log(leaderboardData);

                    setLeaderboard(leaderboardData);
                    setUserId(userId);
                    setLoading(false);
                }

                // getAllFromStorage();
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
                    borderColor: COLORS.GREEN,
                }}
            >
                {/* <View
                    style={{
                        flexDirection: "row",
                        gap: 15,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                > */}

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
                    {/* <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            backgroundColor: COLORS.GREY,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: COLORS.BLACK,
                            }}
                        >
                            {getInitials(item.name)}
                        </Text>
                    </View> */}

                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                        {item.name}
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
                {/* </View> */}

                {/* {userId === item.userId && (
                    <FontAwesome5 name="dot-circle" size={16} color="black" />
                )} */}
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
