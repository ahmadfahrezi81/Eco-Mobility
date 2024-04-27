import { Text, View } from "react-native";
// import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

import { COLORS, styles } from "../../styles";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export type Ref = BottomSheetModal;

import * as ImagePicker from "expo-image-picker";
import {
    getDownloadURL,
    uploadBytes,
    ref as firebaseRef,
} from "firebase/storage";
import { FIREBASE_STORAGE, FIRESTORE_DB } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileBottomSheetModal = forwardRef<Ref>((props, ref) => {
    const snapPoints = useMemo(() => ["30%"], []);
    const [userData, setUserData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userStorage = await AsyncStorage.getItem("user");

            if (userStorage) {
                const user = JSON.parse(userStorage);

                setUserData(user);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        uploadImage();
    }, [selectedImage]);

    const takePhotoAsync = async () => {
        setSelectedImage(null);
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            alert("Image uploaded successfully!");
        }
    };

    const pickImageAsync = async () => {
        setSelectedImage(null);

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);

            //this alert is for the user. Give a sense of instant illusion.
            //image is not yet uploaded
            alert("Image uploaded successfully!");
        } else {
            // no need to say: below for dev only
            // alert("You did not select any image.");
            // ref.current?.close();
        }
    };

    const uploadImage = async () => {
        try {
            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();

                let imageRef = firebaseRef(
                    FIREBASE_STORAGE,
                    `profile-pictures/${uuid()}`
                );

                await uploadBytes(imageRef, blob);

                const downloadURL = await getDownloadURL(imageRef);

                const userRef = await doc(
                    FIRESTORE_DB,
                    `users/${userData.uid}`
                );

                await updateDoc(userRef, {
                    profileImgURL: downloadURL,
                    lastUpdate: new Date(),
                });

                const leaderboardRef = await doc(
                    FIRESTORE_DB,
                    `leaderboard/${userData.uid}`
                );

                await updateDoc(leaderboardRef, {
                    profileImgURL: downloadURL,
                });

                console.log("[UPLOAD SUCCESFUL]", downloadURL);

                //@ts-ignore
                ref.current?.close();
            }
        } catch (error) {
            console.error("Error uploading image:", error.message);
            alert("Error uploading image. Please try again.");
        }
    };

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
        >
            <View
                style={{
                    flex: 1,
                    margin: 20,
                    gap: 10,
                }}
            >
                <Text style={styles.subtitle}>Add profile photo</Text>

                <View style={{ gap: 5 }}>
                    {/* Take a photo */}
                    <TouchableOpacity onPress={takePhotoAsync}>
                        <View
                            style={{
                                paddingVertical: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 15,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: COLORS.OFFWHITE,
                                        borderRadius: 40,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 12,
                                    }}
                                >
                                    <Feather
                                        name="camera"
                                        size={22}
                                        color={COLORS.BLACK}
                                    />
                                </View>

                                <Text
                                    style={{ fontSize: 18, fontWeight: "500" }}
                                >
                                    Take a photo
                                </Text>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={22}
                                color={COLORS.BLACK}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Select a photo */}
                    <TouchableOpacity onPress={pickImageAsync}>
                        <View
                            style={{
                                paddingVertical: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 15,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: COLORS.OFFWHITE,
                                        borderRadius: 40,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 12,
                                    }}
                                >
                                    <Feather
                                        name="image"
                                        size={22}
                                        color={COLORS.BLACK}
                                    />
                                </View>

                                <Text
                                    style={{ fontSize: 18, fontWeight: "500" }}
                                >
                                    Choose from library
                                </Text>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={22}
                                color={COLORS.BLACK}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
});

export default ProfileBottomSheetModal;
