// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { FontAwesome5 } from "@expo/vector-icons";

// const VehicleSelectionButton = ({
//     selectedTransport,
//     handleTransportSelection,
// }: {
//     selectedTransport: string;
//     handleTransportSelection: () => string;
// }) => {
//     return (
//         <TouchableOpacity
//             onPress={() => handleTransportSelection("walking")}
//             style={{
//                 paddingVertical: 5,
//                 paddingHorizontal: 25,
//                 backgroundColor:
//                     selectedTransport === "walking" ? "green" : "transparent",
//                 borderRadius: 50,
//             }}
//         >
//             <FontAwesome5
//                 name={"walking"}
//                 size={24}
//                 color={selectedTransport === "walking" ? "white" : "green"}
//             />
//         </TouchableOpacity>
//     );
// };

// export default VehicleSelectionButton;

// const styles = StyleSheet.create({});

import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Assuming you're using Expo

interface VehicleSelectionButtonProps extends TouchableOpacityProps {
    transport: string;
    selectedTransport: string;
    onSelectTransport: (transport: string) => void;
    icon: string;
    color?: string;
}

const VehicleSelectionButton: React.FC<VehicleSelectionButtonProps> = ({
    transport,
    selectedTransport,
    onSelectTransport,
    icon,
    color = "green",
    ...props
}) => {
    return (
        <TouchableOpacity
            onPress={() => onSelectTransport(transport)}
            style={{
                paddingVertical: 5,
                paddingHorizontal: 25,
                backgroundColor:
                    selectedTransport === transport ? color : "transparent",
                borderRadius: 20,
            }}
        >
            <FontAwesome5
                name={icon}
                size={24}
                color={selectedTransport === transport ? "white" : color}
            />
        </TouchableOpacity>
    );
};

export default VehicleSelectionButton;
