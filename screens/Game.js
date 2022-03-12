import {View, Text, Button, Linking, Platform} from "react-native";
import styles from "../styles/styles";
import Moment from "moment/moment";


export default function Game({route, navigation}) {

    const game = route.params.game

    const linkToMaps = async () => {
        if (Platform.OS === 'ios') {
            await Linking.openURL('https://maps.apple.com/?q=' + encodeURIComponent(game.address))
        } else {
            await Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(game.address))
        }
    }

    let date = Moment(game.date)

    return (
        <View style={styles.container}>
            <Text>{`${game.home} vs ${game.away}`}</Text>
            <Text>{game.fieldName}</Text>
            <Button onPress={linkToMaps} title={game.address}>{date.format('MMMM Do [at] h:mm')}</Button>
            <Text>{date.format('MMMM Do [at] h:mm')}</Text>
            <Button title='Keep Score' onPress={() => navigation.navigate('Batting Order', game)}/>
        </View>
    )
}
