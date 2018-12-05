import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TextButton from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import apiData from '../dummy_data.json';
import ActionSheet from 'react-native-actionsheet'
import DialogInput from 'react-native-dialog-input';

const MY_ID = '33';

class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.chat.name,
        headerRight:
            <TextButton style={AppStyles.styleSet.rightNavButton} onPress={() => navigation.state.params.onSetting()} >Setting</TextButton>
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const chat = navigation.getParam('chat');

        this.state = {
            isRenameDialogVisible: false,
            chat: chat,
            threads: apiData.threads,
            input: null,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSetting: this.onSetting
        });
    }

    onSettingActionDone = (index) => {
        if (index == 0) {
            this.showRenameDialog(true);
        } else if (index == 1) {
            this.onLeave();
        }
    }

    onConfirmActionDone = (index) => {
        if (index == 0) {
            alert('Leaved');
        }
    }

    onSetting = () => {
        this.settingActionSheet.show();
    }

    onLeave = () => {
        this.confirmLeaveActionSheet.show();
    }

    onPressChat = (chat) => {

    }


    onSend = () => {

    }

    onSelect = () => {

    }

    showRenameDialog = (show) => {
        this.setState({ isRenameDialogVisible: show });
    }

    onChangeName = (text) => {
        const newChat = this.state.chat;
        newChat.name = text;
        this.setState({ chat: newChat });
        this.props.navigation.setParams({
            chat: newChat
        });
        this.showRenameDialog(false);
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
                        placeholder='Start typing...'
                        underlineColorAndroid='transparent' />
                    <TouchableOpacity disabled={true} style={styles.btnContainer} onPress={this.onSend}>
                        <Image style={styles.icon} source={AppStyles.iconSet.share} />
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.settingActionSheet = o}
                    title={'Group Settings'}
                    options={['Rename Group', 'Leave Group', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { this.onSettingActionDone(index) }}
                />
                <ActionSheet
                    ref={o => this.confirmLeaveActionSheet = o}
                    title={'Are you sure?'}
                    options={['Confirm', 'Cancel']}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) => { this.onConfirmActionDone(index) }}
                />
                <DialogInput isDialogVisible={this.state.isRenameDialogVisible}
                    title={'Change Name'}
                    hintInput={this.state.chat.name}
                    textInputProps={{ selectTextOnFocus: true }}
                    submitText={'OK'}
                    submitInput={(inputText) => { this.onChangeName(inputText) }}
                    closeDialog={() => { this.showRenameDialog(false) }}>
                </DialogInput>
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

