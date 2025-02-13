import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Button, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat, } from 'react-native-reanimated';

import { io } from "socket.io-client";
import { navigate } from '../utils/NavigationService';

const socket = io("http://10.0.0.137:5000"); // Replace with your backend IP if different

const { width } = Dimensions.get('window'); // Get screen width

const LobbyScreen = ({ route }) => {

    const offset = useSharedValue(width / 2);
    console.log(route.params);
    const { matchCode, matchName, hostName, playerName, hostId, par, players: initialPlayers, createdAt } = route.params;
    const [showButton, setShowButton] = useState(false);
    const [players, setPlayers] = useState(initialPlayers);
    const navigation = useNavigation();

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
      }));

    useEffect(() => {
        offset.value = withRepeat(
            withTiming(-offset.value, { duration: 1050 }),
            -1,
            true
          );
        const unsubscribe = navigation.addListener('state', () => {
            socket.on("navigateToScorecard", ({ matchCode }) => {
            navigate("ScoreCard", { matchCode });
            });
        });
        if (playerName === hostName){
            setShowButton(true);
        }
        // Join the match room via WebSocket
        socket.emit("joinMatch", { matchCode });

        // Listen for lobby updates from the backend
        socket.on("updateLobby", (updatedMatch) => {
            setPlayers(updatedMatch.players); // Update players list dynamically
        });

        // Handle match cancelled event
        socket.on("matchCancelled", () => {
            alert(`Host ${hostName} has cancelled the match.`);
            navigation.navigate("Home");
        });


        return () => {
            // Cleanup socket listener when component unmounts
            socket.off("updateLobby");
            socket.off("matchCancelled");
            unsubscribe();
            socket.off("navigateToScorecard");
        };
    }, [navigation]);

    const handleStartMatch = () => {
        socket.emit("startMatch", { matchCode });
    };

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
            {/* Animated Background Effect */}
      <Animated.View style={[styles.box, animatedStyles]} />

        {showButton && (
            <Button style={styles.button} title="Start Match" onPress={handleStartMatch}/>
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
    box: {
        height: 60,
        width: 60,
        backgroundColor: '#b58df1',
        borderRadius: 20,
        position: 'absolute', // Ensure it doesn't interfere with other UI elements
        top: '60%', // Adjust placement as needed
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
