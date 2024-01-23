import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles";
import { Coordinate, TrackingActivity } from "../../types";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import {
    capitalizeFirstLetter,
    getCO2EmissionRate,
    getMapRegion,
    getTimeDifference,
} from "../../helpers/helpers";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import SubNavHeader from "../../components/headers/SubNavHeader";

export default function DetailScreen({ route, navigation }: any) {
    const { data }: { data: TrackingActivity } = route.params;

    const mapRef = useRef<MapView>(null);

    return (
        <SafeAreaView
            edges={["right", "left", "top", "bottom"]}
            style={styles.container}
        >
            <SubNavHeader
                navigation={navigation}
                subNavStyle={{ marginLeft: -10 }}
            />

            {data && (
                <>
                    <View
                        style={{
                            flex: 1,
                            marginBottom: 10,
                            borderRadius: 20,
                        }}
                    >
                        <MapView
                            style={{
                                flex: 1,
                                borderRadius: 20,
                            }}
                            region={getMapRegion(data.coordinates)}
                            ref={mapRef}
                            scrollEnabled={false}
                            provider={PROVIDER_GOOGLE}
                            zoomEnabled={false}
                        >
                            <Polyline
                                coordinates={data.coordinates}
                                strokeWidth={4}
                                strokeColor="red"
                            />
                        </MapView>
                    </View>

                    <View style={{ gap: 5, paddingBottom: 20 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 25,
                                borderRadius: 20,
                                borderBottomLeftRadius: 5,
                                borderBottomEndRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Mode of Transport
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    lineHeight: 18,
                                }}
                            >
                                {capitalizeFirstLetter(data.vehicle)}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 25,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Time
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    lineHeight: 18,
                                }}
                            >
                                {getTimeDifference(
                                    data.startTime.toDate(),
                                    data.endTime.toDate()
                                )}
                            </Text>
                        </View>
                        {/* {data.xp && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    backgroundColor: "white",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 20,
                                    paddingVertical: 30,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "500",
                                    }}
                                >
                                    XP
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600",
                                        lineHeight: 18,
                                    }}
                                >
                                    {data.xp}
                                </Text>
                            </View>
                        )} */}

                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 25,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Distance (km)
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    lineHeight: 18,
                                }}
                            >
                                {data.distance.toFixed(2)}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 25,
                                borderRadius: 20,
                                borderTopLeftRadius: 5,
                                borderTopEndRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                }}
                            >
                                Emission (kg of CO2)
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    lineHeight: 18,
                                }}
                            >
                                {(
                                    data.distance *
                                    getCO2EmissionRate(data.vehicle)
                                ).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
