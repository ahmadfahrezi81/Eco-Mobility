import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    TextInput,
    ActivityIndicator,
    Pressable,
    Image,
} from "react-native";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { styles } from "../../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import SubNavHeader from "../../components/headers/SubNavHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import InputWithLabel from "../../components/ui/InputWithLabel";
import LoadButton from "../../components/ui/LoadButton";

export default function ProfileDetail({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    // Loading state
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const userStorage = await AsyncStorage.getItem("user");

            if (userStorage) {
                const user = JSON.parse(userStorage);

                setUserData(user);
                setName(user.name);
                setEmail(user.email);
                console.log(user);
            }
        };

        fetchData();
    }, []);

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

    // updateProfile function now sets loading to true before the async operation and false when it's done
    const updateProfile = async () => {
        setLoading(true);

        const userRef = await doc(FIRESTORE_DB, `users/${userData.uid}`);

        await updateDoc(userRef, { name: name });

        const leaderboardRef = await doc(
            FIRESTORE_DB,
            `leaderboard/${userData.uid}`
        );

        await updateDoc(leaderboardRef, { name: name });

        setLoading(false);

        setTimeout(() => {
            navigation.goBack();
        }, 100);
    };

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader
                navigation={navigation}
                subNavStyle={{ marginLeft: -10 }}
            />

            {userData && (
                <View style={{ gap: 10 }}>
                    <InputWithLabel
                        text={"Name"}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        disabled={loading}
                    />

                    <InputWithLabel
                        disabled={true}
                        text={"Email"}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <LoadButton
                        onPress={updateProfile}
                        loading={loading}
                        text="Update Profile"
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { View, Text, Button, TextInput } from "react-native";
// import { FIRESTORE_DB } from "../../firebaseConfig";
// import { styles } from "../../styles";
// import { TouchableOpacity } from "react-native-gesture-handler";

// export default function ProfileDetail({ navigation }) {
//     const [userData, setUserData] = useState(null);
//     const [name, setName] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             const userStorage = await AsyncStorage.getItem("user");

//             if (userStorage) {
//                 const user = JSON.parse(userStorage);

//                 setUserData(user);
//                 // console.log(user);
//                 setName(user.name);
//             }
//         };

//         fetchData();
//     }, []);

//     const updateProfile = async () => {
//         const ref = await doc(FIRESTORE_DB, `users/${userData.uid}`);

//         await updateDoc(ref, { name: name });

//         navigation.goBack();
//     };

//     return (
//         <View style={styles.container}>
//             {userData && (
//                 <View style={{ gap: 10 }}>
//                     <TextInput
//                         autoCapitalize="none"
//                         value={name}
//                         placeholder="Name"
//                         onChangeText={(e) => setName(e)}
//                         style={{
//                             paddingVertical: 10,
//                             paddingHorizontal: 15,
//                             borderWidth: 2,
//                             borderRadius: 10,
//                         }}
//                     />

//                     <TouchableOpacity
//                         onPress={updateProfile}
//                         style={{
//                             backgroundColor: "black",
//                             padding: 15,
//                             borderRadius: 30,
//                             alignItems: "center",
//                         }}
//                     >
//                         <Text style={{ color: "white" }}>
//                             Update Profile {userData.name}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }
