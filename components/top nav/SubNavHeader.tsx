import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../styles";

const SubNavHeader = ({ navigation, title }) => {
    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 20,
                    marginBottom: 20,
                },
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
                        marginLeft: -10,
                        marginRight: 10,
                    }}
                >
                    <FontAwesome5 name="arrow-left" size={18} color="white" />
                </View>
            </TouchableOpacity>

            <Text
                style={[
                    styles.subsubtitle,
                    {
                        flex: 1,
                        textAlign: "center",
                    },
                ]}
            >
                {title}
            </Text>
            <View
                style={{
                    backgroundColor: "black",
                    height: 35,
                    width: 35,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                }}
            ></View>
        </View>
    );
};

export default SubNavHeader;
