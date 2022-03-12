import {
    View
} from "react-native";
import globalStyles from '../styles/styles'
import styles from "../styles/styles";
import colors from "../colors";
import Text from "../styledComponents/Text"
import { Pressable, TextInput } from "react-native";


export default function GameHistoryListItem({item, navigation}) {
    const won = !item.homeScore ? undefined : item.homeScore > item.awayScore
    let WinLossBubble = () => {
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
        <Pressable onPress={() => navigation.navigate('Game', {game: item})} key={item.ID}>
            <View style={globalStyles.calenderItem} key={item.ID}>
                <View style={{flexDirection: "column", flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {WinLossBubble(item)}
                </View>
                <View style={{flex: 2, textAlign:'right', justifyContent: 'center'}}>
                    <Text style={styles.calenderItemTime}>{item.moment.format('MMMM Do, h:mm A')}</Text>
                    <Text style={styles.text}>{`${item.home} vs ${item.away}`}</Text>
                    <Text style={styles.text}>{`${item.homeScore || '?'} vs ${item.awayScore || '?'}`}</Text>
                </View>
            </View>
        </Pressable>
    )
}
