import {StyleSheet} from "react-native";
import colors from "../colors"

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
        margin: 5,
        fontSize: 18,
        height: 100,
        width: 330,
        marginRight: 20,
        backgroundColor: colors.white,
        borderRadius: 20
    },
    title: {
        fontSize: 20,
        padding: 10,
    },
    calenderItemTime: {
        fontWeight: 'bold',
    },
    dateBubbleContainer: {
        borderRadius: 100,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: 80,
        color: colors.white
    },
    dateBubbleDay: {
        fontSize: 30,
        padding: 0
    },
    dateBubbleMonth: {
        fontSize: 15,
        padding:0
    }
});
