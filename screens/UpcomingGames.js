import {FlatList, View, Text, StyleSheet, Pressable, Button, PanResponder, Animated} from "react-native";
import UserContext from "../context/UserContext";
import React, {useContext, useEffect, useState} from "react";
import globalStyles from '../styles'

export default function UpcomingGames({ navigation }) {
    const { userID, setUserID } = useContext(UserContext);
    const [ games, setGames ] = useState([]);

    useEffect(async () => {
        await getGames()
    }, [])

    const getGames = async () => {
        try {
            const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/games?teamID=' + 1)
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
            setGames(response.games)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            <Text>{`Welcome user ${userID}`}</Text>
            <FlatList
                keyExtractor={(item => item.ID.toString())}
                data={games}
                renderItem={(item) => UpcomingGameListItem(item, navigation)}
            />
            <Button title='Logout' onPress={() => setUserID('')}/>
        </View>
    )
}

function UpcomingGameListItem({ item }, navigation) {
    return (
        <Pressable onPress={() => navigation.navigate('Game', {game: item})}>
            <View style={globalStyles.item}>
                <Text>{item.ID}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    }
});
