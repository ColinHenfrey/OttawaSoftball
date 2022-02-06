import {Text, View, StyleSheet, Button, LogBox, Animated, PanResponder, Dimensions} from "react-native";
import React, {Component} from "react";


export default class Inning extends Component{
    constructor(props) {
        super(props);
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        this.state = {
            showDraggable: true,
            dropZonePosition: {left: 0, top: 0},
            playerPositions: {me: {}}
        };
    }

    setFirstBaseDropZoneValue(position){
        this.setState({
            firstBasePosition : position,
            dropZonePosition: {position: "absolute", top: position.y - RELEASE_RADIUS, left: position.x - RELEASE_RADIUS}
        });
    }

    setSecondBaseDropZoneValue(position){
        this.setState({
            secondBasePosition : position
        });
    }

    setThirdBaseDropZoneValue(position){
        this.setState({
            thirdBasePosition : position
        });
    }

    setHomeBaseDropZoneValue(position){
        this.setState({
            homeBasePosition : position
        });
    }

    render(){
        return (
            <View style={styles.mainContainer}>

                <View style={shapes.field}>
                    <View style={{...shapes.base, ...styles.first}} onLayout={(event) => {
                        event.target.measure(
                            (x, y, width, height, pageX, pageY) => {
                                this.setFirstBaseDropZoneValue({
                                    x: pageX + width/2,
                                    y: pageY + height/2,
                                });
                            },
                        );
                    }}/>
                    <View style={{...shapes.base, ...styles.second}} onLayout={(event) => {
                        event.target.measure(
                            (x, y, width, height, pageX, pageY) => {
                                this.setSecondBaseDropZoneValue({
                                x: pageX + width/2,
                                y: pageY + height/2,
                            })},
                        );
                    }}/>
                    <View style={{...shapes.base, ...styles.third}} onLayout={(event) => {
                        event.target.measure(
                            (x, y, width, height, pageX, pageY) => {
                                this.setThirdBaseDropZoneValue({
                                x: pageX + width/2,
                                y: pageY + height/2,
                            })},
                        );
                    }}/>
                    <View style={{...shapes.base, ...styles.home}} onLayout={(event) => {
                        event.target.measure(
                            (x, y, width, height, pageX, pageY) => {
                                this.setHomeBaseDropZoneValue({
                                x: pageX + width/2,
                                y: pageY + height/2,
                            })},
                        );
                    }}/>
                </View>

                <View style={{...this.state.dropZonePosition, backgroundColor: 'red', width: RELEASE_RADIUS*2, height: RELEASE_RADIUS*2, borderRadius: RELEASE_RADIUS}} />

                <Player {...this.state} name='CH'/>

            </View>
        );
    }
}



class Player extends Component{
    constructor(props){
        super(props);
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        this.state = {
            pan             : new Animated.ValueXY(),
            position: {top: 0, left: Window.width/2 - PLAYER_RADIUS},
            base: 'home'
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder    : () => true,
            onPanResponderMove              : Animated.event([null,{
                dx  : this.state.pan.x,
                dy  : this.state.pan.y
            }], {}),
            onPanResponderRelease           : (e, gesture) => {
                let playerPosition = this.getPlayerPosition(gesture)
                Animated.spring(
                        this.state.pan,
                        {
                            toValue: playerPosition.base === this.state.base ? {x: 0, y: 0} :
                                {x: playerPosition.position.left - this.state.position.left,
                                y: playerPosition.position.top - this.state.position.top}
                        }
                    ).start(() => {
                    this.state.pan.setValue({x: 0, y: 0})
                    this.setState({
                        base: playerPosition.base,
                        position: playerPosition.position
                    })
                    });

                }
        });
    }

    getPlayerPosition(gesture) {

        if (this.isInBounds(gesture, this.props.firstBasePosition)) {
            return {
                base : 'first',
                position: {left: this.props.firstBasePosition.x - PLAYER_RADIUS,
                    top: this.props.firstBasePosition.y - PLAYER_RADIUS},
            };
        } else if (this.isInBounds(gesture, this.props.secondBasePosition)) {
            return {
                base : 'second',
                position: {left: this.props.secondBasePosition.x - PLAYER_RADIUS,
                    top: this.props.secondBasePosition.y - PLAYER_RADIUS}
            };
        } else if (this.isInBounds(gesture, this.props.thirdBasePosition)) {
            return {
                base : 'third',
                position: {left: this.props.thirdBasePosition.x - PLAYER_RADIUS,
                    top: this.props.thirdBasePosition.y - PLAYER_RADIUS}
            };
        } else if (this.isInBounds(gesture, this.props.homeBasePosition)) {
            return {
                base : 'home',
                position: {left: this.props.homeBasePosition.x - PLAYER_RADIUS,
                    top: this.props.homeBasePosition.y - PLAYER_RADIUS}
            };
        } else {
            return {base: this.state.base, position: this.state.position}
        }
    }

    isInBounds(gesture, base) {
        return (gesture.moveY - base.y) ** 2 + (gesture.moveX - base.x) ** 2 <= RELEASE_RADIUS ** 2;
    }

    componentDidUpdate() {
        if (this.state.position.top === 0 && this.props?.homeBasePosition?.x != null) {
            this.setState({
                position: {top: this.props.homeBasePosition.y  - PLAYER_RADIUS,
                    left: this.props.homeBasePosition.x  - PLAYER_RADIUS}
            })
        }
        console.log('STATE = ')
        console.log(this.state)
    }

    render(){
        return (
            <View style={{...styles.draggableContainer, ...this.state.position}}>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[this.state.pan.getLayout(), styles.circle]}>
                    <Text style={styles.text}>{this.props.name}</Text>
                </Animated.View>
            </View>
        );
    }

}

let RELEASE_RADIUS = 40;
let PLAYER_RADIUS = 30;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1,
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

let FIELD_LENGTH = 200
let BASE_LENGTH=40;
const shapes = StyleSheet.create({
    field: {
        width: FIELD_LENGTH,
        height: FIELD_LENGTH,
        left: Window.width/2 - FIELD_LENGTH/2,
        top : Window.height/2 - FIELD_LENGTH/2,
        backgroundColor: "green",
        transform: [{ rotate: "-45deg" }],
    },
    base: {
        width: BASE_LENGTH,
        height: BASE_LENGTH,
        backgroundColor: "grey",
        position: 'absolute',
        // transform: [{ rotate: "-45deg" }]
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


