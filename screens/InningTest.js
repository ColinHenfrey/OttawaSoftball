import {Text, View, StyleSheet, Button, LogBox, Animated, PanResponder, Dimensions} from "react-native";
import React, {Component, useState} from "react";
import { useHeaderHeight } from '@react-navigation/elements';

export default function InningTest () {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    let headerHeight = 0;
    try {
        headerHeight = useHeaderHeight();
    } catch (e) {
        headerHeight = 0;
    }

    const [playerPositions, setPlayerPositions] = useState(new Map());

    const movePlayer = (player, position) => {
        const pp = [...playerPositions.values()]
        if (playerPositions && pp.includes(position)) {
            return false
        } else {
            let state = playerPositions
            delete state[player];
            if(position === 'out') {
                setPlayerPositions(state)
            } else {
                state.set(player, position)
                setPlayerPositions(state)
            }
        }
        return true;
    }

    console.log('header height: ' + headerHeight)
    return (
        <View style={styles.mainContainer}>

            <View style={shapes.field}>
                <View style={{...shapes.base, ...styles.first}} />
                <View style={{...shapes.base, ...styles.second}} />
                <View style={{...shapes.base, ...styles.third}} />
                <View style={{...shapes.base, ...styles.home}} />
            </View>

            <Player firstBasePosition={{x: FIRST_BASE_POS.x, y: FIRST_BASE_POS.y + headerHeight}} secondBasePosition={{x: SECOND_BASE_POS.x, y: SECOND_BASE_POS.y + headerHeight}}
                    homeBasePosition={{x: HOME_BASE_POS.x, y: HOME_BASE_POS.y + headerHeight}} thirdBasePosition={{x: THIRD_BASE_POS.x, y: THIRD_BASE_POS.y + headerHeight}} headerHeight={headerHeight} name='CH'
                    movePlayer={movePlayer}/>
            <Player firstBasePosition={{x: FIRST_BASE_POS.x, y: FIRST_BASE_POS.y + headerHeight}} secondBasePosition={{x: SECOND_BASE_POS.x, y: SECOND_BASE_POS.y + headerHeight}}
                    homeBasePosition={{x: HOME_BASE_POS.x, y: HOME_BASE_POS.y + headerHeight}} thirdBasePosition={{x: THIRD_BASE_POS.x, y: THIRD_BASE_POS.y + headerHeight}} headerHeight={headerHeight} name='PH'
                    movePlayer={movePlayer}/>

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
            onPanResponderRelease           : (e, gesture) => {
                let playerPosition = this.getPlayerPosition(gesture)
                if (!playerPosition) {
                    console.log(this.state.out)
                } else {
                    Animated.spring(
                        this.state.pan,
                        {
                            toValue:
                                {
                                    x: playerPosition.position.left - this.state.position.left,
                                    y: playerPosition.position.top - this.state.position.top
                                }
                        }
                    ).start(() => {
                        this.state.pan.setValue({x: 0, y: 0})
                        this.setState({
                            position: playerPosition.position
                        })
                    });
                }
            }
        });
    }

    getPlayerPosition(gesture) {
        let {movePlayer, name} = this.props
        if (this.isOut(gesture)) {
            movePlayer(name, 'out')
            return false;
        } else if (this.isInBounds(gesture, this.props.firstBasePosition)) {
            let moved = movePlayer(name, 'first')
            if(moved) {
                return {
                    position: {left: this.props.firstBasePosition.x - PLAYER_RADIUS,
                        top: this.props.firstBasePosition.y - PLAYER_RADIUS },
                };
            }
        } else if (this.isInBounds(gesture, this.props.secondBasePosition)) {
            let moved = movePlayer(name, 'second')
            if(moved) {
                return {
                    position: {
                        left: this.props.secondBasePosition.x - PLAYER_RADIUS,
                        top: this.props.secondBasePosition.y - PLAYER_RADIUS
                    }
                };
            }
        } else if (this.isInBounds(gesture, this.props.thirdBasePosition)) {
            let moved = movePlayer(name, 'third')
            if(moved) {
                return {
                    position: {
                        left: this.props.thirdBasePosition.x - PLAYER_RADIUS,
                        top: this.props.thirdBasePosition.y - PLAYER_RADIUS
                    }
                };
            }

        } else if (this.isInBounds(gesture, this.props.homeBasePosition)) {
            let moved = movePlayer(name, 'home')
            if (moved) {
                return {
                    position: {
                        left: this.props.homeBasePosition.x - PLAYER_RADIUS,
                        top: this.props.homeBasePosition.y - PLAYER_RADIUS
                    }
                };
            }
        }
        return {position: this.state.position}
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
        return (
            <View style={{...styles.draggableContainer, left: this.state.position?.left, top: this.state.position?.top - this.props.headerHeight}}>
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
let PLAYER_RADIUS = 30;
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
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        flex: 1
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : PLAYER_RADIUS*2,
        height              : PLAYER_RADIUS*2,
        borderRadius        : PLAYER_RADIUS,
        position: "absolute"
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


