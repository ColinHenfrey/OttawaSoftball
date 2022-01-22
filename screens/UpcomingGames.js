import {FlatList, View, Text, StyleSheet, Pressable, Button} from "react-native";
import colors from "react-native/Libraries/NewAppScreen/components/Colors";
import UserContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

export default function UpcomingGames({ navigation }) {
    const { userID, setUserID } = useContext(UserContext);
    const [ games, setGames ] = useState([]);

    useEffect(async () => {
        await getGames()
    }, [])

    const getGames = async () => {
        try {
            const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/games?teamID=' + 1)
                .then(res => {
                if(!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.json();
                }
            })
                .catch(err => {
                    console.log(err);
                });
            setGames(response.games)
        } catch (error) {
            console.error(error);
        }
    }

    const keyExtractor = (item, index) => index.toString()

    return (
        <View>
            <Text>{`Welcome user ${userID}`}</Text>
            <FlatList
                keyExtractor={keyExtractor}
                data={games}
                renderItem={(item) => UpcomingGameListItem(item, navigation)}
            />
            <Button title='Logout' onPress={() => setUserID('')}/>
        </View>
    )
}

function UpcomingGameListItem({ item }, navigation) {
    return (
        <Pressable onPress={() => navigation.navigate('Game', {game: item})}>
            <View style={styles.item}>
                <Text>{item.ID}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
        backgroundColor: colors.white
    },
});
