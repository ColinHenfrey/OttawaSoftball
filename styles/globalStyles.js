import {StyleSheet} from "react-native";
import colors from "../colors"

export default StyleSheet.create({
    text: {
        color: colors.primaryText,
        padding: 2,
        fontSize: 16,
        textAlign: 'center'
    },
    textInput: {
        backgroundColor: colors.light,
        width: '80%',
        height: 40,
        borderRadius: 10,
        margin: 4,
        paddingLeft: 20
    },
    button: {
        backgroundColor: colors.primary,
        width: '80%',
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    buttonText: {
        color: colors.white
    },
    textButton: {
        color: colors.primaryText,
        padding: 2,
        fontSize: 18
    },
    textButtonText: {
        color: colors.primaryText,
        textDecorationLine: 'underline',
    }
});
