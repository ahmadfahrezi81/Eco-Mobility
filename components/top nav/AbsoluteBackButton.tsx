import { View, Text, Platform } from "react-native";
import React from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const AbsoluteBackButton = ({ navigation }) => {
    return (
        <>
            {Platform.OS == "android" ? (
                <View
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        right: 0,
                        flexDirection: "row",
                        zIndex: 100,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View
                            style={{
                                backgroundColor: "black",
                                height: 40,
                                width: 40,
                                borderRadius: 50,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesome5
                                name="arrow-left"
                                size={16}
                                color="white"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <SafeAreaView
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        right: 0,
                        flexDirection: "row",
                        zIndex: 100,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View
                            style={{
                                backgroundColor: "black",
                                height: 40,
                                width: 40,
                                borderRadius: 50,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesome5
                                name="arrow-left"
                                size={16}
                                color="white"
                            />
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </>
    );
};

export default AbsoluteBackButton;
