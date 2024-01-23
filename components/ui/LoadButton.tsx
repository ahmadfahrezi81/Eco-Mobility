import React from "react";
import { TouchableOpacity, ActivityIndicator, Text } from "react-native";

const LoadButton = ({ onPress, loading, text }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#058C42",
                padding: 16,
                borderRadius: 10,
                alignItems: "center",
            }}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default LoadButton;
