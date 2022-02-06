import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, Button} from "react-native";
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function BattingOrder() {
    const [ teamMembers, setTeamMembers ] = useState([]);

    useEffect(async () => {
        await getTeamMembers()
    }, [])

    const getTeamMembers = async () => {
        try {
            const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/teamMembers?teamID=' + 1)
                .then(res => {
                    if(!res.ok) {
                        return res.text().then(text => { throw new Error(text) })
                    }
                    else {
                        return res.json();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            setTeamMembers(response.teamMembers?.map((teamMember) => {
                return {
                    userID: teamMember.userID,
                    label: `${teamMember.firstName} ${teamMember.lastName}` ,
                    backgroundColor: 'white'
                };
            }));
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    delayLongPress={300}
                    style={[
                        styles.rowItem,
                        { backgroundColor: isActive ? "#F5F5F5" : item.backgroundColor },
                    ]}
                >
                    <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const setBattingOrder = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/teamMembers?teamID=' + 1, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'battingOrder': teamMembers,
                })
            })
                .then(res => {
                    if(!res.ok) {
                        return res.text().then(text => { throw new Error(text) })
                    }
                    else {
                        return res.json();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            console.log(response.message)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Set your batting order</Text>
            <DraggableFlatList
                data={teamMembers}
                onDragEnd={({ data }) => setTeamMembers(data)}
                keyExtractor={(item) => item.userID}
                renderItem={renderItem}
            />
            <Button onPress={setBattingOrder} title="Submit Batting Order"/>
        </View>
    );
}

const styles = StyleSheet.create({
    rowItem: {
        height: 100,
        width: 'max',
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "black",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    container: {
        flex: 1,
    }
});
