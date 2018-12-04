import React from 'react';
import { ScrollView, View, FlatList, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import ChatIconView from '../components/ChatIconView';
import apiData from '../dummy_data.json';

const MY_ID = '33';

class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.chat.name,
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const chat = navigation.getParam('chat');

        this.state = {
            chat: chat,
            threads: apiData.threads,
            input: null,
        }
    }



    onPressChat = (chat) => {

    }

    renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressChat(item)}>
            {item.senderID == MY_ID &&
                <View style={styles.sendItemContainer}>
                    <View style={[styles.itemContent, styles.sendItemContent]}>
                        <Text style={styles.sendTextMessage}>{item.content}</Text>
                    </View>
                    <FastImage style={styles.userIcon} source={{ uri: item.senderProfilePictureURL }} />
                </View>
            }
            {item.senderID != MY_ID &&
                <View style={styles.receiveItemContainer}>
                    <FastImage style={styles.userIcon} source={{ uri: item.senderProfilePictureURL }} />
                    <View style={[styles.itemContent, styles.receiveItemContent]}>
                        <Text style={styles.receiveTextMessage}>{item.content}</Text>
                    </View>
                </View>
            }
        </TouchableOpacity>
    );


    onSend = () => {

    }

    onSelect = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.chats}>
                    <FlatList
                        vertical
                        showsVerticalScrollIndicator={false}
                        data={this.state.threads}
                        renderItem={this.renderChatItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.btnContainer} onPress={this.onSelect}>
                        <Image style={styles.icon} source={AppStyles.iconSet.camera_filled} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ input: text })}
                        placeholder="Start typing..."
                        underlineColorAndroid='transparent' />
                    <TouchableOpacity disabled={true} style={styles.btnContainer} onPress={this.onSend}>
                        <Image style={styles.icon} source={AppStyles.iconSet.share} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    chats: {
        padding: 10,
        flex: 1,
    },
    itemContent: {
        padding: 10,
        backgroundColor: AppStyles.colorSet.hairlineColor,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        maxWidth: '70%',
    },
    sendItemContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        marginBottom: 10,
    },
    userIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    sendItemContent: {
        marginRight: 10,
        backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
    },
    receiveItemContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
    },
    receiveItemContent: {
        marginLeft: 10,
    },
    sendTextMessage: {
        color: AppStyles.colorSet.mainThemeBackgroundColor,
    },
    receiveTextMessage: {
        color: AppStyles.colorSet.mainTextColor,
    },
    inputBar: {
        borderTopWidth: 2,
        borderTopColor: AppStyles.colorSet.hairlineColor,
        flexDirection: 'row',
    },
    btnContainer: {
        padding: 10,
    },
    icon: {
        tintColor: AppStyles.colorSet.mainThemeForegroundColor,
        width: 25,
        height: 25,
    },
    input: {
        flex: 1,
    }



});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ChatScreen);

