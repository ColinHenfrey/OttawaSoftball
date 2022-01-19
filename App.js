import { StatusBar } from 'expo-status-bar';
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import UserContext from "./context/UserContext";
import HomeNav from "./screens/HomeNav";

export default function App() {

    const [userID, setUserID] = useState('');
    const value = useMemo(
        () => ({ userID, setUserID }),
        [userID]
    );

    useEffect(async () => {
        let userID = await AsyncStorage.getItem('userID')
        setUserID(userID ? userID : '')
    }, []);


    useEffect( () => {
        AsyncStorage.setItem('userID', JSON.stringify(userID))
    }, [userID] )

    return (
        <UserContext.Provider value={value}>
            <NavigationContainer>
                {(!userID || userID === '') ? <LoginNav /> : <HomeNav/>}
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
