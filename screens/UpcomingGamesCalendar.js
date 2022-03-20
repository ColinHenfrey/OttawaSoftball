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

export default function UpcomingGamesCalendar({ navigation }) {
    const { userID, setUserID } = useContext(UserContext);
    const [ games, setGames ] = useState([]);
    const [marked, setMarked] = useState({});
    const [current, setCurrent] = useState(null);
    const [dateInViewIndex, setDateInViewIndex] = useState(-1);
    const scrollView = useRef(null);

    useEffect(async () => {
        await getGames()
    }, [])

    const getGames = async () => {
        try {
            await fetchGames().then(games => setGames(games))
            const newMarked = {};
            games.forEach(game => {
                let dateString = moment(game.date).format('YYYY-MM-DD')
                newMarked[dateString] = {disabled: false, marked: true, dotColor: colors.primary}
            });
            setMarked(newMarked);
        } catch (error) {
            console.error(error);
        }
    }

    let updateSelectedDay = (day) => {
        selectDate(day.dateString)
    }

    let selectDate = (dateString, datePosition) => {
        let newMarked = {};
        Object.keys(marked).forEach(key => (newMarked[key] = {...marked[key], selected: false}));
        newMarked[dateString] = {...newMarked[dateString], selected: true, selectedColor: colors.primary}
        setMarked({...newMarked});
        if (!datePosition) {
            datePosition = games.findIndex((item) => item.dateString === dateString);
        }
        if (datePosition !== -1) {
            scrollView.current?.scrollTo({x: datePosition*355});
        }
    }

    let handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        const currentDateInView = Math.round(scrollPosition / 350)
        let dateInView = games[currentDateInView]
        if (currentDateInView !== dateInViewIndex) {
            setDateInViewIndex(currentDateInView)
            if (dateInView) {
                selectDate(dateInView.dateString, currentDateInView)
                setCurrent(dateInView.dateString)
            }
        } else {
            //Do nothing for now
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 2}}>
                <CalendarList
                    current={current}
                    onDayPress={updateSelectedDay}
                    markedDates={marked}
                    disabledByDefault={true}
                    disableAllTouchEventsForDisabledDays={true}
                />
            </View>

            <View style={{flex: 1}}>
                <Text style={styles.title}>
                    Upcoming Games
                </Text>
                <ScrollView
                    ref={scrollView}
                    decelerationRate={'fast'}
                    onMomentumScrollEnd={handleScroll}
                    horizontal= {true}
                    snapToAlignment={"center"}
                    contentInset={{
                        top: 0,
                        left: 30,
                        bottom: 0,
                        right: 30,
                    }}
                >
                    {games.map((item) => UpcomingGameListItem({item, navigation}))}
                </ScrollView>
                <Button title='Logout' onPress={() => setUserID('')}/>
            </View>
        </View>
    )
}
