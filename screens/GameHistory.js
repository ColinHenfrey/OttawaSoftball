import {
    View, Button, ScrollView
} from "react-native";
import { useEffect, useState} from "react";
import moment from "moment";
import GameHistoryListItem from "./GameHistoryListItem";
import fetchGames from "../requests/fetchGames";

export default function GameHistory({navigation}) {
    const [ games, setGames ] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await fetchGames().then(games => setGames(games));
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <ScrollView style={{flex: 1}}>
                {games.map((item) => GameHistoryListItem({item, navigation}))}
            </ScrollView>
        </View>
    )
}
