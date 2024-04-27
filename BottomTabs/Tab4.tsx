import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    View,
    Text,
    Button,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import ManageButton from "../components/manage/ManageButton";
import ManageCard from "../components/manage/ManageCard";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

//testing
import { Skeleton } from "moti/skeleton";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ProfileBottomSheetModal from "../components/ui/ProfileBottomSheet";
import { FirebaseError } from "firebase/app";

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
            let isMounted = true;

            async function fetchData() {
                const credentialsStorage = await AsyncStorage.getItem(
                    "credentials"
                );

                if (credentialsStorage) {
                    const { userId } = JSON.parse(credentialsStorage);

                    const docRef = doc(FIRESTORE_DB, "users", userId);

                    const unsubscribe = onSnapshot(
                        docRef,
                        (doc) => {
                            if (doc.exists()) {
                                const data = doc.data();
                                setUserData(data);
                                AsyncStorage.setItem(
                                    "user",
                                    JSON.stringify(data)
                                );
                            } else {
                                console.log("No such document!");
                            }
                        },
                        handleError
                    );

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
                                name={"Privacy and Security"}
                                iconName={"shield"}
                            />
                        </Skeleton>
                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                onPress={() =>
                                    navigation.navigate("TermsAndCondition")
                                }
                                name={"Terms & Condition"}
                                iconName={"file-text"}
                            />
                        </Skeleton>

                        <Skeleton width={"100%"} {...SkeletonCommonProps}>
                            <ManageButton
                                // onPress={async () => {
                                //     await FIREBASE_AUTH.signOut();
                                //     // Remove user credentials from AsyncStorage
                                //     await AsyncStorage.removeItem(
                                //         "credentials"
                                //     );
                                //     navigation.reset({
                                //         index: 0,
                                //         routes: [{ name: "SignIn" }],
                                //     });
                                // }}
                                onPress={() => {
                                    Alert.alert(
                                        "Confirm logout",
                                        "Are you sure you want to logout?",
                                        [
                                            {
                                                text: "No",
                                                onPress: () =>
                                                    console.log(
                                                        "Cancel Pressed"
                                                    ),
                                                style: "cancel",
                                            },
                                            {
                                                text: "Yes",
                                                onPress: async () => {
                                                    await FIREBASE_AUTH.signOut();
                                                    await AsyncStorage.removeItem(
                                                        "credentials"
                                                    );
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [
                                                            { name: "SignIn" },
                                                        ],
                                                    });
                                                },
                                            },
                                        ],
                                        { cancelable: false }
                                    );
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
