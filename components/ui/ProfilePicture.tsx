import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import { COLORS } from "../../styles";
import { getInitials } from "../../helpers/helpers";

export default function ProfilePicture({ data }) {
    if (data && data.profileImgURL) {
        return (
            <View>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={{ uri: data.profileImgURL }}
                />
            </View>
        );
    }
    return (
        <View
            style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: COLORS.GREY,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: COLORS.BLACK,
                }}
            >
                {getInitials(data.name)}
            </Text>
        </View>
    );
}
