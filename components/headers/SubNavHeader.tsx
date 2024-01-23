import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

const SubNavHeader = ({ navigation, subNavStyle }) => {
    return (
        <View
            style={[
                {
                    alignItems: "flex-start",
                    gap: 5,
                    marginTop: 20,
                    marginBottom: 20,
                },
                subNavStyle, // Additional styles passed in as a prop
            ]}
        >
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View
                    style={{
                        backgroundColor: "black",
                        height: 35,
                        width: 35,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        // marginLeft: -8,
                    }}
                >
                    <FontAwesome5 name="arrow-left" size={18} color="white" />
                </View>
            </TouchableOpacity>

            {/* <Text
                    style={[
                        styles.subtitle,
                        {
                            lineHeight: 30,
                            // backgroundColor: "blue",
                            textAlign: "center",
                        },
                    ]}
                >
                    Details
                </Text> */}
        </View>
    );
};

export default SubNavHeader;

const styles = StyleSheet.create({});
