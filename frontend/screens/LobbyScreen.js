import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat, } from 'react-native-reanimated';

import { io } from "socket.io-client";

const socket = io("http://10.0.0.137:5000"); // Replace with your backend IP if different



const LobbyScreen = ({ route }) => {
    console.log(route.params);
    const { matchCode, matchName, hostName, playerName, hostId, par, players: initialPlayers, createdAt } = route.params;
    const [showButton, setShowButton] = useState(false);
    const [players, setPlayers] = useState(initialPlayers);
    const navigation = useNavigation();

    useEffect(() => {
        // Join the match room via WebSocket
        socket.emit("joinMatch", { matchCode });

        // Listen for lobby updates from the backend
        socket.on("updateLobby", (updatedMatch) => {
            setPlayers(updatedMatch.players); // Update players list dynamically
        });

        if (playerName === hostName){
            setShowButton(true);
        }
    

        return () => {
            // Cleanup socket listener when component unmounts
            socket.off("updateLobby");
        };
    }, []);

    const handlePlayerCancel = async () => {
        try {
            const response = await fetch('http://10.0.0.137:5000/api/delete-player', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ matchCode, playerName }),
            })
            const data = await response.json();
            console.log("JSON Join-response: ", data);
            console.log("Player Joining:", data.playerName);

            if(response.ok){
                navigation.navigate("Home");
            } else {
                console.error("Error Joining Match");
                }
        } catch (error) {
            console.error("Network Error creating match", error);
        }
    };

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
                    <Text style={styles.playerText}>{item.playerName}</Text>
                )}
            />

        {showButton && (
            <Button style={styles.button} title="Start Match" />
        )}
            <Button style={styles.button} title="Cancel" onPress={handlePlayerCancel} />
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
