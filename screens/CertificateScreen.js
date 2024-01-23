import React from "react";
import { View, Text, Button } from "react-native";

export default function Certificate({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Profile Details Screen</Text>
            <Button title={"Go back"} onPress={() => navigation.goBack()} />
        </View>
    );
}
