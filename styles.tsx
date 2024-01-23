import { StyleSheet } from "react-native";

export const COLORS = {
    WHITE: "#FFF",
    OFFWHITE: "#F6F7F9",
    // GREEN: "#058C42",
    GREEN: "#074F57",
    // GREEN: "#075723",
    GREY: "#D9D9D9",
    DARKGREY: "#C0C0C0",
    BLACK: "#040404",
    // BLACK: "#001524",
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 0,
        // backgroundColor: "#F2F2F2",
        backgroundColor: COLORS.OFFWHITE,
        // paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        marginBottom: 30,
        marginTop: 40,
        color: COLORS.GREEN,
    },
    subtitle: {
        fontSize: 28,
        fontWeight: "900",
        // marginBottom: 30,
        // marginTop: 40,
    },
});
