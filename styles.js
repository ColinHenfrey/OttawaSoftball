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
        flexDirection: "row",
        justifyContent: 'center',
        padding: 10,
        fontSize: 18,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
        backgroundColor: colors.white
    },
    calenderItem: {
        flexDirection: "row",
        justifyContent: 'center',
        padding: 10,
        fontSize: 18,
        height: 60,
        width: 330,
        marginRight: 20,
        backgroundColor: colors.white,
        borderRadius: 20
    },
    title: {
        fontSize: 20,
        padding: 10,
    }
});
