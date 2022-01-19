import {View, Text} from "react-native";
import styles from "../styles";

export default function Game({route}) {

    const game = route.params.game

    return (
        <View style={styles.container}>
            <Text>{`${game.home} vs ${game.away}`}</Text>
        </View>
    )
}
