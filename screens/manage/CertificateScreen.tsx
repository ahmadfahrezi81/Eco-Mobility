import React, { useEffect, useState } from "react";
import { View, Text, Button, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubNavHeader from "../../components/top nav/SubNavHeader";
import { COLORS, styles } from "../../styles";

// import LogoLeaf from "../../assets/LogoLeaf.png";
const Logo = require("../../assets/logo-leaf.png");
const Sphere = require("../../assets/sphere.png");

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllFromAsyncStorage } from "../../helpers/getAllFromAsyncStorage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEIGHT = 480;
const WIDTH = SCREEN_WIDTH * 0.9;

const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

export default function Certificate({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [joinedDate, setJoinedDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userStorage = await AsyncStorage.getItem("user");

            if (userStorage) {
                const user = JSON.parse(userStorage);

                setUserData(user);
                setName(user.name);
                setEmail(user.email);
                setJoinedDate(user.joinedDate.seconds);

                getAllFromAsyncStorage();
            }
        };

        fetchData();
    }, []);

    //animation

    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onBegin((event) => {
            rotateX.value = withTiming(
                interpolate(
                    event.y,
                    [0, CARD_HEIGHT],
                    [2, -2],
                    Extrapolate.CLAMP
                )
            );
            rotateY.value = withTiming(
                interpolate(
                    event.x,
                    [0, CARD_WIDTH],
                    [-2, 2],
                    Extrapolate.CLAMP
                )
            );
        })
        .onUpdate((event) => {
            // topLeft (10deg, -10deg)
            // topRight (10deg, 10deg)
            // bottomRight (-10deg, 10deg)
            // bottomLeft (-10deg, -10deg)

            rotateX.value = interpolate(
                event.y,
                [0, CARD_HEIGHT],
                [2, -2],
                Extrapolate.CLAMP
            );
            rotateY.value = interpolate(
                event.x,
                [0, CARD_WIDTH],
                [-2, 2],
                Extrapolate.CLAMP
            );
        })
        .onFinalize(() => {
            rotateX.value = withTiming(0);
            rotateY.value = withTiming(0);
        });

    const rStyle = useAnimatedStyle(() => {
        const rotateXvalue = `${rotateX.value}deg`;
        const rotateYvalue = `${rotateY.value}deg`;

        return {
            transform: [
                {
                    perspective: 300,
                },
                { rotateX: rotateXvalue },
                { rotateY: rotateYvalue },
            ],
        };
    }, []);
    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader
                navigation={navigation}
                subNavStyle={{ marginLeft: -10 }}
            />

            <View style={{ gap: 10 }}>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            {
                                height: CARD_HEIGHT,
                                width: CARD_WIDTH,
                                // backgroundColor: "black",
                                backgroundColor: COLORS.GREEN,
                                position: "absolute",
                                borderRadius: 15,
                                zIndex: 300,
                                padding: 25,
                                gap: 50,
                                alignItems: "center",
                            },
                            rStyle,
                        ]}
                    >
                        <Image
                            source={Sphere}
                            style={{
                                width: 200,
                                height: 200,
                                marginTop: 10,
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                left: 20,
                                bottom: 130,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontSize: 28,
                                    fontWeight: "700",
                                }}
                            >
                                {name}
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Early Adopter
                            </Text>
                        </View>

                        <View
                            style={{
                                borderWidth: 1.5,
                                padding: 5,
                                paddingHorizontal: 10,
                                borderColor: COLORS.OFFWHITE,
                                alignSelf: "flex-start",
                                borderRadius: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                position: "absolute",
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontWeight: "600",
                                    fontSize: 13,
                                }}
                            >
                                UM-Eco Mobility
                            </Text>
                            <View
                                style={{
                                    backgroundColor: COLORS.OFFWHITE,
                                    borderRadius: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.OFFWHITE,
                                        fontSize: 6,
                                    }}
                                >
                                    |
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: COLORS.OFFWHITE,
                                    fontSize: 13,
                                    fontWeight: "600",
                                }}
                            >
                                {new Date(
                                    joinedDate * 1000
                                ).toLocaleDateString()}
                            </Text>
                        </View>

                        <Image
                            source={Logo}
                            style={{
                                width: 30,
                                height: 30,
                                position: "absolute",
                                bottom: 20,
                                right: 20,
                            }}
                        />

                        <View
                            style={{
                                position: "absolute",
                                bottom: "10%",
                                left: "10%",
                                flexDirection: "row",
                            }}
                        ></View>
                    </Animated.View>
                </GestureDetector>
            </View>

            {/* {userData && (
                   <View style={{ gap: 10 }}>
                       <InputWithLabel
                           text={"Name"}
                           value={name}
                           onChangeText={(text) => setName(text)}
                           disabled={loading}
                       />

                       <InputWithLabel
                           disabled={true}
                           text={"Email"}
                           value={email}
                           onChangeText={(text) => setEmail(text)}
                       />

                       <LoadButton
                           onPress={updateProfile}
                           loading={loading}
                           text="Update Profile"
                       />
                   </View>
               )} */}
        </SafeAreaView>
    );
}
