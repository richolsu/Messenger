import React from 'react';
import { ScrollView, View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import apiData from '../dummy_data.json';
import ChatIconView from '../components/ChatIconView';
import firebase from 'react-native-firebase';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Chats',
        headerLeft:
            <TouchableOpacity style={AppStyles.styleSet.menuBtn.container} onPress={() => { navigation.openDrawer() }} >
                <Image style={AppStyles.styleSet.menuBtn.icon} source={AppStyles.iconSet.menu} />
            </TouchableOpacity>,
        headerRight:
            <TouchableOpacity style={styles.rightBtncontainer} onPress={() => navigation.state.params.onCreate()}>
                <Image style={styles.rightBtnIcon} source={AppStyles.iconSet.inscription} />
            </TouchableOpacity>
    });

    constructor(props) {
        super(props);
        this.state = {
            heAcceptedFriendships: [],
            hiAcceptedFriendships: [],
            friends: [],
            chats: apiData.chats,
        }

        this.heAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user1', '==', this.props.user.id);
        this.heAcceptedFriendshipssUnsubscribe = null;

        this.iAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user2', '==', this.props.user.id);
        this.iAcceptedFriendshipssUnsubscribe = null;

    }

    componentDidMount() {

        this.heAcceptedFriendshipssUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(this.onHeAcceptedFriendShipsCollectionUpdate);
        this.iAcceptedFriendshipssUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(this.onIAcceptedFriendShipsCollectionUpdate);

        this.props.navigation.setParams({
            onCreate: this.onCreate
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
            friends: data,
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

    onCreate = () => {
        this.props.navigation.navigate('CreateGroup');
    }

    onPressFriend = (friend) => {

    }

    renderFriendItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressFriend(item)}>
            <View style={styles.friendItemContainer}>
                <FastImage style={styles.friendPhoto} source={{ uri: item.profilePictureURL }} />
                <Text style={styles.friendName}>{item.firstName}</Text>
            </View>
        </TouchableOpacity>
    );

    renderFriendSeparator = () => {
        return (<View style={styles.friendDivider} />);
    };

    onPressChat = (chat) => {
        this.props.navigation.navigate('Chat', { chat: chat });
    }

    renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressChat(item)}>
            <View style={styles.chatItemContainer}>
                <ChatIconView style={styles.chatItemIcon} channel_participation={item.channel_participation} />
                <View style={styles.chatItemContent}>
                    <Text style={styles.chatFriendName}>{item.name}</Text>
                    <View style={styles.content}>
                        <Text style={styles.message}>{item.lastMesssage}</Text>
                        <Text style={styles.time}> • {item.lastMessageDate}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    onTapSearch() {
        alert("search");
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <SearchBar
                    containerStyle={AppStyles.styleSet.searchBar.container}
                    inputStyle={AppStyles.styleSet.searchBar.input}
                    showLoading
                    clearIcon={false}
                    searchIcon={true}
                    placeholder='Search' />

                <View style={styles.friends}>
                    <FlatList
                        horizontal={true}
                        initialNumToRender={4}
                        ItemSeparatorComponent={this.renderFriendSeparator}
                        data={this.state.friends}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this.renderFriendItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
                <View style={styles.chats}>
                    <FlatList
                        vertical
                        showsVerticalScrollIndicator={false}
                        data={this.state.chats}
                        renderItem={this.renderChatItem}
                        keyExtractor={item => `${item.channelID}`}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    userPhoto: {
        width: 40,
        height: 40,
        marginLeft: 5,
    },
    friends: {
        padding: 10,
    },
    friendDivider: {
        width: 30,
        height: "100%",
    },
    friendItemContainer: {
        alignItems: 'center',
    },
    friendPhoto: {
        height: 80,
        borderRadius: 40,
        width: 80,
    },
    friendName: {
        marginTop: 10,
        alignSelf: 'center',
    },
    chats: {
        padding: 10,
    },
    chatItemContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    chatItemIcon: {
        height: 90,
        // borderRadius: 45,
        width: 90,
    },
    chatItemContent: {
        alignSelf: 'center',
        marginLeft: 10,
    },
    chatFriendName: {
        color: AppStyles.colorSet.mainTextColor,
        fontSize: AppStyles.fontSet.middle,
    },
    content: {
        flexDirection: 'row',
    },
    message: {
        color: AppStyles.colorSet.mainSubtextColor
    },
    time: {
        marginLeft: 5,
        color: AppStyles.colorSet.mainSubtextColor
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);

