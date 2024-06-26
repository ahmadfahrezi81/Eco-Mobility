import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ActivityDetailScreen from "./screens/activity/ActivityDetailScreen";
import MapScreen from "./screens/MapScreen";
import ProfileDetailScreen from "./screens/manage/ProfileDetailScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import CertificateScreen from "./screens/manage/CertificateScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import ReportSummary from "./screens/ReportSummary";
import DistanceChart from "./screens/home/DistanceChartScreen";
import EmissionChart from "./screens/home/EmissionChartScreen";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TermsAndCondition from "./screens/TermsAndCondition";
import { StatusBar } from "react-native";
import { COLORS } from "./styles";

const Stack = createStackNavigator();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={COLORS.OFFWHITE}
                />

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

                        {/* Home */}

                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                                headerShown: false,
                                headerBackTitle: null,
                            }}
                        />

                        <Stack.Screen
                            name="DistanceChart"
                            component={DistanceChart}
                            options={{
                                headerShown: false,
                                headerBackTitle: null,
                            }}
                        />

                        <Stack.Screen
                            name="EmissionChart"
                            component={EmissionChart}
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

                        {/* report */}

                        <Stack.Screen
                            name="ReportSummary"
                            component={ReportSummary}
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
                            name="TermsAndCondition"
                            component={TermsAndCondition}
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
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
