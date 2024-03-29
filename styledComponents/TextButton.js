import {Button, Text, TouchableOpacity} from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
    <TouchableOpacity {...props} style={{...globalStyles.textButton, ...props.style}}>
        <Text maxFontSizeMultiplier={1} style={{...globalStyles.textButtonText, ...props.textStyle}}>
            {props.title}
        </Text>
    </TouchableOpacity>
);

