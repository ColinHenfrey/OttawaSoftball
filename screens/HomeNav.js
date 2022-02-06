import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UpcomingGames from "./UpcomingGames";
import Game from "./Game";
import Inning from "./Inning";
import KeepScore from "./KeepScore";

export default function HomeNav() {

    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={UpcomingGames} />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Keep Score" component={KeepScore} />
            <Stack.Screen name="Inning" component={Inning} />
        </Stack.Navigator>
    )
}
