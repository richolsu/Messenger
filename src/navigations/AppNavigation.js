import { Animated, Easing, StyleSheet } from 'react-native';
import { createStackNavigator, DrawerNavigator } from 'react-navigation';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import DrawerContainer from '../components/DrawerContainer';
import ChatScreen from '../screens/ChatScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SearchScreen from '../screens/SearchScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const noTransitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
    }
})

const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
);

// login stack
const LoginStack = createStackNavigator({
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Welcome: { screen: WelcomeScreen }
}, {
        initialRouteName: 'Welcome',
        headerMode: 'float',
        navigationOptions: ({ navigation }) => ({
            headerTintColor: AppStyles.colorSet.mainThemeForegroundColor,
            headerTitleStyle: styles.headerTitleStyle,
        }),
        cardStyle: { backgroundColor: '#FFFFFF' },
    }
);


const HomeStack = createStackNavigator({
    Home: { screen: HomeScreen },
    Chat: { screen: ChatScreen },
    CreateGroup: { screen: CreateGroupScreen },
    Friends: { screen: HomeScreen },
    Search: { screen: SearchScreen },
}, {
        initialRouteName: 'CreateGroup',
        headerMode: 'float',

        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            headerTintColor: AppStyles.colorSet.mainThemeForegroundColor,
            headerTitleStyle: styles.headerTitleStyle,
        }),
        cardStyle: { backgroundColor: '#FFFFFF' },
    }
);


// drawer stack
const DrawerStack = DrawerNavigator({
    HomeStack: HomeStack
}, {
        drawerPosition: 'left',
        initialRouteName: 'HomeStack',
        drawerWidth: 200,
        contentComponent: DrawerContainer
    })

// Manifest of possible screens
const RootNavigator = createStackNavigator({
    LoginStack: { screen: LoginStack },
    DrawerStack: { screen: DrawerStack }
}, {
        // Default config for all screens
        headerMode: 'none',
        initialRouteName: 'DrawerStack',
        transitionConfig: noTransitionConfig,
        navigationOptions: ({ navigation }) => ({
            color: 'black',
        })
    })

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

const styles = StyleSheet.create({
    headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        color: 'black',
        flex: 1,
    },
})

export { RootNavigator, AppNavigator, middleware };
