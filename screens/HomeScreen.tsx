import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tab1 from "../BottomTabs/Tab1";
import Tab2 from "../BottomTabs/Tab2";
import Tab3 from "../BottomTabs/Tab3";
import Tab4 from "../BottomTabs/Tab4";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { COLORS } from "../styles";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    const androidTabBarStyle =
        Platform.OS === "android"
            ? {
                  tabBarStyle: {
                      backgroundColor: COLORS.OFFWHITE,
                      paddingVertical: 10,
                      paddingBottom: 10,
                      height: 65,
                  },
              }
            : {
                  tabBarStyle: {
                      backgroundColor: COLORS.OFFWHITE,
                  },
              };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                ...androidTabBarStyle,
                tabBarLabelStyle: {
                    fontSize: 11, // Adjust label size here
                },
                // tabBarIconStyle: {
                //     height: 30, // Add this to change icon size
                // },
                tabBarActiveTintColor: COLORS.GREEN,
                // tabBarInactiveTintColor: COLORS.DARKGREY,
            }}
        >
            <Tab.Screen
                name="Tab1"
                component={Tab1}
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tab2"
                component={Tab2}
                options={{
                    title: "Activity",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="history" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tab3"
                component={Tab3}
                options={{
                    title: "Ranking",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="trophy" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tab4"
                component={Tab4}
                options={{
                    title: "Manage",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="grid" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
