import {View, Text, Button} from "react-native";
import styles from "../styles";

export default function Game({route, navigation}) {

    const game = route.params.game

    return (
        <View style={styles.container}>
            <Text>{`${game.home} vs ${game.away}`}</Text>
            <Button title='Keep Score' onPress={() => navigation.navigate('Inning', game)}/>
        </View>
    )
}
