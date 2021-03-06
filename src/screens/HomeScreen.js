import React from 'react';
import { ScrollView, View, FlatList, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import apiData from '../dummy_data.json';
import ChatIconView from '../components/ChatIconView';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchModal from '../components/SearchModal';
import CreateGroupModal from '../components/CreateGroupModal';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Chats',
        headerLeft:
            <TouchableOpacity style={AppStyles.styleSet.menuBtn.container} onPress={() => { navigation.openDrawer() }} >
                <Image style={AppStyles.styleSet.menuBtn.icon} source={AppStyles.iconSet.menu} />
            </TouchableOpacity>,
        headerRight:
            <TouchableOpacity style={AppStyles.styleSet.menuBtn.container} onPress={() => navigation.state.params.onCreate()}>
                <Image style={AppStyles.styleSet.menuBtn.icon} source={AppStyles.iconSet.inscription} />
            </TouchableOpacity>
    });

    constructor(props) {
        super(props);
        this.state = {
            searchModalVisible: false,
            createGroupModalVisible: false,
            heAcceptedFriendships: [],
            hiAcceptedFriendships: [],
            friends: [],
            chats: apiData.chats,
            channelParticipations: [],
            channels: [],
        }

        this.heAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user1', '==', this.props.user.id);
        this.heAcceptedFriendshipsUnsubscribe = null;

        this.iAcceptedFriendshipsRef = firebase.firestore().collection('friendships').where('user2', '==', this.props.user.id);
        this.iAcceptedFriendshipsUnsubscribe = null;

        this.channelPaticipationRef = firebase.firestore().collection('channel_participation').where('user', '==', this.props.user.id);
        this.channelPaticipationUnsubscribe = null;

        this.channelsRef = firebase.firestore().collection('channels').orderBy('lastMessageDate', 'desc');
        this.channelsUnsubscribe = null;

    }

    componentDidMount() {

        this.heAcceptedFriendshipsUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(this.onHeAcceptedFriendShipsCollectionUpdate);
        this.iAcceptedFriendshipsUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(this.onIAcceptedFriendShipsCollectionUpdate);
        this.channelPaticipationUnsubscribe = this.channelPaticipationRef.onSnapshot(this.onChannelParticipationCollectionUpdate);
        this.channelsUnsubscribe = this.channelsRef.onSnapshot(this.onChannelCollectionUpdate);

        this.props.navigation.setParams({
            onCreate: this.onCreate
        });
    }

    componentWillUnmount() {
        this.usersUnsubscribe();
        this.heAcceptedFriendshipsUnsubscribe();
        this.iAcceptedFriendshipsUnsubscribe();
        this.channelPaticipationUnsubscribe();
        this.channelsUnsubscribe();
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

    onChannelParticipationCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            user.id = doc.id;

            if (user.id != this.props.user.id) {
                data.push(user);
            }
        });

        const channels = this.state.channels.filter(channel => {
            return data.filter(participation => channel.id == participation.channel).length > 0
        });

        this.setState({
            channels: channels,
            channelParticipations: data,
        });

        if (this.channelsUnsubscribe) {
            this.channelsUnsubscribe();
        }            
        this.channelsUnsubscribe = this.channelsRef.onSnapshot(this.onChannelCollectionUpdate);
    }

    onChannelCollectionUpdate = (querySnapshot) => {
        const data = [];
        const channelPromiseArray = [];
        querySnapshot.forEach((doc) => {
            channelPromiseArray.push(new Promise((channelResolve, channelReject) => {
                const channel = doc.data();
                channel.id = doc.id;
                channel.participants = [];
                const filters = this.state.channelParticipations.filter(item => item.channel == channel.id);
                if (filters.length > 0) {
                    firebase.firestore().collection('channel_participation').where('channel', '==', channel.id).onSnapshot((participationSnapshot) => {
                        const userPromiseArray = [];
                        participationSnapshot.forEach((participationDoc) => {
                            const participation = participationDoc.data();
                            participation.id = participationDoc.id;
                            if (participation.user != this.props.user.id) {
                                userPromiseArray.push(new Promise((userResolve, userReject) => {
                                    firebase.firestore().collection('users').doc(participation.user).get().then((user) => {
                                        const userData = user.data();
                                        userData.id = user.id;
                                        userData.participationId = participation.id;
                                        channel.participants = [...channel.participants, userData];
                                        userResolve();
                                    });
                                }));
                            }
                        });
                        Promise.all(userPromiseArray).then(values => {
                            data.push(channel);
                            channelResolve();
                        });
                    });
                } else {
                    channelResolve();
                }
            }));
            
        });

        Promise.all(channelPromiseArray).then(values => {            
            const sortedData = data.sort((a, b) => {
                return b.lastMessageDate - a.lastMessageDate;
            });

            this.setState({
                channels: sortedData,
            });
        });


    }

    onCreate = () => {
        this.setState({createGroupModalVisible: true});
    }

    onPressFriend = (friend) => {
        const one2OneChannel = this.state.channels.filter(channel => {
            return channel.participants.length == 1 && !channel.name && channel.participants[0].id == friend.id;
        });
        let channel;
        if (one2OneChannel.length > 0) {
            channel = one2OneChannel[0];
        } else {
            channel = {
                name: '',
                id: null,
                participants: [friend],
            };
        }

        this.props.navigation.navigate('Chat', { channel: channel });
    }

    renderFriendItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressFriend(item)}>
            <View style={styles.friendItemContainer}>
                <FastImage style={styles.friendPhoto} source={{ uri: item.profilePictureURL }} />
                <Text style={styles.friendName}>{item.firstName.split(' ')[0]}</Text>
            </View>
        </TouchableOpacity>
    );

    renderFriendSeparator = () => {
        return (<View style={styles.friendDivider} />);
    };

    onPressChat = (chat) => {
        this.props.navigation.navigate('Chat', { channel: chat });
    }

    formatMessage = (item) => {
        if (item.lastMessage.startsWith('https://firebasestorage.googleapis.com')) {
            return 'Someone sent a photo.';
        }else{
            return item.lastMessage;
        }
    }
    renderChatItem = ({ item }) => {
        let title = item.name;
        if (!title) {
            if (item.participants.length > 0) {
                title = item.participants[0].firstName;
            }            
        }
        return (<TouchableOpacity onPress={() => this.onPressChat(item)}>
            <View style={styles.chatItemContainer}>
                <ChatIconView style={styles.chatItemIcon} participants={item.participants} />
                <View style={styles.chatItemContent}>
                    <Text style={styles.chatFriendName}>{title}</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.message}>{this.formatMessage(item)} · {AppStyles.utils.timeFormat(item.lastMessageDate)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>);
    };

    onTapSearch = () => {
        this.setState({searchModalVisible: true});
    }

    onSearchCancel = () => {
        this.setState({ searchModalVisible: false });
    }

    onCreateGroupCancel = () => {
        this.setState({ createGroupModalVisible: false });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={this.onTapSearch}>
                    <View style={styles.searchSection}>
                        <Icon style={styles.searchIcon} name="ios-search" size={15} color={AppStyles.colorSet.inputBgColor} />
                        <Text style={styles.input}>Search</Text>
                    </View>
                </TouchableOpacity>
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
                        data={this.state.channels}
                        renderItem={this.renderChatItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
                {this.state.searchModalVisible &&
                    <SearchModal categories={this.state.categories} onCancel={this.onSearchCancel}></SearchModal>
                }
                {this.state.createGroupModalVisible &&
                    <CreateGroupModal onCancel={this.onCreateGroupCancel}></CreateGroupModal>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.colorSet.grayBgColor,
        margin: 8,
        borderRadius: 8,
    },
    searchIcon: {
        padding: 10,
        paddingRight: 0,
    },
    input: {
        flex: 1,
        padding: 5,
        paddingLeft: 0,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
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
        minHeight: 75,
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
        height: 60,
        borderRadius: 30,
        width: 60,
    },
    friendName: {
        marginTop: 10,
        alignSelf: 'center',
    },
    chats: {
        flex: 1,
        padding: 10,
    },
    chatItemContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    chatItemIcon: {
        height: 70,
        // borderRadius: 45,
        width: 70,
    },
    chatItemContent: {
        flex: 1,
        alignSelf: 'center',
        marginLeft: 10,
    },
    chatFriendName: {
        color: AppStyles.colorSet.mainTextColor,
        fontSize: 17,
    },
    content: {
        flexDirection: 'row',
    },
    message: {
        flex: 2,
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

