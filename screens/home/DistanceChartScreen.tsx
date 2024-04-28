import { SafeAreaView } from "react-native-safe-area-context";
import SubNavHeader from "../../components/top nav/SubNavHeader";
import { COLORS, styles } from "../../styles";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { TrackingActivity } from "../../types";
import { getCO2EmissionRate } from "../../helpers/helpers";
import { FirebaseError } from "firebase/app";
import { FIRESTORE_DB } from "../../firebaseConfig";

const screenWidth = Dimensions.get("window").width;

const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
        });
        dates.push(formattedDate);
    }
    return dates;
};

export default function DistanceCart({ navigation }) {
    const [trackingActivities, setTrackingActivities] = useState<
        TrackingActivity[]
    >([]);

    const [chartData, setChartData] = useState({
        labels: getLast7Days(),
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
    });
    const [average, setAverage] = useState<number>(0);
    const [highestThisWeek, setHighestThisWeek] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            async function fetchData() {
                const credentialsStorage = await AsyncStorage.getItem(
                    "credentials"
                );

                if (credentialsStorage) {
                    const { userId } = JSON.parse(credentialsStorage);

                    const collectionRef = collection(
                        FIRESTORE_DB,
                        "trackingActivities",
                        userId,
                        "userTrackingActivities"
                    );

                    const querying = query(
                        collectionRef,
                        orderBy("startTime", "desc")
                    );

                    // Set up Firestore listener
                    const unsubscribe = onSnapshot(
                        querying,
                        (querySnapshot) => {
                            if (isMounted) {
                                const trackingActivities =
                                    querySnapshot.docs.map((doc, i) => {
                                        const data =
                                            doc.data() as TrackingActivity;

                                        return {
                                            ...data,
                                        };
                                    });

                                setTrackingActivities(trackingActivities);

                                //set chartdata
                                //get trackingActivities and then check if it's equal to the date of the label
                                //use the trackingActivities array and tally up the distance

                                setLoading(false);
                            }
                        },
                        handleError
                    );

                    return unsubscribe;
                }
            }

            fetchData().then((unsubscribe) => {
                return () => {
                    isMounted = false;
                    if (unsubscribe) {
                        unsubscribe();
                    }
                };
            });
        }, [])
    );

    function handleError(error: FirebaseError) {
        console.error("Error received in snapshot listener", error);
    }

    useEffect(() => {
        if (trackingActivities.length > 0) {
            const updatedChartData = { ...chartData };

            // Iterate through trackingActivities and update the data in chartData
            trackingActivities.forEach((activity) => {
                const activityDate = new Date(activity.endTime.seconds * 1000);

                const formattedDate = activityDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                });

                const index = updatedChartData.labels.findIndex(
                    (label) => label === formattedDate
                );
                if (index !== -1) {
                    // const distance = Number(activity.distance.toFixed(2));
                    updatedChartData.datasets[0].data[index] +=
                        activity.distance;
                }
            });

            setChartData(updatedChartData);

            const updatedData = chartData.datasets[0].data.map((num) => {
                if (num % 1 !== 0) {
                    return Number(num.toFixed(2));
                } else {
                    return num;
                }
            });

            setChartData((prevState) => ({
                ...prevState,
                datasets: [{ data: updatedData }],
            }));
        }
    }, [trackingActivities]);

    useEffect(() => {
        const data = chartData.datasets[0].data;
        const highestValue = Math.max(...data);
        setHighestThisWeek(highestValue);

        const sum = data.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / data.length;
        setAverage(avg);
    }, [chartData]);

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader navigation={navigation} title={"Distance Tracked"} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 4,
                        marginTop: 14,
                    }}
                >
                    <Text style={{ fontSize: 36, fontWeight: "600" }}>
                        {average.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 16 }}>km per day (avg)</Text>
                </View>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>
                    Your longest distance {highestThisWeek.toFixed(2)}
                    km (this week )
                </Text>

                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220} // Adjust the height as needed
                    yAxisSuffix={"km"}
                    yAxisLabel=""
                    showValuesOnTopOfBars={true}
                    flatColor={true}
                    chartConfig={{
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientToOpacity: 0,
                        decimalPlaces: 1,
                        barPercentage: 0.7,
                        height: 5000,
                        color: (opacity = 1) => `${COLORS.GREEN}`,
                        fillShadowGradientOpacity: 1,
                        labelColor: (opacity = 1) => `#000`,
                        propsForBackgroundLines: {
                            strokeWidth: 1,
                            stroke: "#e3e3e3",
                            strokeDasharray: "0",
                        },
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                    }}
                    style={{
                        marginVertical: 24,
                        marginLeft: -20,
                        paddingHorizontal: 10,
                    }}
                />
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "700",
                        marginBottom: 12,
                    }}
                >
                    This week
                </Text>
                <View style={{ marginBottom: 20 }}>
                    {chartData.labels
                        .slice()
                        .reverse()
                        .map((label, index) => (
                            <View
                                key={index}
                                style={{
                                    borderRadius: 10,
                                    backgroundColor: COLORS.WHITE,
                                    padding: 18,
                                    flexDirection: "row",
                                    marginBottom: 5,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontSize: 18 }}>
                                    {index === 0
                                        ? "Today"
                                        : index === 1
                                        ? "Yesterday"
                                        : label}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        gap: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {chartData.datasets[0].data[
                                            chartData.labels.length - index - 1
                                        ].toFixed(2)}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>KM</Text>
                                </View>
                            </View>
                        ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
