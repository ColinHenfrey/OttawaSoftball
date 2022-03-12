import {
    View
} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import globalStyles from '../styles/styles'
import styles from "../styles/styles";
import colors from "../colors";
import Text from "../styledComponents/Text"

export default function GameHistoryListItem(item) {
    const won = !item.homeScore ? undefined : item.homeScore > item.awayScore
    let WinLossBubble = (item) => {
        return (
            <View style={{...styles.dateBubbleContainer, backgroundColor: won === undefined ? colors.light
                    : won ? colors.green : colors.red}}>
                <Text style={styles.dateBubbleDay}>
                    {won === undefined ? '?' : won ? 'W' : 'L'}
                </Text>
            </View>
        )
    }

    return (
        <View style={globalStyles.calenderItem} key={item.ID}>
            <View style={{flexDirection: "column", flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {WinLossBubble(item)}
            </View>
            <View style={{flex: 2, textAlign:'right', justifyContent: 'center'}}>
                <Text style={styles.calenderItemTime}>{item.moment.format('MMMM Do, h:mm:ss A')}</Text>
                <Text style={styles.text}>{`${item.home} vs ${item.away}`}</Text>
                <Text style={styles.text}>{`${item.homeScore || '?'} vs ${item.awayScore || '?'}`}</Text>
            </View>
        </View>
    )
}
