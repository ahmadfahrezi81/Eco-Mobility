import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadButton from "../../components/ui/LoadButton";
import InputWithLabel from "../../components/ui/InputWithLabel";
import { getAllFromAsyncStorage } from "../../helpers/getAllFromAsyncStorage";

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    // const [checkingLogin, setCheckingLogin] = useState(true); // Added state for checking login

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
        } catch (error) {
            console.log(error);
            alert("Sign In Failed" + error.message);
        } finally {
            setLoading(false);
        }
    };

    const restoreSession = async () => {
        try {
            const credentials = await AsyncStorage.getItem("credentials");

            if (credentials) {
                const { email, password } = JSON.parse(credentials);

                getAllFromAsyncStorage();

                try {
                    const response = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    const user = response.user;

                    if (user) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Home" }],
                        });
                    }
                } catch (e) {
                    console.log(e);

                    // Handle the error appropriately, e.g. clear the stored credentials
                }
            }
            // setCheckingLogin(false); // Update state after checking login
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { gap: 20 }]}>
            <>
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

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
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
            </>

            {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
    );
};

export default SignInScreen;
