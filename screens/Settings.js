import { View } from "react-native";
import Text from "../styledComponents/Text"
import UserContext from "../context/UserContext";
import {useContext} from "react";
import Button from "../styledComponents/Button"

export default function Settings({navigation}) {
    const { userInfo, setUserInfo } = useContext(UserContext);

    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <Button title='Logout' onPress={() => setUserInfo({...userInfo, userID: ''})}/>
        </View>
    )
}
