import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
    StyleSheet,
    Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Feather } from "@expo/vector-icons";
import SubNavHeader from "../../components/top nav/SubNavHeader";
import { COLORS, styles } from "../../styles";
import { getAllFromAsyncStorage } from "../../helpers/getAllFromAsyncStorage";

const Logo = require("../../assets/logo-leaf.png");
const Sphere = require("../../assets/sphere.png");

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

    const viewShotRef = useRef();

    // const [imageUri, setImageUri] = useState(
    //     "https://images.unsplash.com/photo-1715966966827-25a227141ee9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // );

    const shareImage = async () => {
        try {
            const imageUri = await captureRef(viewShotRef, {
                format: "jpg",
                quality: 1,
            });

            console.log(imageUri);

            // Create file URI for sharing
            const fileUri = FileSystem.documentDirectory + "image.jpg";

            // Move the captured image to the file URI
            await FileSystem.moveAsync({
                from: imageUri,
                to: fileUri,
            });

            // Share the image using expo-sharing
            await Sharing.shareAsync(fileUri);

            // const downloadResumable = FileSystem.createDownloadResumable(
            //     imageUri,
            //     FileSystem.documentDirectory + "image.jpg"
            // );

            // const { uri } = await downloadResumable.downloadAsync();

            // if (!(await Sharing.isAvailableAsync())) {
            //     alert(`Uh oh, sharing isn't available on your platform`);
            //     return;
            // }

            // await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Error sharing image", error);
        }
    };

    const Certificate = () => {
        return (
            <ViewShot
                ref={viewShotRef}
                style={[
                    {
                        height: CARD_HEIGHT,
                        width: CARD_WIDTH,
                        backgroundColor: COLORS.GREEN,
                        position: "absolute",
                        borderRadius: 15,
                        zIndex: 300,
                        padding: 25,
                        gap: 50,
                        alignItems: "center",
                    },
                ]}
            >
                <Image
                    source={Sphere}
                    style={{
                        width: 230,
                        height: 230,
                        marginTop: 10,
                        resizeMode: "contain",
                    }}
                />

                <View
                    style={{
                        position: "absolute",
                        left: 20,
                        bottom: 100,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.OFFWHITE,
                            fontSize: 22,
                            fontWeight: "800",
                            fontStyle: "italic",
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: COLORS.OFFWHITE,
                            fontSize: 16,
                            fontWeight: "500",
                            fontStyle: "italic",
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
                        {new Date(joinedDate * 1000).toLocaleDateString()}
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
            </ViewShot>
        );
    };

    // const onShare = async () => {
    //     try {
    //         const result = await Share.share({
    //             message: "Check out this awesome link https://www.google.com",
    //         });

    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 console.log(
    //                     "Shared with activity type:",
    //                     result.activityType
    //                 );
    //             } else {
    //                 console.log("Shared successfully");
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             console.log("Share dismissed");
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };

    // const onShare = async () => {
    //     try {
    //         if (viewShotRef.current) {
    //             const uri = await captureRef(viewShotRef.current, {
    //                 format: "jpg",
    //                 quality: 1,
    //             });

    //             const fileUri =
    //                 FileSystem.documentDirectory + "certificate.jpg";
    //             await FileSystem.writeAsStringAsync(fileUri, uri, {
    //                 encoding: FileSystem.EncodingType.Base64,
    //             });

    //             if (await Sharing.isAvailableAsync()) {
    //                 await Sharing.shareAsync(fileUri);
    //             } else {
    //                 Alert.alert("Sharing is not available on your platform");
    //             }
    //         } else {
    //             Alert.alert("No certificate to share.");
    //         }
    //     } catch (error) {
    //         Alert.alert(error.message);
    //     }
    // };

    return (
        // <View style={styles.container}>
        //     <Image source={{ uri: imageUri }} style={styles.image} />
        //     <Button title="Share Image" onPress={shareImage} />
        // </View>
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader navigation={navigation} title={"Certificate"} />
            <View style={{ display: "flex", gap: 20 }}>
                <Certificate />
                <TouchableOpacity
                    onPress={shareImage}
                    style={{
                        marginTop: 500,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 20,
                            borderRadius: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                            Share
                        </Text>

                        <Feather name={"share"} size={20} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     image: {
//         width: 300,
//         height: 300,
//         marginBottom: 20,
//     },
// });
