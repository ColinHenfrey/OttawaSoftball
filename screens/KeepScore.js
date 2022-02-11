import {Button, FlatList, Pressable, Text, View} from "react-native";
import globalStyles from '../styles'
import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext";


export default function KeepScore({route, navigation}) {
    const [ innings, setInnings ] = useState([]);

    useEffect(async () => {
        await getInnings()
    }, [])

    const getInnings = async () => {
        try {
            const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/innings?gameID=' + 2)
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
            setInnings(response?.innings)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            <FlatList
                keyExtractor={(item) => (item.gameID.toString() + item.number.toString())}
                data={innings}
                renderItem={(item) => InningListItem(item, navigation, route)}
            />
        </View>
    )
}

function InningListItem({ item }, navigation, route) {
    return (
        <Pressable onPress={() => navigation.navigate('Inning', {Inning: item, teamMembers: route.params.teamMembers})}>
            <View style={globalStyles.item}>
                <Text>{`Inning ${item.number}`}</Text>
                <Text>{`${item.homeRuns ? item.homeRuns : '?'} : ${item.awayRuns ? item.awayRuns : '?'}`}</Text>
            </View>
        </Pressable>
    )
}
