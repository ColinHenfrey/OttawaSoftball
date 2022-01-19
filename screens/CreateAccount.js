import {Button, TextInput, View} from "react-native";
import styles from "../styles";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";

export default function CreateAccount() {
    const [email, onChangeEmail] = useState(null);
    const [password, onChangePassword] = useState(null);
    const [confirmPassword, onChangeConfirmPassword] = useState(null);
    const [firstName, onChangeFirstName] = useState(null);
    const [lastName, onChangeLastName] = useState(null);
    const { setUserID } = useContext(UserContext);

    const createAccount = async () => {
        try {
            const response = await fetch('http://192.168.1.121:8000/user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'firstName': firstName,
                    'lastName': lastName,
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
            console.log(response.userID)
            setUserID(response.userID)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeFirstName}
                value={firstName}
                placeholder={"First Name"}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeLastName}
                value={lastName}
                placeholder={"Last Name"}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder={"Email"}
                keyboardType='email-address'
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder={"Password"}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeConfirmPassword}
                value={confirmPassword}
                placeholder={"Confirm Password"}
                secureTextEntry={true}
            />
            <Button title='Create Account' onPress={createAccount}/>
        </View>
    );
}

