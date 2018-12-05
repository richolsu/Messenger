import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import AppStyles from '../AppStyles';
import firebase from 'react-native-firebase';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            email: 'jhon@gmail.com',
            password: '111111',
        };
    }

    onPressLogin = () => {
        const { email, password } = this.state;
        
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            const { navigation } = this.props;
            user_uid = response.user._user.uid;
            firebase.firestore().collection('users').doc(user_uid).get().then(function (user) {
                if (user.exists) {
                    navigation.dispatch({ type: 'Login', user: user });
                } else {
                    alert("user does not exist!");
                }
            }).catch(function (error) {
                const { code, message } = error;
                alert(message);
            });
        }).catch((error) => {
            const { code, message } = error;
            alert(message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="E-mail or phone number" onChangeText={(text) => this.setState({ email: text })} value={this.state.email} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({ password: text })} value={this.state.password} underlineColorAndroid='transparent' />
                </View>
                <Button containerStyle={styles.loginContainer} style={styles.loginText} onPress={() => this.onPressLogin()}>Log in</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: AppStyles.fontSet.xlarge,
        fontWeight: 'bold',
        color: AppStyles.colorSet.mainThemeForegroundColor,
        marginTop: 20,
        marginBottom: 20,
    },
    leftTitle: {
        alignSelf: 'stretch',
        textAlign: 'left',
        marginLeft: 20
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: 'center',
        fontSize: AppStyles.fontSet.middle,
        color: AppStyles.colorSet.mainThemeForegroundColor,
    },
    loginContainer: {
        width: AppStyles.sizeSet.buttonWidth,
        backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
        borderRadius: AppStyles.sizeSet.radius,
        padding: 10,
        marginTop: 30,
    },
    loginText: {
        color: AppStyles.colorSet.mainThemeBackgroundColor
    },
    placeholder: {
        color: 'red'
    },
    InputContainer: {
        width: AppStyles.sizeSet.buttonWidth,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: AppStyles.sizeSet.radius,
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.colorSet.mainTextColor
    }
});

export default LoginScreen;