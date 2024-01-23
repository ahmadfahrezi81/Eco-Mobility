import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../styles";

const ManageCard = ({ navigation, user }) => {
    const avatar = "https://via.placeholder.com/150";
    const randomName = "John Doe";
    const joinedYear = "2020";

    // if (!user) {
    //     return <Text>Loading...</Text>;
    // }

    return (
        <View
            style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                gap: 10,
            }}
        >
            <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: avatar }}
            />
            <View>
                <Text style={{ fontSize: 20 }}>{user.name}</Text>
                <Text style={{ fontSize: 12, fontWeight: "300" }}>
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
                <Text style={{ color: "white" }}>Details</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ManageCard;

const styles = StyleSheet.create({});
