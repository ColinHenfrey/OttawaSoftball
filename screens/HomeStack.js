import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabNav from "./HomeTabNav";
import Game from "./Game";
import Inning from "./Inning";
import KeepScore from "./KeepScore";
import BattingOrder from "./BattingOrder";
import InningTest from "./InningTest";

export default function HomeStack() {

    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeTabNav} options={{headerShown: false}}/>
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Batting Order" component={BattingOrder} />
            <Stack.Screen name="Keep Score" component={KeepScore} />
            <Stack.Screen name="Inning" component={InningTest} />
        </Stack.Navigator>
    )
}

// Hiding the header for now on Inning because it was causing issues with the player dragging   `
// options={{headerShown: false}}
