import { TouchableOpacity, Text } from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
    <TouchableOpacity {...props} style={{...globalStyles.button, ...props.style}}>
        <Text style={globalStyles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
);

