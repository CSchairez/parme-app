import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue } from 'react-native-reanimated';


const LobbyScreen = ({ route }) => {
    console.log(route.params);
    const { matchCode, matchName, hostName, hostId, par, players, createdAt } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Match Code: {matchCode}</Text>
            <Text>Match Name: {matchName}</Text>
            <Text>Host Name: {hostName}</Text>
            <Text>Host ID: {hostId}</Text>
            <Text>Par: {par}</Text>
            <Text>Created at: {createdAt}</Text>

            <Text style={styles.subtitle}>Players:</Text>
            <FlatList 
                data={players}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.playerText}>
                        {item.playerName}
                    </Text>
                )}
            />

            <Button style={styles.button} title="Start Match" />
            <Button style={styles.button} title="Cancel" />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00CC66",
        alignItems: "center",
        justifyContent: "center",
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    subtitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginTop: 10 
    },
    button: {
        backgroundColor: "#009900",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: 200,
        alignItems: "center",
        
    },
});

export default LobbyScreen;
