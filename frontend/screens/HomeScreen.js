import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const HomeScreen = () => {

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 800 });
        translateY.value = withTiming(0, { duration: 800 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [modalJoinVisible, setModalJoinVisible] = useState(false);
    const [matchName, setMatchName] = useState('');
    const [hostName, setHostName] = useState('');
    const [par, setPar] = useState(3);
    const [course, setCourse] = useState('');
    const navigation = useNavigation();

    const [playerName, setPlayerName] = useState('');
    const [matchCode, setMatchCode] = useState('');

    const handleCreateMatch = async () => {
        if (!matchName || !hostName || !par) {
            return;
        }

        try {
            const response = await fetch('http://10.0.0.137:5000/api/create-match', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ hostName, matchName, course, par }),
            });
            const data = await response.json();
            console.log("JSON Create-response: ", data);

            if (response.ok) {
                setModalCreateVisible(false);
                navigation.navigate("Lobby", { 
                    matchCode: data.matchCode, 
                    matchName: data.matchName, 
                    hostName: data.hostName,
                    hostId: data.hostId,
                    course: data.course, 
                    par: data.par, 
                    players: data.players,
                    createdAt: data.createdAt,
                    matchState: data.matchState
                });
            } else{
                console.error("Error creating match", data);
            }
        } catch (error) {
            console.error("Network Error creating match", error);
        }
    };

    const handleJoinMatch = async () => {

        if (!matchCode || !playerName) {
            return;
        }

        try {
            const response = await fetch('http://10.0.0.137:5000/api/join-match', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ matchCode, playerName }),
            })
            const data = await response.json();
            console.log("JSON Join-response: ", data);

            if(response.ok){
                setModalJoinVisible(false);
                navigation.navigate("Lobby", { 
                    matchCode: data.matchCode, 
                    matchName: data.matchName, 
                    hostName: data.hostName, 
                    hostId: data.hostId,
                    course: data.course, 
                    par: data.par, 
                    players: data.players,
                    createdAt: data.createdAt,
                    matchState: data.matchState
                });
            } else {
                console.error("Error Joining Match");
                }
            } catch (error) {
                console.error("Network Error creating match", error);
            }
   };


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.title, animatedStyle]}>
                <Text style={styles.title}>Par Me</Text>
                <TouchableOpacity style={styles.button} onPress={() => setModalCreateVisible(true)}>
                    <Text style={styles.buttonText}>Create Match</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalJoinVisible(true)}>
                    <Text style={styles.buttonText}>Join Match</Text>
                </TouchableOpacity>
            </Animated.View>

            <View style={styles.container}>
                <Modal visible={modalCreateVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Match Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Match Name"
                                value={matchName}
                                onChangeText={setMatchName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Your Name"
                                value={hostName}
                                onChangeText={setHostName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Course"
                                value={course}
                                onChangeText={setCourse}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Course Par"
                                value={par}
                                onChangeText={setPar}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleCreateMatch}>
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => setModalCreateVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>

            <View style={styles.container}>
                <Modal visible={modalJoinVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Match Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your Name"
                                value={playerName}
                                onChangeText={setPlayerName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Match Code"
                                value={matchCode}
                                onChangeText={setMatchCode}
                            />

                            <TouchableOpacity style={styles.button} onPress={handleJoinMatch}>
                                <Text style={styles.buttonText}>Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => setModalJoinVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00744C",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 45,
        fontFamily: "Arial",
        fontWeight: "bold",
        marginTop: '25%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#009900",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: 200,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFD700",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#00744C",
        borderWidth: 5,
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    cancelButton: {
        backgroundColor: "#dc3545",
    }
});

export default HomeScreen;