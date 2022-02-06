import {StyleSheet} from "react-native";
import colors from "react-native/Libraries/NewAppScreen/components/Colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 5,
        width: 200,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
    error: {
        color: 'red',
        fontWeight: 'bold'
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
