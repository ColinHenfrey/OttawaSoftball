import {Button, Text, TouchableOpacity} from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
    <TouchableOpacity {...props} style={{...globalStyles.textButton, ...props.style}}>
        <Text style={globalStyles.textButtonText}>{props.title}</Text>
    </TouchableOpacity>
);

