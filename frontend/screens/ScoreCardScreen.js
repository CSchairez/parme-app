import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Dimensions, ScrollView } from "react-native";
import scorecardData from '../assets/scorecards.json';


const screenWidth = Dimensions.get("window").width;

const ScorecardScreen = ({route}) => {
    const { matchCode } = route.params;
    console.log(`Match Code: ${matchCode}`);
    const [courseName, setCourseName] = useState("");
    const [scorecard, setScorecard] = useState([]);
    const [scores, setScores] = useState(Array(18).fill("")); // Empty scores

  // Load JSON data from assets
    useEffect(() => {
    const loadScorecard = async () => {
        try {
        data = scorecardData;
        setCourseName(data.course_name);
        setScorecard(data.scorecard);
        } catch (error) {
        console.error("Error loading scorecards.json", error);
        }
    };
    loadScorecard();
    }, []);

  // Handle score input
    const handleScoreChange = (text, index) => {
        const newScores = [...scores];
        newScores[index] = text;
        setScores(newScores);
    };

  // Split scorecard into front 9 and back 9
    const front9 = scorecard.slice(0, 9);
    const back9 = scorecard.slice(9, 18);

    const renderTableRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.hole}</Text>
            <Text style={styles.cell}>{item.par}</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Score" />
        </View>
    );

    return (
        <ScrollView>
        <View style={styles.scrollContainer}>
            <Text style={styles.courseTitle}>{courseName}</Text>

            {/* Front 9 */}
            <Text style={styles.sectionTitle}>Front 9</Text>
            <View style={styles.table}>
                <View style={styles.rowHeader}>
                    <Text style={styles.headerCell}>Hole</Text>
                    <Text style={styles.headerCell}>Par</Text>
                    <Text style={styles.headerCell}>Score</Text>
                </View>
                <FlatList 
                    data={scorecard.slice(0, 9)} 
                    renderItem={renderTableRow} 
                    keyExtractor={(item) => `front-${item.hole}`} 
                    scrollEnabled={false} // Prevents individual scrolling
                />
            </View>

            {/* Back 9 */}
            <Text style={styles.sectionTitle}>Back 9</Text>
            <View style={styles.table}>
                <View style={styles.rowHeader}>
                    <Text style={styles.headerCell}>Hole</Text>
                    <Text style={styles.headerCell}>Par</Text>
                    <Text style={styles.headerCell}>Score</Text>
                </View>
                <FlatList 
                    data={scorecard.slice(9, 18)} 
                    renderItem={renderTableRow} 
                    keyExtractor={(item) => `back-${item.hole}`} 
                    scrollEnabled={false} // Prevents individual scrolling
                />
            </View>


            {/* Spacer */}
            <View style={styles.spacer} />
            <Text>Space for Chatbox. Under Construction.</Text>
        </View>
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        minHeight: "100%", // Ensure full scrolling space
        backgroundColor: "#2E8B57",
        paddingVertical: 20,
        alignItems: "center",
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#FFD700",
    },
    tableContainer: {
        width: "100%",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: "#FFD700",
    },
    table: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 10,
        paddingBottom: 10,
    },
    rowHeader: {
        flexDirection: "row",
        backgroundColor: "#ddd",
        paddingVertical: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd", //change to green
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
    },
    input: {
        flex: 1,
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "#000",
        fontSize: 16,
    },
    spacer: {
        height: 200, // Creates space between Front 9 and Back 9
    },
});

export default ScorecardScreen;