import {StyleSheet} from "react-native";
import colors from "../colors"

export default StyleSheet.create({
    text: {
        color: colors.primaryText,
        padding: 2,
    },
    textInput: {
        backgroundColor: colors.light,
        width: '80%',
        height: 30,
        borderRadius: 20
    }
});
