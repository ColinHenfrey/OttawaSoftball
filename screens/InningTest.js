import {Text, View, StyleSheet, Button, LogBox, Animated, PanResponder, Dimensions} from "react-native";
import React, {Component, useEffect, useState} from "react";
import { useHeaderHeight } from '@react-navigation/elements';


export default function InningTest ({ route }) {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const shownFieldPositions = ['home', 'first', 'second', 'third']
    let headerHeight;
    try {
        headerHeight = useHeaderHeight();
    } catch (e) {
        headerHeight = 0;
    }

    const [playerPositions, setPlayerPositions] = useState([{}]);
    const [outs, setOuts] = useState([]);
    const [runs, setRuns] = useState(0);
    const [playerIndex, setPlayerIndex] = useState(1);
    const [actions, setActions] = useState([]);
    const [lastPlayerActions, setLastPlayerActions] = useState([]);

    useEffect(async () => {
        let players = route.params.teamMembers;
        let newPlayerPosition = players.map((player, index) => ({
            ...player,
            name: player.label,
            position: index === 0 ? 'home' : index === 1 ? 'next' : null
        }));
        setLastPlayerActions([{name: newPlayerPosition[0].name, position: 'home'}])
        setPlayerPositions(newPlayerPosition)
    }, [])

    const nextBatter = () => {
        let nextPlayerIndex = playerIndex >= route.params.teamMembers.length - 1 ? 0 : playerIndex + 1
        movePlayer(playerPositions[playerIndex].name, 'home')
            .then(movePlayer(playerPositions[nextPlayerIndex].name, 'next'))
        setPlayerIndex(nextPlayerIndex);
        setLastPlayerActions([...playerPositions.filter(player => shownFieldPositions.includes(player.position))
            .map(player => ({name: player.name, position: player.position}))])
        setActions([])
    }

    const movePlayer = async (name, position, undo) => {
        let playerIndex = playerPositions.findIndex(player => player.name === name)
        let currentPlayer = playerPositions[playerIndex]
        let state = playerPositions
        let run = false
        if (position === 'out') {
            setOuts([...outs, name])
            state[playerIndex] = {...currentPlayer, position: null}
        // if last position is null then we just want to move the player to home
        // also if it's undo then don't count it as a run
        } else if (position === 'home' && currentPlayer?.position !== 'next' && !undo) {
            await setRuns((previousRuns) => previousRuns + 1)
            run = true
            state[playerIndex] = {...currentPlayer, position: null}
        } else {
            state[playerIndex] = {...currentPlayer, position: position}
        }
        // let playerActionIndex = actions.findIndex(action => action?.name === name)
        //If the player has already moved during this players batting then we update their position
        if(position !== 'next') {
            let currentActions = actions.filter(action => action?.name !== name);
            setActions([...currentActions, {name: name, position: position, run: run}])
        }
        await setPlayerPositions([...state])
    }

    const canMoveToBase = (position) => {
        return playerPositions && position && !playerPositions.some(player => player.position === position);
    }

    const homeRunAction = () => {
        playerPositions.forEach((player) => {
            if (shownFieldPositions.includes(player.position)) {
                movePlayer(player.name, 'home')
            }
        });
    }

    const undoAction = () => {
        console.log('last player actions', lastPlayerActions)
        console.log('actions:', actions)
        if(actions.length < 1) {
            return
        }
        let lastActionIndex = actions.length - 1;
        let lastAction = actions[lastActionIndex]
        let playerLastInning = lastPlayerActions.find(player => player.name === lastAction.name)
        if (lastAction?.run) {
            setRuns((runs) => runs - 1)
        }
        if(lastAction.position === 'out') {
            let lastOuts = outs
            lastOuts.pop()
            setOuts(lastOuts)
        }
        movePlayer(playerLastInning.name, playerLastInning.position, true)
        //remove last action from list
        let previousActions = actions
        previousActions.pop()
        setActions([...previousActions])
    }

    return (
            <View style={{...styles.mainContainer}}>

                <View style={{position: 'absolute', justifyContent: 'center', textAlign: 'center', top: 50}}>
                    {actions.map((action) =>
                        <Text key={action?.name} style={{borderWidth: 2, borderRadius: 10, padding: 3, marginTop: 2, textAlign: 'center'}}>
                            {`${action?.name} moved from ${lastPlayerActions?.find(a => a?.name === action?.name)?.position} to ${action?.position}`}
                        </Text>
                    )}
                </View>

                <View style={shapes.field}>
                    <View style={{...shapes.base, ...styles.first}} />
                    <View style={{...shapes.base, ...styles.second}} />
                    <View style={{...shapes.base, ...styles.third}} />
                    <View style={{...shapes.base, ...styles.home}} />
                </View>

                {playerPositions.map(player => {
                    if (player?.position && shownFieldPositions?.includes(player?.position)) {
                        return (<Player firstBasePosition={{x: FIRST_BASE_POS.x, y: FIRST_BASE_POS.y + headerHeight}} secondBasePosition={{x: SECOND_BASE_POS.x, y: SECOND_BASE_POS.y + headerHeight}}
                                        homeBasePosition={{x: HOME_BASE_POS.x, y: HOME_BASE_POS.y + headerHeight}} thirdBasePosition={{x: THIRD_BASE_POS.x, y: THIRD_BASE_POS.y + headerHeight}} headerHeight={headerHeight} name={player.name}
                                        movePlayer={movePlayer} base={player.position} canMoveToBase={canMoveToBase} key={player.name}/>)
                    }
                })}

                <Text style={{textDecorationLine: 'underline', position: 'absolute', right: 50, top: 200, fontSize: 25}}>{`Runs: ${runs}`}</Text>

                <Text style={{textDecorationLine: 'underline', position: 'absolute', left: 50, top: 200, fontSize: 25}}>Outs</Text>
                {outs.map((out, index) => (
                    <View
                        style={{...styles.circle, left: 15 + index*35, top: 230, width: 30, height: 30}}>
                        <Text style={{...styles.text, fontSize: 5}}>{out}</Text>
                    </View>
                ))}

                <View style={{position: 'absolute', left: 20, top: 500}}>
                    <Button title='Home Run' onPress={homeRunAction} />
                </View>

                <View style={{position: 'absolute', right: 30, top: 500}}>
                    <Button title='Undo' onPress={undoAction} />
                </View>

                <Text style={{textDecorationLine: 'underline', position: 'absolute', left: 50, top: 550}}>Up Next</Text>
                <View
                    style={{...styles.circle, left: 35, top: 570}}>
                    <Text style={styles.text}>{playerPositions.find(player => player.position === 'next')?.name || 'test'}</Text>
                </View>

                <View style={{position: 'absolute', justifyContent: 'center', bottom: 50}}>
                    <Button style={{}}  title="Add player" onPress={nextBatter} />
                </View>
        </View>
    )
}

class Player extends Component{
    constructor(props){
        super(props);
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        this.state = {
            pan             : new Animated.ValueXY(),
            position: {left: this.props.homeBasePosition.x - PLAYER_RADIUS,
                top: this.props.homeBasePosition.y - PLAYER_RADIUS},
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder    : () => true,
            onPanResponderMove              : Animated.event([null,{
                dx  : this.state.pan.x,
                dy  : this.state.pan.y
            }], {}),
            onPanResponderRelease           : async (e, gesture) => {
                let releasedBase = this.getReleasedBase(gesture)
                if (releasedBase === 'out') {
                    this.props.movePlayer(this.props.name, releasedBase)
                    return;
                }
                let validMove = this.props.canMoveToBase(releasedBase)
                //If it's not a valid move then just return it to it's current location
                if (!validMove) {
                    releasedBase = this.props.base;
                }
                let lastLocation = this.getPlayerPosition(this.props.base)
                let playerLocation = this.getPlayerPosition(releasedBase)
                Animated.spring(
                    this.state.pan,
                    {
                        toValue:
                            {
                                x: playerLocation.left - lastLocation.left,
                                y: playerLocation.top - lastLocation.top
                            }
                    }
                ).start(async () => {
                    this.state.pan.setValue({x: 0, y: 0})
                    if (releasedBase !== this.props.base) {
                        await this.props.movePlayer(this.props.name, releasedBase)
                    }
                });
            }
        });
    }


    getReleasedBase(gesture) {
        if (this.isOut(gesture)) {
            return 'out'
        } else if (this.isInBounds(gesture, this.props.firstBasePosition)) {
            return 'first'
        } else if (this.isInBounds(gesture, this.props.secondBasePosition)) {
            return 'second'
        } else if (this.isInBounds(gesture, this.props.thirdBasePosition)) {
            return 'third'
        } else if (this.isInBounds(gesture, this.props.homeBasePosition)) {
            return 'home'
        }
    }

    getPlayerPosition(base) {
        switch(base) {
            case 'first':
                return {
                    left: this.props.firstBasePosition.x - PLAYER_RADIUS,
                    top: this.props.firstBasePosition.y - PLAYER_RADIUS
                };
            case 'second':
                return {
                        left: this.props.secondBasePosition.x - PLAYER_RADIUS,
                        top: this.props.secondBasePosition.y - PLAYER_RADIUS
                };
            case 'third':
                return {
                        left: this.props.thirdBasePosition.x - PLAYER_RADIUS,
                        top: this.props.thirdBasePosition.y - PLAYER_RADIUS
                };
            case 'home':
                return {
                        left: this.props.homeBasePosition.x - PLAYER_RADIUS,
                        top: this.props.homeBasePosition.y - PLAYER_RADIUS
                };
            case 'out':
                return {
                    left: 0,
                    top: 0
                };
        }
    }

    isInBounds(gesture, base) {
        return (gesture.moveY - base.y) ** 2 + (gesture.moveX - base.x) ** 2 <= RELEASE_RADIUS ** 2;
    }

    isOut(gesture) {
        if(!gesture.moveX || !gesture.moveY) {
            return false
        }
        return (gesture.moveY - FIELD_CENTER.y - this.props.headerHeight) ** 2 + (gesture.moveX - FIELD_CENTER.x) ** 2 >= OUT_RADIUS ** 2;
    }

    componentDidUpdate() {
        if (this.state.position.top === 0 && this.props?.homeBasePosition?.x != null) {
            this.setState({
                position: {top: this.props.homeBasePosition.y  - PLAYER_RADIUS ,
                    left: this.props.homeBasePosition.x  - PLAYER_RADIUS}
            })
        }
    }


    render(){
        let currentLocation = this.getPlayerPosition(this.props.base)
        return (
            <View style={{...styles.draggableContainer, left: currentLocation.left, top: currentLocation.top - this.props.headerHeight}}>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[this.state.pan.getLayout(), styles.circle, {backgroundColor: '#1abc9c'}]}>
                    <Text style={styles.text}>{this.props.name}</Text>
                </Animated.View>
            </View>
        );
    }

}

let RELEASE_RADIUS = 40;
let PLAYER_RADIUS = 40;
let Window = Dimensions.get('window');
let FIELD_LENGTH = 200
let BASE_LENGTH = 40;
let OUT_RADIUS = FIELD_LENGTH + 10
let FIELD_X = Window.width/2 - FIELD_LENGTH/2
let FIELD_Y = Window.height/2 - FIELD_LENGTH/2
let FIELD_CENTER = {x: FIELD_X + FIELD_LENGTH/2, y: FIELD_Y + FIELD_LENGTH/2}
let FIELD_DIAG = Math.sqrt(2) * FIELD_LENGTH
let BASE_DIAG = Math.sqrt(2) * BASE_LENGTH
let BASE_DISTANCE = (FIELD_DIAG - BASE_DIAG)/2
let HOME_BASE_POS = {x: FIELD_CENTER.x, y: FIELD_CENTER.y + BASE_DISTANCE}
let FIRST_BASE_POS = {x: FIELD_CENTER.x + BASE_DISTANCE, y: FIELD_CENTER.y}
let SECOND_BASE_POS = {x: FIELD_CENTER.x, y: FIELD_CENTER.y - BASE_DISTANCE}
let THIRD_BASE_POS = {x: FIELD_CENTER.x - BASE_DISTANCE, y: FIELD_CENTER.y}
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1,
        justifyContent: "center",
        position: "relative",
        alignItems: "center"
    },
    dropZone    : {
        height  : 100,
        width: 100,
        top: 100,
        left: 100,
        backgroundColor:'#2c3e50',
    },
    text        : {
        textAlign   : 'center',
        color       : '#fff',
    },
    draggableContainer: {
        position    : 'absolute',
        flex: 1,
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : PLAYER_RADIUS*2,
        height              : PLAYER_RADIUS*2,
        borderRadius        : PLAYER_RADIUS,
        position: "absolute",
        justifyContent: "center"
    },
    first: {bottom: 0, right: 0},
    second: {top: 0, right: 0},
    third: {top: 0, left: 0},
    home: {bottom: 0, left: 0, backgroundColor: 'blue'}
});

const shapes = StyleSheet.create({
    field: {
        width: FIELD_LENGTH,
        height: FIELD_LENGTH,
        backgroundColor: "green",
        transform: [{ rotate: "-45deg" }],
        position: "absolute",
        left: FIELD_X,
        top: FIELD_Y
    },
    base: {
        width: BASE_LENGTH,
        height: BASE_LENGTH,
        backgroundColor: "grey",
        position: 'absolute',
    },
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        height  : 100,
        backgroundColor:'#2c3e50',
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
});


