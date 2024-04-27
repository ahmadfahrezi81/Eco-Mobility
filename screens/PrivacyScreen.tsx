import React from "react";
import { View, Text, Button, ScrollView, Linking } from "react-native";
import { styles } from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import SubNavHeader from "../components/top nav/SubNavHeader";

export default function Privacy({ navigation }) {
    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={styles.container}>
            <SubNavHeader navigation={navigation} title={"Privacy Policy"} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ marginTop: 5 }}>
                    This privacy policy applies to the UM Eco•Mobility app
                    (hereby referred to as "Application") for mobile devices
                    that was created by Ahmad Fahrezi (hereby referred to as
                    "Service Provider") as a Free service. This service is
                    intended for use "AS IS".
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Information Collection and Use
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Application collects information when you download and
                    use it. This information may include information such as:
                </Text>

                <Text style={{ marginLeft: 10 }}>
                    • Your device's Internet Protocol address (e.g. IP address)
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • The pages of the Application that you visit, the time and
                    date of your visit, the time spent on those pages
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • The time spent on the Application
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • The operating system you use on your mobile device
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Application does not gather precise information about
                    the location of your mobile device.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Application collects your device's location, which helps
                    the Service Provider determine your approximate geographical
                    location and make use of in below ways:
                </Text>

                <Text style={{ marginLeft: 10 }}>
                    • Geolocation Services: The Service Provider utilizes
                    location data to provide features such as personalized
                    content, relevant recommendations, and location•based
                    services.
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • Analytics and Improvements: Aggregated and anonymized
                    location data helps the Service Provider to analyze user
                    behavior, identify trends, and improve the overall
                    performance and functionality of the Application.
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • Third•Party Services: Periodically, the Service Provider
                    may transmit anonymized location data to external services.
                    These services assist them in enhancing the Application and
                    optimizing their offerings.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Service Provider may use the information you provided to
                    contact you from time to time to provide you with important
                    information, required notices and marketing promotions.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    For a better experience, while using the Application, the
                    Service Provider may require you to provide us with certain
                    personally identifiable information, including but not
                    limited to ahmadfahrezi8127@gmail.com. The information that
                    the Service Provider request will be retained by them and
                    used as described in this privacy policy.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Third Party Access
                </Text>

                <Text style={{ marginTop: 5 }}>
                    Only aggregated, anonymized data is periodically transmitted
                    to external services to aid the Service Provider in
                    improving the Application and their service. The Service
                    Provider may share your information with third parties in
                    the ways that are described in this privacy statement.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    Please note that the Application utilizes third-party
                    services that have their own Privacy Policy about handling
                    data. Below are the links to the Privacy Policy of the
                    third-party service providers used by the Application:
                </Text>

                <Text
                    style={{ color: "blue" }}
                    onPress={() =>
                        handleLinkPress(
                            "https://www.google.com/policies/privacy/"
                        )
                    }
                >
                    Google Play Services
                </Text>
                <Text
                    style={{ color: "blue" }}
                    onPress={() =>
                        handleLinkPress(
                            "https://firebase.google.com/support/privacy"
                        )
                    }
                >
                    Google Analytics for Firebase
                </Text>
                <Text
                    style={{ color: "blue" }}
                    onPress={() =>
                        handleLinkPress(
                            "https://firebase.google.com/support/privacy/"
                        )
                    }
                >
                    Firebase Crashlytics
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Service Provider may disclose User Provided and
                    Automatically Collected Information:
                </Text>

                <Text style={{ marginLeft: 10 }}>
                    • as required by law, such as to comply with a subpoena, or
                    similar legal process;
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • when they believe in good faith that disclosure is
                    necessary to protect their rights, protect your safety or
                    the safety of others, investigate fraud, or respond to a
                    government request;
                </Text>
                <Text style={{ marginLeft: 10 }}>
                    • with their trusted services providers who work on their
                    behalf, do not have an independent use of the information we
                    disclose to them, and have agreed to adhere to the rules set
                    forth in this privacy statement.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Opt-Out Rights
                </Text>

                <Text style={{ marginTop: 5 }}>
                    You can stop all collection of information by the
                    Application easily by uninstalling it. You may use the
                    standard uninstall processes as may be available as part of
                    your mobile device or via the mobile application marketplace
                    or network.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Data Retention Policy
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Service Provider will retain User Provided data for as
                    long as you use the Application and for a reasonable time
                    thereafter. If you'd like them to delete User Provided Data
                    that you have provided via the Application, please contact
                    them at ahmadfahrezi8127@gmail.com and they will respond in
                    a reasonable time.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Children
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Service Provider does not use the Application to
                    knowingly solicit data from or market to children under the
                    age of 13.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Application does not address anyone under the age of 13.
                    The Service Provider does not knowingly collect personally
                    identifiable information from children under 13 years of
                    age. In the case the Service Provider discover that a child
                    under 13 has provided personal information, the Service
                    Provider will immediately delete this from their servers. If
                    you are a parent or guardian and you are aware that your
                    child has provided us with personal information, please
                    contact the Service Provider (ahmadfahrezi8127@gmail.com) so
                    that they will be able to take the necessary actions.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Security
                </Text>

                <Text style={{ marginTop: 5 }}>
                    The Service Provider is concerned about safeguarding the
                    confidentiality of your information. The Service Provider
                    provides physical, electronic, and procedural safeguards to
                    protect information the Service Provider processes and
                    maintains.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Changes
                </Text>

                <Text style={{ marginTop: 5 }}>
                    This Privacy Policy may be updated from time to time for any
                    reason. The Service Provider will notify you of any changes
                    to the Privacy Policy by updating this page with the new
                    Privacy Policy. You are advised to consult this Privacy
                    Policy regularly for any changes, as continued use is deemed
                    approval of all changes.
                </Text>

                <Text style={{ marginTop: 5 }}>
                    This privacy policy is effective as of 2024•04•27.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Your Consent
                </Text>

                <Text style={{ marginTop: 5 }}>
                    By using the Application, you are consenting to the
                    processing of your information as set forth in this Privacy
                    Policy now and as amended by us.
                </Text>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 20,
                    }}
                >
                    Contact Us
                </Text>

                <Text style={{ marginTop: 5, marginBottom: 100 }}>
                    If you have any questions regarding privacy while using the
                    Application, or have questions about the practices, please
                    contact the Service Provider via email at
                    ahmadfahrezi8127@gmail.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
