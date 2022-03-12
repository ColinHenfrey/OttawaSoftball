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

export default function UpcomingGamesCalendar({ navigation }) {
    const { userID, setUserID } = useContext(UserContext);
    const [ games, setGames ] = useState([]);
    const [items, setItems] = useState({});
    const [marked, setMarked] = useState({});
    const [current, setCurrent] = useState(null);
    const scrollView = useRef(null);

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

    let updateSelectedDay = (day) => {
        selectDate(day.dateString)
    }

    let selectDate = (dateString) => {
        let newMarked = {};
        Object.keys(marked).forEach(key => (newMarked[key] = {...marked[key], selected: false}));
        newMarked[dateString] = {...newMarked[dateString], selected: true, selectedColor: colors.primary}
        setMarked({...newMarked});
        const datePosition = games.findIndex((item) => item.dateString === dateString);
        if (datePosition !== -1) {
            scrollView.current?.scrollTo({x: datePosition*350 - 10});
        }
    }

    // need to only do this on snap ideally
    let handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        const dateInViewIndex = Math.round(scrollPosition/350)
        let dateInView = games[dateInViewIndex]
        if (dateInView) {
            selectDate(dateInView.dateString)
            setCurrent(dateInView.dateString)
        }
    }

    let UpcomingGameListItem = ({item, navigation}) => {
        return (
            <Pressable onPress={() => navigation.navigate('Game', {game: item})} key={item.ID}>
                <View style={globalStyles.calenderItem}>
                    <View style={{flexDirection: "column", flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {dateBubble(item.moment)}
                    </View>
                    <View style={{flex: 2, textAlign:'right', justifyContent: 'center'}}>
                        <Text style={styles.calenderItemTime}>{item.moment.format('h:mm A')}</Text>
                        <Text style={styles.text}>{`${item.home} vs ${item.away}`}</Text>
                        <Text style={styles.text}>{item.fieldName}</Text>
                    </View>
                </View>
            </Pressable>
        )
    }


    let dateBubble = (moment) => {
        return (
            <View style={styles.dateBubbleContainer}>
                <Text style={styles.dateBubbleDay}>{moment.date()}</Text>
                <Text style={styles.dateBubbleMonth}>{moment.format('MMM')}</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 2}}>
                <CalendarList
                    current={current}
                    items={items}
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
                    onScrollEndDrag={handleScroll}
                    horizontal= {true}
                    decelerationRate={0}
                    snapToInterval={350}
                    snapToAlignment={"center"}
                    contentInset={{
                        top: 0,
                        left: 30,
                        bottom: 0,
                        right: 30,
                    }}>
                    {games.map((item) => UpcomingGameListItem({item, navigation}))}
                </ScrollView>
                <Button title='Logout' onPress={() => setUserID('')}/>
            </View>
        </View>
    )
}
