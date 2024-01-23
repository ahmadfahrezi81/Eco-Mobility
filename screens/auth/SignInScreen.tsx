import {
    Button,
    KeyboardAvoidingView,
    StyleSheet,
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
import { TextInput } from "react-native-gesture-handler";

import { styles } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadButton from "../../components/ui/LoadButton";
import InputWithLabel from "../../components/ui/InputWithLabel";

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        restoreSession();
    }, []);

    const signIn = async () => {
        setLoading(true);

        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            // console.log(response);

            const user = response.user;

            if (user) {
                await AsyncStorage.setItem(
                    "credentials",
                    JSON.stringify({ email, userId: user.uid })
                );
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            }
        } catch (e) {
            console.log(e);
            alert("Sign In Failed" + e.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);

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
                    name: "John Doe",
                    joinedDate: new Date(),
                });

                console.log("User added with id: ", userRef.id);
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
            <Text style={styles.title}>Sign In</Text>
            {/* <KeyboardAvoidingView behavior="padding"> */}
            <View style={{ gap: 10 }}>
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
            <LoadButton onPress={signIn} loading={loading} text="Sign In" />

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 15 }}>Don’t have an account?</Text>
                <TouchableOpacity
                    style={{ marginLeft: 2 }}
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "SignUp" }],
                        })
                    }
                >
                    <Text
                        style={{
                            fontSize: 15,
                            textDecorationLine: "underline",
                        }}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>

            {/* <Button title="Sign Up" onPress={signUp} /> */}
            {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
    );
};

export default SignInScreen;
