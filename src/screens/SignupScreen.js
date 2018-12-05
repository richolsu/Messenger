import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import AppStyles from '../AppStyles';
import firebase from 'react-native-firebase';

class SignupScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            fullname: 'John smith',
            phone: '111',
            email: 'jhon@gmail.com',
            password: '111111',
        };
    }

    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            this.setState({
                loading: false,
                user,
            });
        });
    }

    componentWillUnmount() {
        this.authSubscription();
    }

    onRegister = () => {
        const { email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
            const { navigation } = this.props;
            user_uid = response.user._user.uid;

            const { fullname, phone, email } = this.state;
            const data = {
                email: email,
                firstName: fullname,
                phone: phone,
                userID: user_uid,
                profilePictureURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTApP6ui5ufiKpyt_K3PjZi0FG7x_GWMK_f6NgoL0EsnWvg0WHa4w',
            };
            firebase.firestore().collection('users').doc(user_uid).set(data);
            firebase.firestore().collection('users').doc(user_uid).get().then(function (user) {
                navigation.dispatch({ type: 'Login', user: user });
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
                <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Full Name" onChangeText={(text) => this.setState({ fullname: text })} value={this.state.fullname} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Phone Number" onChangeText={(text) => this.setState({ phone: text })} value={this.state.phone} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="E-mail Address" onChangeText={(text) => this.setState({ email: text })} value={this.state.email} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })} value={this.state.password} underlineColorAndroid='transparent' />
                </View>
                <Button containerStyle={[styles.facebookContainer, { marginTop: 50 }]} style={styles.facebookText} onPress={() => this.onRegister()}>Sign Up</Button>
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
        width: AppStyles.sizeSet.inputWidth,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: AppStyles.sizeSet.radius
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.colorSet.mainTextColor
    },
    facebookContainer: {
        width: AppStyles.sizeSet.buttonWidth,
        backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
        borderRadius: AppStyles.sizeSet.radius,
        padding: 10,
        marginTop: 30,
    },
    facebookText: {
        color: AppStyles.colorSet.mainThemeBackgroundColor
    },
});

export default SignupScreen;