import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../styles";

interface CustomMarkerProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    transport: string;
    anchor?: {
        x: number;
        y: number;
    };
}

export const getMarkerIcon = (transport: string) => {
    switch (transport) {
        case "walking":
            return "walking";
        case "motorcycle":
            return "motorcycle";
        case "car":
            return "car";
        case "bus":
            return "bus-alt";
        default:
            return "map-marker-alt";
    }
};

const CustomMarker: React.FC<CustomMarkerProps> = ({
    coordinate,
    transport,
    anchor = { x: 0.5, y: 1.3 },
}) => {
    return (
        <Marker coordinate={coordinate} anchor={anchor}>
            <View
                style={{
                    height: 40,
                    width: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.GREEN,
                    borderRadius: 50,
                }}
            >
                <FontAwesome5
                    name={getMarkerIcon(transport)}
                    size={24}
                    color="white"
                />
            </View>
        </Marker>
    );
};

export default CustomMarker;
