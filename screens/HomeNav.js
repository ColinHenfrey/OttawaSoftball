import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UpcomingGames from "./UpcomingGames";
import Game from "./Game";

export default function HomeNav() {

    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={UpcomingGames} />
            <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
    )
}
