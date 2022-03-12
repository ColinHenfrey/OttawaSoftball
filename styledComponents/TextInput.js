import { TextInput } from 'react-native';
import globalStyles from "../styles/globalStyles";

export default (props) => (
        <TextInput {...props} style={{...globalStyles.textInput, ...props.style}}>{props.children}</TextInput>
    );

