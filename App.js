import { StatusBar } from 'expo-status-bar';
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import UserContext from "./context/UserContext";
import Inning from "./screens/Inning";
import BattingOrder from "./screens/BattingOrder";
import styles from "./styles/styles";
import {SafeAreaView, View} from "react-native";
import InningTest from "./screens/InningTest";
import Game from "./screens/Game";
import HomeTabNav from "./screens/HomeTabNav";
import HomeStack from "./screens/HomeStack";
import GameHistory from "./screens/GameHistory";

export default function App() {

    const [userInfo, setUserInfo] = useState('');
    const value = useMemo(
        () => ({ userInfo, setUserInfo }),
        [userInfo]
    );

    useEffect(async () => {
        let userInfo = await AsyncStorage.getItem('userInfo')
        setUserInfo(!userInfo || userInfo.includes("\\") ? '' : JSON.parse(userInfo))
    }, []);


    useEffect( () => {
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
        console.log('Set user ID to ' + JSON.stringify(userInfo))
    }, [userInfo] )


    return (
        <UserContext.Provider value={value}>
            <NavigationContainer>
                {(!userInfo?.userID || userInfo.userID === '' || userInfo.userID === "\"\"") ? <LoginNav /> : <HomeStack/>}
                {/*<GameHistory />*/}
                <StatusBar/>
            </NavigationContainer>
        </UserContext.Provider>
    )

}


function LoginNav() {

    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName="Log in">
            <Stack.Screen name="Log in" component={Login} />
            <Stack.Screen name="Create Account" component={CreateAccount} />
        </Stack.Navigator>
    )
}
