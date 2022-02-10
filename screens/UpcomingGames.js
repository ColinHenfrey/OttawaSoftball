import {FlatList, View, Text, StyleSheet, Pressable, Button, PanResponder, Animated} from "react-native";
import UserContext from "../context/UserContext";
import React, {useContext, useEffect, useState} from "react";
import globalStyles from '../styles'
import Moment from "moment/moment";

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
            setGames(response?.games)
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

function formatDate(date) {
    return `${date.toLocaleString('en-us', {month:'long', day: 'short'})} `
}

function UpcomingGameListItem({ item }, navigation) {
    let moment = Moment(item.date)

    return (
        <Pressable onPress={() => navigation.navigate('Game', {game: item})}>
            <View style={globalStyles.item}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <Text style={{flex: 1}}>{item.fieldName}</Text>
                    <Text style={{flex: 1}}>{moment.format('MMMM Do [at] h:mm')}</Text>
                </View>
                <View style={{flex: 1, textAlign:'right', justifyContent: 'center'}}>
                    <Text>{`${item.home} vs ${item.away}`}</Text>
                </View>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    right: {
       textAlign: "right"
    },
    left: {
        textAlign: "left"
    },
    textStyle:{
        fontSize: 25,
        color:'white',
        flex:1
    }
});
