import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UpcomingGamesList from "./UpcomingGamesList";
import { Feather } from '@expo/vector-icons';
import UpcomingGamesCalendar from "./UpcomingGamesCalendar";

export default function UpcomingGames() {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false
        }}>
            <Tab.Screen name="GamesCalendar" component={UpcomingGamesCalendar} options={{
                tabBarLabel: 'Calendar',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="calendar" size={24} color="black" />
                ),
            }}/>
            <Tab.Screen name="GamesList" component={UpcomingGamesList} options={{
                tabBarLabel: 'List',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="list" size={24} color="black" />
                ),
            }}/>
        </Tab.Navigator>
    )
}
