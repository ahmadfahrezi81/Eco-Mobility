import {
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";

import { styles } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import InputWithLabel from "../../components/ui/InputWithLabel";
import LoadButton from "../../components/ui/LoadButton";

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        restoreSession();
    }, []);

    const signUp = async () => {
        setLoading(true);

        // Check if the email ends with @siswa.um.edu
        if (!email.endsWith("@siswa.um.edu.my")) {
            alert(
                "Please use your siswamail to sign up it should ends with @siswa.um.edu.my"
            );
            setLoading(false);
            return; // Exit the function if the condition is not met.
        }

        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = response.user;

            // Add document to Firestore
            if (user) {
                const userRef = doc(FIRESTORE_DB, "users", user.uid);
                await setDoc(userRef, {
                    uid: user.uid,
                    email,
                    name,
                    joinedDate: new Date(),
                    lastUpdated: new Date(),
                });

                const leaderboardRef = doc(
                    FIRESTORE_DB,
                    "leaderboard",
                    user.uid
                );
                await setDoc(leaderboardRef, {
                    userId: user.uid,
                    name,
                    xp: 0,
                });

                await AsyncStorage.setItem(
                    "credentials",
                    JSON.stringify({ email, password, userId: user.uid })
                );

                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });

                // console.log("User added with id: ", userRef.id);
            }
        } catch (e) {
            console.log(e);
            alert("Sign Up Failed" + e.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to restore Session
    const restoreSession = async () => {
        try {
            const credentials = await AsyncStorage.getItem("credentials");
            if (credentials) {
                const { email, password } = JSON.parse(credentials);

                // Try to Sign In silently (this should probably put into try-catch block to handle the error)
                await signInWithEmailAndPassword(auth, email, password);
                // navigation.navigate("Home");
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { gap: 20 }]}>
            <Text style={styles.title}>Sign Up</Text>
            {/* <KeyboardAvoidingView behavior="padding"> */}
            <View style={{ gap: 10 }}>
                <InputWithLabel
                    text={"Name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder={"Type your Name"}
                />
                <InputWithLabel
                    text={"Email"}
                    value={email}
                    placeholder={"Type your Email"}
                    onChangeText={(e) => setEmail(e)}
                />
                <InputWithLabel
                    text={"Password"}
                    value={password}
                    forPassword={true}
                    placeholder={"Type your password"}
                    onChangeText={(e) => setPassword(e)}
                />
            </View>
            <LoadButton onPress={signUp} loading={loading} text="Sign Up" />

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 15 }}>Already have an account?</Text>
                <TouchableOpacity
                    style={{ marginLeft: 2 }}
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "SignIn" }],
                        })
                    }
                >
                    <Text
                        style={{
                            fontSize: 15,
                            textDecorationLine: "underline",
                        }}
                    >
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>

            {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
    );
};

export default SignUpScreen;
