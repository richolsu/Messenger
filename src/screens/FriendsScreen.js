import React from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from "react-native-elements";
import AppStyles from '../AppStyles';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';

class FriendsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft:
                <TouchableOpacity style={AppStyles.styleSet.menuBtn.container} onPress={() => { navigation.openDrawer() }} >
                    <Image style={AppStyles.styleSet.menuBtn.icon} source={AppStyles.iconSet.menu} />
                </TouchableOpacity>,
            headerTitle:
                <SearchBar
                    containerStyle={AppStyles.styleSet.searchBar.container}
                    inputStyle={AppStyles.styleSet.searchBar.input}
                    showLoading
                    clearIcon={true}
                    searchIcon={true}
                    onChangeText={(text) => params.handleSearch(text)}
                    // onClear={alert('onClear')}
                    placeholder='Search' />,
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            heAcceptedFriendships: [],
            hiAcceptedFriendships: [],
            friends: [],
            keyword: null,
            users: [],
            filteredUsers: []
        };


        this.heAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user1', '==', this.props.user.id);
        this.heAcceptedFriendshipssUnsubscribe = null;

        this.iAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user2', '==', this.props.user.id);
        this.iAcceptedFriendshipssUnsubscribe = null;


    }

    componentDidMount() {
        this.heAcceptedFriendshipssUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(this.onHeAcceptedFriendShipsCollectionUpdate);
        this.iAcceptedFriendshipssUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(this.onIAcceptedFriendShipsCollectionUpdate);

        this.props.navigation.setParams({
            handleSearch: this.onSearch
        });
    }

    componentWillUnmount() {
        this.usersUnsubscribe();
        this.heAcceptedFriendshipssUnsubscribe();
        this.iAcceptedFriendshipssUnsubscribe();
    }

    onUsersCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            user.id = doc.id;

            const friendships_1 = this.state.heAcceptedFriendships.filter(friend => {
                return friend.user2 == user.id;
            });

            const friendships_2 = this.state.iAcceptedFriendships.filter(friend => {
                return friend.user1 == user.id;
            });

            if (friendships_1.length > 0) {
                user.friendshipId = friendships_1[0].id;
                data.push(user);
            } else if (friendships_2.length > 0) {
                user.friendshipId = friendships_2[0].id;
                data.push(user);
            }
        });

        this.setState({
            users: data,
            filteredUsers: data
        });
    }

    onHeAcceptedFriendShipsCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const temp = doc.data();
            temp.id = doc.id;
            data.push(temp);
        });

        this.setState({
            heAcceptedFriendships: data,
        });

        if (this.usersUnsubscribe)
            this.usersUnsubscribe();

        this.usersRef = firebase.firestore().collection('users');
        this.usersUnsubscribe = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);
    }

    onIAcceptedFriendShipsCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const temp = doc.data();
            temp.id = doc.id;
            data.push(temp);
        });

        this.setState({
            iAcceptedFriendships: data,
        });

        if (this.usersUnsubscribe)
            this.usersUnsubscribe();

        this.usersRef = firebase.firestore().collection('users');
        this.usersUnsubscribe = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);
    }

    filteredUsers = (keyword) => {
        if (keyword) {
            return this.state.users.filter(user => {
                return user.firstName.indexOf(keyword) >= 0;
            });
        } else {
            return this.state.users;
        }
    }

    onSearch = (text) => {
        this.setState({ keyword: text });
        const filteredUsers = this.filteredUsers(text);
        this.setState({ filteredUsers: filteredUsers });
    }

    onUnfriend = (item) => {
        firebase.firestore().collection('friendships').doc(item.friendshipId).delete().then(function (docRef) {
            alert('Successfully unfriend');
        }).catch(function (error) {
            alert(error);
        });;
    }

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressUser(item)}>
            <View style={styles.container}>
                <FastImage style={styles.photo} source={{ uri: item.profilePictureURL }} />
                <Text style={styles.name}>{item.firstName}</Text>
                <TextButton style={styles.add} onPress={() => this.onUnfriend(item)} >Unfriend</TextButton>
            </View>
        </TouchableOpacity>
    );


    render() {
        return (
            <FlatList
                data={this.state.filteredUsers}
                renderItem={this.renderItem}
                keyExtractor={item => `${item.id}`}
                initialNumToRender={5}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: AppStyles.colorSet.mainSubtextColor,
    },
    photo: {
        height: 40,
        borderRadius: 20,
        width: 40,
    },
    name: {
        marginLeft: 20,
        alignSelf: 'center',
        flex: 1,
        color: AppStyles.colorSet.mainTextColor,
    },
    add: {
        alignSelf: 'center',
        borderWidth: 0.5,
        borderColor: AppStyles.colorSet.hairlineColor,
        color: AppStyles.colorSet.mainThemeForegroundColor,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        fontWeight: 'normal',
    },
    accept: {
        marginLeft: 10,
        alignSelf: 'center',
        borderWidth: 0.5,
        fontWeight: 'normal',
        color: AppStyles.colorSet.mainThemeForegroundColor,
        borderColor: AppStyles.colorSet.hairlineColor,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
    },
    rightBtncontainer: {
        backgroundColor: AppStyles.colorSet.hairlineColor,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    rightBtnIcon: {
        alignSelf: 'center',
        tintColor: AppStyles.colorSet.mainThemeForegroundColor,
        width: 15,
        height: 15,
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(FriendsScreen);
