import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

const CardButton = ({ name, iconName, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 20,
                    // width: 200,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 15,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#F2F4F2",
                            borderRadius: 20,
                            width: 35,
                            height: 35,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* <FontAwesome5 name={iconName} size={20} color="black" /> */}
                        <Feather name={iconName} size={24} color="black" />
                    </View>

                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        {name}
                    </Text>
                </View>

                <FontAwesome5 name="angle-right" size={20} color="black" />
            </View>
        </TouchableOpacity>
    );
};

export default CardButton;

const styles = StyleSheet.create({});
