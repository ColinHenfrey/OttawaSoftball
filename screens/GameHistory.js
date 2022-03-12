import {
    View, Button, ScrollView
} from "react-native";
import { useEffect, useState} from "react";
import moment from "moment";
import GameHistoryListItem from "./GameHistoryListItem";

export default function GameHistory() {
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
            const now = moment()
            setGames(response?.games.filter(game => moment(game.date) < now).map((game) => {
                const date = moment(game.date)
                game.dateString = date.format('YYYY-MM-DD');
                game.moment = date;
                return game;
            }));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <ScrollView style={{flex: 1}}>
                {games.map(GameHistoryListItem)}
            </ScrollView>
        </View>
    )
}
