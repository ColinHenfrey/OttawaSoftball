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
import TextButton from "../styledComponents/TextButton";

export default function UpcomingGamesCalendar({ navigation }) {
    const { userInfo } = useContext(UserContext);
    const [ games, setGames ] = useState([]);
    const [marked, setMarked] = useState({});
    const [current, setCurrent] = useState(null);
    const [dateInViewIndex, setDateInViewIndex] = useState(-1);
    const scrollView = useRef(null);

    useEffect(async () => {
        await fetchGames(userInfo.userID).then(games => setGames(games))
    }, [])

    useEffect(async () => {
        const newMarked = {};
        games.forEach(game => {
            let dateString = moment(game.date).format('YYYY-MM-DD')
            newMarked[dateString] = {disabled: false, marked: true, dotColor: colors.primary}
        });
        setMarked(newMarked);
    }, [games])

    let updateSelectedDay = (day) => {
        selectDate(day.dateString, null, true)
    }

    let selectDate = (dateString, datePosition, snap) => {
        let newMarked = {};
        Object.keys(marked).forEach(key => (newMarked[key] = {...marked[key], selected: false}));
        newMarked[dateString] = {...newMarked[dateString], selected: true, selectedColor: colors.primary}
        setMarked({...newMarked});
        if (!datePosition) {
            datePosition = games.findIndex((item) => item.dateString === dateString);
        }
        if (datePosition !== -1 && snap) {
            scrollView.current?.scrollTo({x: datePosition*355});
        }
    }

    let handleMomentumEnd = (event, snap) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        const currentDateInView = Math.round(scrollPosition / 350)
        let dateInView = games[currentDateInView]
        if (currentDateInView !== dateInViewIndex) {
            setDateInViewIndex(currentDateInView)
            if (dateInView) {
                selectDate(dateInView.dateString, currentDateInView, snap)
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
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={{...styles.title, textAlign: 'left'}}>
                            Upcoming Games
                        </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <TextButton
                            textStyle={{fontSize: 20, marginRight: 10}}
                            title="See All" onPress={() => navigation.navigate("UpcomingGamesList")}
                        />
                    </View>
                </View>
                <ScrollView
                    ref={scrollView}
                    decelerationRate={'fast'}
                    onMomentumScrollEnd={(event) => handleMomentumEnd(event, true)}
                    onScrollEndDrag={handleMomentumEnd}
                    horizontal= {true}
                    snapToAlignment={"center"}
                    contentInset={{
                        top: 0,
                        left: 30,
                        bottom: 0,
                        right: 30,
                    }}
                >
                    {games?.map((item) => UpcomingGameListItem({item, navigation}))}
                </ScrollView>
            </View>
        </View>
    )
}
