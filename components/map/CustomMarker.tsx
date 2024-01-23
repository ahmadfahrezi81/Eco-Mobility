import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";

interface CustomMarkerProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    transport: string;
}

const getMarkerIcon = (transport: string) => {
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
}) => {
    return (
        <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1.3 }}>
            <View
                style={{
                    height: 40,
                    width: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "black",
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
