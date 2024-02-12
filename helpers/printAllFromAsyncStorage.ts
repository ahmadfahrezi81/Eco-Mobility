import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAllFromStorage = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);

        result.forEach((item) => {
            console.log("Key is: ", item[0]);
            console.log("Value is: ", item[1]);
        });
    } catch (error) {
        console.error(error);
    }
};
