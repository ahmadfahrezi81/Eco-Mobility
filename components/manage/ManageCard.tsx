import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../styles";

import * as ImagePicker from "expo-image-picker";
import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import ProfileBottomSheetModal from "../ui/ProfileBottomSheet";

const ManageCard = ({ navigation, user }) => {
    const avatar = "https://via.placeholder.com/150";
    const randomName = "John Doe";
    const joinedYear = "2020";
    const [selectedImage, setSelectedImage] = useState(null);

    // if (!user) {
    //     return <Text>Loading...</Text>;
    // }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            // console.log(result);
            setSelectedImage(result.assets[0].uri);
        } else {
            alert("You did not select any image.");
        }
    };

    const getInitials = () => {
        const nameParts = user.name.split(" ");
        const firstInitial = nameParts.length > 0 ? nameParts[0].charAt(0) : "";
        const secondInitial =
            nameParts.length > 1 ? nameParts[1].charAt(0) : "";
        return firstInitial + secondInitial;
    };

    const renderProfileImage = () => {
        if (user.profileImgURL) {
            return (
                <Image
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                    source={{ uri: user.profileImgURL }}
                />
            );
        } else {
            return (
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        backgroundColor: COLORS.GREY,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "600",
                            color: COLORS.BLACK,
                        }}
                    >
                        {/* {user.name[0]} */}
                        {getInitials()}
                    </Text>
                </View>
            );
        }
    };

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handlePresentModalPress = () => bottomSheetRef.current.present();

    return (
        <View
            style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                gap: 10,
            }}
        >
            <Pressable
                // onPress={pickImageAsync}
                onPress={handlePresentModalPress}
                style={{ position: "relative", width: 60 }}
            >
                {renderProfileImage()}

                <View
                    style={{
                        backgroundColor: COLORS.GREY,
                        borderRadius: 20,
                        padding: 3,
                        position: "absolute",
                        borderWidth: 3,
                        borderColor: COLORS.WHITE,
                        bottom: -7,
                        right: -7,
                    }}
                >
                    <Ionicons name="camera-outline" size={16} color="black" />
                </View>
            </Pressable>

            <View>
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                    {user.name}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    Joined {user.joinedDate.toDate().toString()}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("ProfileDetail")}
                style={{
                    backgroundColor: COLORS.GREEN,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    alignSelf: "flex-start",
                }}
            >
                <Text style={{ color: COLORS.WHITE }}>Details</Text>
            </TouchableOpacity>

            <ProfileBottomSheetModal ref={bottomSheetRef} />
        </View>
    );
};

export default ManageCard;

const styles = StyleSheet.create({});
