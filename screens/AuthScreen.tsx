import React, { useState, useEffect } from "react";
import { Button, KeyboardAvoidingView, TextInput, View } from "react-native";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { styles } from "../styles";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function AuthScreen({ navigation }) {
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
                    JSON.stringify({ email, password, userId: user.uid })
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
        <View style={[styles.container, { gap: 10 }]}>
            {/* <KeyboardAvoidingView behavior="padding"> */}
            <TextInput
                autoCapitalize="none"
                value={email}
                placeholder="Email"
                onChangeText={(e) => setEmail(e)}
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderWidth: 2,
                    borderRadius: 10,
                }}
            />
            <TextInput
                secureTextEntry={true}
                value={password}
                placeholder="Password"
                onChangeText={(e) => setPassword(e)}
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderWidth: 2,
                    borderRadius: 10,
                }}
            />

            <Button title="Sign in" onPress={signIn} />
            <Button title="Sign Up" onPress={signUp} />
            {/* </KeyboardAvoidingView> */}
        </View>
    );
}
