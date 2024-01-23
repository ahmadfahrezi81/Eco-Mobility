import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import ActivityDetailScreen from "./screens/activity/ActivityDetailScreen";
import MapScreen from "./screens/MapScreen";
import ProfileDetailScreen from "./screens/manage/ProfileDetailScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import CertificateScreen from "./screens/CertificateScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import SignInScreen from "./screens/auth/SignInScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                {/* <Stack.Screen name="Auth" component={AuthScreen} /> */}
                <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />

                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />

                <Stack.Screen
                    name="Map"
                    component={MapScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />

                <Stack.Screen
                    name="Details"
                    component={ActivityDetailScreen}
                    // options={{ headerBackTitle: "" }}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />

                {/* Manage */}
                <Stack.Screen
                    name="ProfileDetail"
                    component={ProfileDetailScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />
                <Stack.Screen
                    name="Privacy"
                    component={PrivacyScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />
                <Stack.Screen
                    name="Certificate"
                    component={CertificateScreen}
                    options={{
                        headerShown: false,
                        headerBackTitle: null,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
