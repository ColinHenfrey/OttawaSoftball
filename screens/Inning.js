import {Text, View, StyleSheet, Button} from "react-native";
import styles from "../styles";

export default function Inning({ navigation }) {


    return (
        <View style={styles.container}>
            <View style={shapes.field}>
                <Base position='home'/>
                <Base position='first'/>
                <Base position='second'/>
                <Base position='third'/>
            </View>
        </View>
    )
}

function Base({position}) {

    const getLocation = () => {
        switch (position) {
            case 'first':
                return {bottom: 0, right: 0}
            case 'second':
                return {top: 0, right: 0}
            case 'third':
                return {top: 0, left: 0}
            case 'home':
                return {bottom: 0, left: 0}
            default:
                throw Error('Invalid base position')
        }
    }

    const location = getLocation()
    console.log(location)

    return (
        <View style={{...shapes.base, ...location}} />
    )
}

const shapes = StyleSheet.create({
    field: {
        width: 200,
        height: 200,
        backgroundColor: "red",
        transform: [{ rotate: "-45deg" }],
    },
    base: {
        width: 40,
        height: 40,
        backgroundColor: "blue",
        position: 'absolute',
    },
});
