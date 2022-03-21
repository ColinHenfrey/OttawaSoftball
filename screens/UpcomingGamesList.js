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
import fetchGames from "../requests/fetchGames";

export default function UpcomingGamesList({ navigation }) {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [ games, setGames ] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await fetchGames(userInfo.userID).then(games => setGames(games));
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <ScrollView style={{flex: 1}}>
                {games.map((item) => UpcomingGameListItem({item, navigation}))}
            </ScrollView>
        </View>
    )
}
