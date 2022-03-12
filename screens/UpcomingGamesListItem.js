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

export default function UpcomingGameListItem({ item, navigation }) {
    let dateBubble = (moment) => {
        return (
            <View style={styles.dateBubbleContainer}>
                <Text style={styles.dateBubbleDay}>{moment.date()}</Text>
                <Text style={styles.dateBubbleMonth}>{moment.format('MMM')}</Text>
            </View>
        )
    }

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
