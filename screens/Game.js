import {View, Text, Button, Linking, Platform} from "react-native";
import styles from "../styles/styles";
import Moment from "moment/moment";
import colors from "../colors";
import TextInput from "../styledComponents/TextInput";
import {useState} from "react";


export default function Game({route, navigation}) {
    const [homeScore, setHomeScore] = useState(null);
    const [awayScore, setAwayScore] = useState(null);

    const game = route.params.game

    const setGameScore = async () => {
        try {
            const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/games', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'homeScore': homeScore,
                    'awayScore': awayScore,
                    'gameID': game.ID,
                })
            })
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
            console.log(response?.message)
        } catch (error) {
            console.error(error);
        }
    }

    const linkToMaps = async () => {
        if (Platform.OS === 'ios') {
            await Linking.openURL('https://maps.apple.com/?q=' + encodeURIComponent(game.address))
        } else {
            await Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(game.address))
        }
    }

    let date = Moment(game.date)

    return (
        <View style={styles.container}>
            <Text>{`${game.home} vs ${game.away}`}</Text>
            <Text>{game.fieldName}</Text>
            <Button onPress={linkToMaps} title={game.address}>{date.format('MMMM Do [at] h:mm')}</Button>
            <Text>{date.format('MMMM Do [at] h:mm')}</Text>
            {date > Moment().add(1, 'hours') ?
                <Button title='Keep Score' onPress={() => navigation.navigate('Batting Order', game)}/>
                :
                <View style={{width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 20}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text>{game.home}</Text>
                            <TextInput
                                style={{width: '50%'}}
                                textAlign={'center'}
                                keyboardType={'numeric'}
                                value={homeScore}
                                onChangeText={setHomeScore}
                            />
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text>{game.away}</Text>
                            <TextInput
                                style={{width: '50%'}}
                                textAlign={'center'}
                                keyboardType={'numeric'}
                                value={awayScore}
                                onChangeText={setAwayScore}
                            />
                        </View>
                    </View>
                    <Button title='Submit Score' onPress={setGameScore}/>
                </View>
            }
        </View>
    )
}
