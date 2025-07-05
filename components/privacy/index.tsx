import { View, Text, ScrollView, Pressable } from "react-native"
import { styles } from "./index.styles"
import { globalStyles } from "@/shared/globalStyles"
import { useRouter } from "expo-router"

export default function PrivatePolicy() {
    const router = useRouter()

    const ListItem = ({ children }: { children: React.ReactNode }) => (
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={{ marginRight: 8, fontSize: 16, color: '#9F9F9F' }}>{'\u2022'}</Text>
            <Text style={styles.listItem}>{children}</Text>
        </View>
    )

    return (
        <View style={globalStyles.background}>
            <ScrollView
                style={{ width: '100%', paddingLeft: '10%' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ height: '10%' }}/>

                <View style={{ maxWidth: 500 }}>
                    <Pressable onPress={() => router.push('/')} >
                        <Text style={{ ...styles.subtitle, textDecorationLine: 'underline', marginBottom: 20, color: '#B4B4B4' }}>Back</Text>
                    </Pressable>

                    <Text style={styles.title}>SelfSci App Privacy Policy</Text>
                    <Text style={styles.text}>SelfSci is a decentralized science (DeSci) platform that empowers individuals to conduct rigorous self-experimentation using their own health data. Our application integrates diverse biometric data sources—including fitness tracker wearable devices (potentially from Garmin), Motiv EPIC X EEG sensors, and comprehensive dietary tracking—to provide users with unprecedented insights into their personal health patterns. SelfSci enables users to perform controlled experiments on themselves, analyze correlations in their biometric data, and optimize their health through data-driven self-discovery.</Text>

                    <Text style={styles.title}>Garmin Health Data Collection and Usage</Text>
                    <Text style={styles.text}>This section specifically addresses our collection, use, and handling of health and fitness data obtained through Garmin's platform and API services.</Text>
                    
                    <Text style={styles.subtitle}>Data We Collect from Garmin</Text>
                    <Text style={styles.text}>With your explicit consent, we collect the following health and biometric data from your Garmin account:</Text>
                    <ListItem>Heart rate variability (HRV) measurements</ListItem>
                    <ListItem>Sleep quality metrics and sleep stages</ListItem>
                    <ListItem>Activity and exercise data (steps, calories, workout sessions)</ListItem>
                    <ListItem>Stress level measurements</ListItem>
                    <ListItem>Body battery energy monitoring data</ListItem>
                    <ListItem>Recovery and training readiness metrics</ListItem>
                    <ListItem>Environmental and contextual data (time, date, location if enabled)</ListItem>

                    <Text style={styles.subtitle}>Purpose and Use of Garmin Data</Text>
                    <Text style={styles.text}>We use your Garmin health data exclusively for the following research and application purposes:</Text>
                    <ListItem>Personal Self-Experimentation: Your data enables you to conduct controlled experiments on yourself to understand how different variables affect your health and performance</ListItem>
                    <ListItem>Multi-Modal Health Analysis: Combining Garmin data with other biometric signals (EEG from Motiv EPIC X devices, dietary tracking) to provide comprehensive personal health insights</ListItem>
                    <ListItem>Personalized Health Recommendations: Generating data-driven suggestions for sleep, recovery, and performance optimization based on your individual patterns</ListItem>
                    <ListItem>Longitudinal Health Tracking: Monitoring trends and correlations in your health metrics over time to identify patterns and potential personal health optimization opportunities</ListItem>

                    <Text style={styles.subtitle}>Data Processing and Analysis</Text>
                    <Text style={styles.text}>Your Garmin health data is processed using advanced analytics and machine learning algorithms to:</Text>
                    <ListItem>Identify correlations between different health metrics</ListItem>
                    <ListItem>Generate predictive insights about your health and performance</ListItem>
                    <ListItem>Provide personalized recommendations based on your unique biometric profile</ListItem>
                    <ListItem>Support your participation in self-directed health research</ListItem>

                    <Text style={styles.subtitle}>Data Sharing and Third-Party Access</Text>
                    <Text style={styles.text}>Your Garmin health data:</Text>
                    <ListItem>Will never be sold to third parties</ListItem>
                    <ListItem>May be aggregated and anonymized for research purposes</ListItem>
                    <ListItem>Will only be shared with your explicit consent for specific research collaborations</ListItem>
                    <ListItem>Remains under your control with options to export or delete upon request</ListItem>

                    <Text style={styles.subtitle}>Security of Garmin Data</Text>
                    <Text style={styles.text}>We implement enhanced security measures specifically for health data:</Text>
                    <ListItem>End-to-end encryption during data transmission and storage</ListItem>
                    <ListItem>Restricted access controls with audit logging</ListItem>
                    <ListItem>SOC 2 Type 2 compliance with annual audits for security, availability, processing integrity, confidentiality, and privacy</ListItem>
                    <ListItem>AES-256 encryption at rest and TLS encryption in transit</ListItem>
                    <ListItem>Regular penetration testing by industry experts</ListItem>
                    <ListItem>Row-Level Security (RLS) with PostgreSQL-native access controls for granular data protection</ListItem>
                    <ListItem>Cloudflare CDN protection and fail2ban implementation for DDoS mitigation</ListItem>
                    <ListItem>Weekly security advisories with automated monitoring and one-click issue resolution</ListItem>

                    <Text style={styles.subtitle}>Your Rights Regarding Garmin Data</Text>
                    <Text style={styles.text}>You have the right to: </Text>
                    <ListItem>Revoke consent for Garmin data collection at any time</ListItem>
                    <ListItem>Request deletion of your Garmin data </ListItem>
                    <ListItem>Receive detailed reports on how your Garmin data is being used </ListItem>
                    <ListItem>Opt out of specific research initiatives while maintaining other services </ListItem>


                </View>
                
                <View style={{ height: '10%' }}/>
            </ScrollView>
        </View>
    )
}