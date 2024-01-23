import { StyleSheet } from "react-native";

export const COLORS = {
    WHITE: "#FFF",
    OFFWHITE: "#F6F7F9",
    GREEN: "#058C42",
    GREY: "#D9D9D9",
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 0,
        // backgroundColor: "#F2F2F2",
        backgroundColor: "#F6F7F9",
        // paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        marginBottom: 30,
        marginTop: 40,
    },
    subtitle: {
        fontSize: 28,
        fontWeight: "900",
        // marginBottom: 30,
        // marginTop: 40,
    },
});
