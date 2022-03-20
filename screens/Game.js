import {View, Linking, Platform} from "react-native";
import styles from "../styles/styles";
import Moment from "moment/moment";
import colors from "../colors";
import TextInput from "../styledComponents/TextInput";
import {useState} from "react";
import Text from '../styledComponents/Text';
import TextButton from "../styledComponents/TextButton";
import Button from "../styledComponents/Button"


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
            <View style={{...styles.container, marginTop: '10%'}}>
                <View style={{...styles.container, flexDirection: 'row'}}>
                    <View style={styles.container}>
                        <View style={styles.teamLogo}>
                            <Text>
                                TE
                            </Text>
                        </View>
                        <Text>Test Team</Text>
                        <Text>1 : 2</Text>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.teamLogo}>
                            <Text>
                                TD
                            </Text>
                        </View>
                        <Text>Test Team</Text>
                        <Text>1 : 2</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <TextButton onPress={linkToMaps} title={`${game.fieldName}, ${game.address}`}>{date.format('MMMM Do [at] h:mm')}</TextButton>
                </View>
                <View style={styles.container}>
                    <Text>{date.format('MMMM Do [at] h:mm')}</Text>
                </View>
            </View>
            <View style={{...styles.container, justifyContent: 'flex-end', marginBottom: '20%', width: '100%'}}>
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
        </View>
    )
}
