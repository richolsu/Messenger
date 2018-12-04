import React from 'react';
import { ScrollView, View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import apiData from '../dummy_data.json';
import ChatIconView from '../components/ChatIconView';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Chats',
        headerLeft:
            <TouchableOpacity style={styles.rightBtncontainer} onPress={() => { navigation.openDrawer() }} >
                <Image style={styles.rightBtnIcon} source={AppStyles.iconSet.menu} />
            </TouchableOpacity>,
        headerRight:
            <TouchableOpacity style={styles.rightBtncontainer} >
                <Image style={styles.rightBtnIcon} source={AppStyles.iconSet.inscription} />
            </TouchableOpacity>
    });

    constructor(props) {
        super(props);
        this.state = {
            friends: apiData.friends,
            chats: apiData.chats,
        }
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

    }

    renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressChat(item)}>
            <View style={styles.chatItemContainer}>
                {/* <FastImage style={styles.chatItemIcon} source={{ uri: item.channel_participation[0].profilePictureURL }} /> */}
                <ChatIconView style={styles.chatItemIcon} channel_participation={item.channel_participation}/>
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
                    containerStyle={styles.searchBarContainer}
                    inputStyle={styles.searchBarInput}
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
    rightBtncontainer: {
        backgroundColor: AppStyles.colorSet.hairlineColor,
        borderRadius: 22.5,
        padding: 10,
        marginLeft: 10,
        marginRight: 10
    },
    rightBtnIcon: {
        tintColor: AppStyles.colorSet.mainThemeForegroundColor,
        width: 25,
        height: 25,
    },
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    searchBarInput: {
        backgroundColor: 'rgba(0.9, 0.9, 0.9, 0.1)',
        borderRadius: 10,
        color: 'black'
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

