import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UpcomingGamesList from "./UpcomingGamesList";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import UpcomingGamesCalendar from "./UpcomingGamesCalendar";
import GameHistory from "./GameHistory";
import Settings from "./Settings";

export default function HomeTabNav() {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator>
            <Tab.Screen name="GamesCalendar" component={UpcomingGamesCalendar} options={{
                tabBarLabel: 'Calendar',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="calendar" size={24} color="black" />
                ),
                headerTitle: 'Upcoming Games'
            }}/>

            <Tab.Screen name="GameHistory" component={GameHistory} options={{
                tabBarLabel: 'History',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="history" size={24} color="black" />
                ),
                headerTitle: 'Game History'
            }}/>

            <Tab.Screen name="Settings" component={Settings} options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="settings" size={24} color="black" />
                ),
                headerTitle: 'Settings'
            }}/>
        </Tab.Navigator>
    )
}
