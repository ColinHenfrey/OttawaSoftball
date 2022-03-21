import {
    View, Button, ScrollView
} from "react-native";
import {useContext, useEffect, useState} from "react";
import moment from "moment";
import GameHistoryListItem from "./GameHistoryListItem";
import fetchGames from "../requests/fetchGames";
import UserContext from "../context/UserContext";

export default function GameHistory({navigation}) {
    const [ games, setGames ] = useState([]);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const now = moment();
            await fetchGames(userInfo.userID).then(games => setGames(games.filter(game => moment(game.date) < now)));
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
