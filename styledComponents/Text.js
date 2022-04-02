import { Text } from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
        <Text {...props} defaultProps={{...Text.defaultProps, maxFontSizeMultiplier: 1}} style={{...globalStyles.text, ...props.style}}>{props.children}</Text>
    );

