import React from "react";
import { View, Text, StyleSheet, ImageBackground, } from "react-native";



export default function HomeScreen() {
    return (
        <ImageBackground
            source={require("../../assets/images/pataAnimal.jpg")}
            style={styles.background}
            resizeMode="contain"
        >
            <View style={styles.overlay}>
                <View style={styles.ctiContainer}>
                    <Text style={styles.headerText}>
                        <Text style={styles.cti}>CTI</Text>
                        <Text style={styles.control}>Control</Text>
                    </Text>
                </View>
                {/* <DeviceList /> Por ahora se queda asi*/}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,

    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo semitransparente
        padding: 12,
    },
    ctiContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    headerText: {
        fontSize: 36,
        fontWeight: "bold",
    },
    cti: {
        color: "blue",
    },
    control: {
        color: "green",
    },
});
