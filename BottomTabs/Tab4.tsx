import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import ManageButton from "../components/manage/ManageButton";
import ManageCard from "../components/manage/ManageCard";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

//testing
import { Skeleton } from "moti/skeleton";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ProfileBottomSheetModal from "../components/ui/ProfileBottomSheet";

const SkeletonCommonProps = {
    colorMode: "light",
    backgroundColor: "#FFFFFF",
    radius: 20,
} as const;

export default function Tab4({ navigation }) {
    const [userData, setUserData] = useState(null);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                const credentialsStorage = await AsyncStorage.getItem(
                    "credentials"
                );

                if (credentialsStorage) {
                    const { userId } = JSON.parse(credentialsStorage);

                    const docRef = doc(FIRESTORE_DB, "users", userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());

                        await AsyncStorage.setItem(
                            "user",
                            JSON.stringify(docSnap.data())
                        );
                    } else {
                        console.log("No such document!");
                    }
                }

                console.log("hello from manage page");
            }
            fetchData();

            // This function will be run when the component is unmounted.
            // You can implement cleaning up if needed
            return () => {};
        }, [])
    );

    return (
        <SafeAreaView
            edges={["right", "left", "top"]}
            style={[styles.container]}
        >
            <Text style={styles.title}>Manage</Text>

            {/* <Button title="press" onPress={handlePresentModalPress} /> */}
            {/* <Skeleton.Group show={loading}> */}
            <View style={{ gap: 30 }}>
                <Skeleton.Group show={userData === null}>
                    <Skeleton
                        height={160}
                        width={"100%"}
                        {...SkeletonCommonProps}
                    >
                        {userData && (
                            <ManageCard
                                navigation={navigation}
                                user={userData}
                            />
                        )}
                    </Skeleton>

                    <View style={{ gap: 10 }}>
                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                onPress={() =>
                                    navigation.navigate("Certificate")
                                }
                                name={"Certificate"}
                                iconName={"award"}
                            />
                        </Skeleton>

                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                onPress={() => navigation.navigate("Privacy")}
                                name={"Settings"}
                                iconName={"settings"}
                            />
                        </Skeleton>

                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                onPress={() => navigation.navigate("Privacy")}
                                name={"Privacy and Security"}
                                iconName={"shield"}
                            />
                        </Skeleton>

                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                onPress={async () => {
                                    await FIREBASE_AUTH.signOut();
                                    // Remove user credentials from AsyncStorage
                                    await AsyncStorage.removeItem(
                                        "credentials"
                                    );
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "SignIn" }],
                                    });
                                }}
                                name={"Log Out"}
                                iconName={"log-out"}
                            />
                        </Skeleton>
                    </View>
                </Skeleton.Group>
            </View>
            <ProfileBottomSheetModal ref={bottomSheetRef} />
        </SafeAreaView>
    );
}
