import { Text } from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
        <Text {...props} style={{...globalStyles.text, ...props.style}}>{props.children}</Text>
    );

