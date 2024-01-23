import React from "react";
import { TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { COLORS } from "../../styles";

const LoadButton = ({ onPress, loading, text }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: COLORS.GREEN,
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
