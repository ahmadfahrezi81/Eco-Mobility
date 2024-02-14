import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, styles } from "../../styles";
import { Coordinate, TrackingActivity } from "../../types";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import {
    capitalizeFirstLetter,
    getCO2EmissionRate,
    getMapRegion,
    getTimeDifference,
} from "../../helpers/helpers";
import { SafeAreaView } from "react-native-safe-area-context";
import SubNavHeader from "../../components/top nav/SubNavHeader";
import CustomMarker, { getMarkerIcon } from "../../components/map/CustomMarker";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            height: 400,
                            marginBottom: 10,
                            borderRadius: 20,
                            // borderWidth: 2,
                        }}
                    >
                        <MapView
                            style={{
                                flex: 1,
                                borderRadius: 15,
                                // borderWidth: 2,
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
                            <Marker
                                coordinate={data.coordinates[0]}
                                anchor={{ x: 0.5, y: 1 }}
                            >
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={40}
                                    color={COLORS.DARKGREY}
                                />
                            </Marker>
                            <Marker
                                coordinate={
                                    data.coordinates[
                                        data.coordinates.length - 1
                                    ]
                                }
                                anchor={{ x: 0.5, y: 1 }}
                            >
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={40}
                                    color={COLORS.GREEN}
                                />
                            </Marker>
                        </MapView>
                    </View>

                    <View style={{ gap: 5, paddingBottom: 20 }}>
                        {/* Vehicle */}
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Mode of Transport
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {capitalizeFirstLetter(data.vehicle)}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FontAwesome5
                                    name={getMarkerIcon(data.vehicle)}
                                    size={26}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                        {/* Emission */}
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Emission Produce
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {(
                                            data.distance *
                                            getCO2EmissionRate(data.vehicle)
                                        ).toFixed(2)}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        KG
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="molecule-co2"
                                    size={32}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                        {/* Distance */}
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Distance Traveled
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {data.distance.toFixed(2)}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        KM
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FontAwesome5
                                    name="route"
                                    size={24}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                        {/* Time */}
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>Time</Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {getTimeDifference(
                                            data.startTime.toDate(),
                                            data.endTime.toDate()
                                        )}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        {/* KG */}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="clock-time-five"
                                    size={28}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                        {/* XP */}
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: "white",
                                padding: 16,
                                gap: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ gap: 8 }}>
                                <Text style={{ fontSize: 18 }}>
                                    Experience Points
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: "500",
                                        }}
                                    >
                                        +{data.xp}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            paddingBottom: 1,
                                        }}
                                    >
                                        XP
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: `${COLORS.GREEN}1A`,
                                    height: 60,
                                    width: 60,
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="star-four-points"
                                    size={24}
                                    color={COLORS.GREEN}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
