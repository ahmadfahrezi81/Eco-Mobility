import { SafeAreaView } from "react-native-safe-area-context";
import SubNavHeader from "../../components/top nav/SubNavHeader";
import { COLORS, styles } from "../../styles";
import { Dimensions, Text, View } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { TrackingActivity } from "../../types";
import { getCO2EmissionRate } from "../../helpers/helpers";
import { FirebaseError } from "firebase/app";

const screenWidth = Dimensions.get("window").width;

export default function EmissionChart({ navigation }) {
    const [chartData, setChartData] = useState({
        labels: ["S", "M", "T", "W", "T", "F", "S"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros for each day
            },
        ],
    });

    const [trackingActivities, setTrackingActivities] = useState<
        TrackingActivity[]
    >([]);

    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true; // <--- The flag to track the component's mounted state

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
                                let distance = 0;
                                let emission = 0;

                                const trackingActivities =
                                    querySnapshot.docs.map((doc, i) => {
                                        const data =
                                            doc.data() as TrackingActivity;

                                        distance += data.distance;
                                        emission +=
                                            data.distance *
                                            getCO2EmissionRate(data.vehicle);

                                        return {
                                            ...data,
                                        };
                                    });

                                setTrackingActivities(trackingActivities);
                                setLoading(false);
                            }
                        },
                        handleError
                    );

                    return unsubscribe;
                }
            }

            fetchData().then((unsubscribe) => {
                // Clean up function is run when the component is unmounted.
                // Here, we stop listening to the changes.
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
            // Initialize an array to hold the total distance for each day of the week
            const weeklyEmissions = new Array(7).fill(0);

            // Process the trackingActivities to calculate the total distance for each day
            trackingActivities.forEach((activity) => {
                const dayOfWeek = activity.startTime.toDate().getDay(); // Get the day of the week (0-6)
                weeklyEmissions[dayOfWeek] +=
                    activity.distance * getCO2EmissionRate(activity.vehicle); // Add the distance to the corresponding day
            });

            // Update the chart data with the new weekly distances
            setChartData((prevData) => ({
                ...prevData,
                datasets: [
                    {
                        data: weeklyEmissions,
                    },
                ],
            }));
        }
    }, [trackingActivities]);

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader
                navigation={navigation}
                subNavStyle={{ marginLeft: -10 }}
            />
            {/* Remove the trackingActivities.map as we now display the data in the chart */}
            <BarChart
                data={chartData} // Use the state chartData instead of the hardcoded data
                width={screenWidth - 10}
                height={220} // Adjust the height as needed
                yAxisLabel={""}
                yAxisSuffix={"kg"} // Add a suffix if needed (e.g., "km" for kilometers)
                chartConfig={{
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `${COLORS.GREEN}`,
                    labelColor: (opacity = 1) => `#000`,
                }}
                style={{
                    marginVertical: 8,
                    marginLeft: -30,
                }}
            />
            {/* ... (rest of the component remains unchanged) */}
        </SafeAreaView>
    );
}
