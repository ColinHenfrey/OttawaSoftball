import {
    View, Pressable, Button, ScrollView
} from "react-native";
import UserContext from "../context/UserContext";
import React, {useContext, useEffect, useRef, useState} from "react";
import globalStyles from '../styles/styles'
import {Agenda, Calendar, CalendarList} from "react-native-calendars";
import moment from "moment";
import styles from "../styles/styles";
import colors from "../colors";
import Text from "../styledComponents/Text"
import UpcomingGameListItem from "./UpcomingGamesListItem";

export default function UpcomingGamesList({ navigation }) {
    const { userID, setUserID } = useContext(UserContext);
    const [ games, setGames ] = useState([]);
    const [items, setItems] = useState({});
    const [marked, setMarked] = useState({});
    const [current, setCurrent] = useState(null);

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
            const newItems = {};
            const newMarked = {};
            setGames(response?.games.map((game) => {
                const date = moment(game.date)
                game.dateString = date.format('YYYY-MM-DD');
                game.moment = date;
                return game;
            }));
            response?.games.forEach(game => {
                let dateString = moment(game.date).format('YYYY-MM-DD')
                newItems[dateString] = [game]
                newMarked[dateString] = {disabled: false, marked: true, dotColor: colors.primary}
            });
            setItems(newItems);
            setMarked(newMarked);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <ScrollView style={{flex: 1}}>
                {games.map((item) => UpcomingGameListItem({item, navigation}))}
            </ScrollView>
            <Button title='Logout' onPress={() => setUserID('')}/>
        </View>
    )
}
