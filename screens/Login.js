import {Button, TextInput, View} from "react-native";
import styles from "../styles";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";

export default function Login({ navigation }) {
    const [email, onChangeEmail] = useState(null);
    const [password, onChangePassword] = useState(null);
    const { setUserID } = useContext(UserContext);

    const login = async () => {
      try {
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
              console.log(err);
            });
          setUserID(JSON.stringify(response.userID))
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder={"Username"}
        />
        <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder={"Password"}
            secureTextEntry={true}
        />
        <Button onPress= {login} title={'Login'}/>
        <Button title='Create account' onPress={() => navigation.navigate('Create Account')}/>
      </View>
    );
}
