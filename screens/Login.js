import {TouchableOpacity, View} from "react-native";
import styles from "../styles/styles";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";
import TextInput from '../styledComponents/TextInput'
import Button from '../styledComponents/Button'
import Text from '../styledComponents/Text'
import TextButton from "../styledComponents/TextButton";

export default function Login({ navigation }) {
    const [email, onChangeEmail] = useState(null);
    const [password, onChangePassword] = useState(null);
    const [message, setMessage] = useState(null);
    const { userInfo, setUserInfo } = useContext(UserContext);

    const login = async () => {
      try {
        setMessage(null)
        const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': password
            })
        }).then(res => {
              if(!res.ok) {
                return res.text().then(text => { throw new Error(text) })
              }
              else {
                return res.json();
              }
            })
            .catch(err => {
              console.log(err['message']);
              setMessage(err.message)
            });
        if (response?.userID) {
            console.log(response)
            setUserInfo({...userInfo, userID: JSON.stringify(response?.userID)})
        }
          console.log(response)
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <View style={{...styles.container, justifyContent: 'flex-start'}}>
          <Text style={styles.title}>Welcome to Ottawa Softball</Text>
          <Text>Login below or create an account</Text>
        <TextInput
            onChangeText={onChangeEmail}
            value={email}
            placeholder={"Username"}
        />
        <TextInput
            onChangeText={onChangePassword}
            value={password}
            placeholder={"Password"}
            secureTextEntry={true}
        />
          {message && <Text style={styles.error}>{message}</Text>}
        <Button onPress= {login} title={'Login'} />
        <TextButton title='Create account' onPress={() => navigation.navigate('Create Account')}/>
      </View>
    );
}
