import React from 'react';
import { FlatList, Image, StyleSheet, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TextButton from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';
import ActionSheet from 'react-native-actionsheet'
import DialogInput from 'react-native-dialog-input';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let title = navigation.state.params.channel.name;
        let isOne2OneChannel = false;
        if (!title) {
            isOne2OneChannel = true;
            title = navigation.state.params.channel.participants[0].firstName;
        }
        const options = {
            title: title,
        }
        if (!isOne2OneChannel) {
            options.headerRight = <TextButton style={AppStyles.styleSet.rightNavButton} onPress={() => navigation.state.params.onSetting()} >Settings</TextButton>
        }
        return options;
    };

    constructor(props) {
        super(props);

        const channel = props.navigation.getParam('channel');

        this.state = {
            isRenameDialogVisible: false,
            channel: channel,
            threads: [],
            input: '',
            photo: null,
            downloadUrl: '',
        }

        this.threadsRef = firebase.firestore().collection('channels').doc(channel.id).collection('threads').orderBy('created', 'desc');
        this.threadsUnscribe = null;
    }

    componentDidMount() {
        this.threadsUnscribe = this.threadsRef.onSnapshot(this.onThreadsCollectionUpdate);
        this.props.navigation.setParams({
            onSetting: this.onSetting
        });
    }

    componentWillUnmount() {
        this.threadsUnscribe();
    }

    existSameSentMessage = (messages, newMessage) => {
        for (let i = 0; i < messages.length; i++) {
            const temp = messages[i];
            if (newMessage.senderID == temp.senderID && temp.content == newMessage.content && temp.created == newMessage.created) {
                return true;
            }
        }

        return false;
    }

    onThreadsCollectionUpdate = (querySnapshot) => {

        const data = [];
        querySnapshot.forEach((doc) => {
            const message = doc.data();
            message.id = doc.id;

            if (!this.existSameSentMessage(data, message)) {
                data.push(message);
            }

        });

        this.setState({ threads: data });

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
            firebase.firestore().collection('channel_participation')
                .where('channel', '==', this.state.channel.id)
                .where('user', '==', this.props.user.id)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.delete();
                    });
                    this.props.navigation.goBack(null);
                });
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


    createOne2OneChannel = () => {
        const channelData = {
            creator_id: this.props.user.id,
            name: '',
            lastMessage: this.state.input,
            lastMessageDate: firebase.firestore.FieldValue.serverTimestamp()
        };

        const { id, firstName, profilePictureURL } = this.props.user;

        const that = this;

        firebase.firestore().collection('channels').add(channelData).then(function (docRef) {

            channelData.id = docRef.id;
            channelData.participants = that.state.channel.participants;
            that.setState({ channel: channelData });

            const participationData = {
                channel: docRef.id,
                user: that.props.user.id,
            }
            firebase.firestore().collection('channel_participation').add(participationData);
            let created = Date.now();
            channelData.participants.forEach(friend => {
                const participationData = {
                    channel: docRef.id,
                    user: friend.id,
                }
                firebase.firestore().collection('channel_participation').add(participationData);

                const data = {
                    content: that.state.input,
                    created: created,
                    recipientFirstName: friend.firstName,
                    recipientID: friend.id,
                    recipientLastName: '',
                    recipientProfilePictureURL: friend.profilePictureURL,
                    senderFirstName: firstName,
                    senderID: id,
                    senderLastName: '',
                    senderProfilePictureURL: profilePictureURL,
                    url: that.state.downloadUrl,
                }

                firebase.firestore().collection('channels').doc(channelData.id).collection('threads').add(data).then(function (docRef) {
                    // alert('Successfully sent friend request!');
                }).catch(function (error) {
                    alert(error);
                });

            });

            that.threadsRef = firebase.firestore().collection('channels').doc(channelData.id).collection('threads').orderBy('created', 'desc');
            that.threadsUnscribe = that.threadsRef.onSnapshot(that.onThreadsCollectionUpdate);

            that.setState({ input: '', downloadUrl: '', photo: '' });

        }).catch(function (error) {
            alert(error);
        });

    }

    uploadPromise = () => {
        const uri = this.state.photo;
        return new Promise((resolve, reject) => {
            let filename = uri.substring(uri.lastIndexOf('/') + 1);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            firebase.storage().ref(filename).putFile(uploadUri).then(function (snapshot) {
                resolve(snapshot.downloadURL);
            });
        });
    }

    _send = () => {
        if (!this.state.channel.id) {
            this.createOne2OneChannel();
        } else {
            const { id, firstName, profilePictureURL } = this.props.user;
            let created = Date.now();
            this.state.channel.participants.forEach(friend => {
                const data = {
                    content: this.state.input,
                    created: created,
                    recipientFirstName: friend.firstName,
                    recipientID: friend.id,
                    recipientLastName: '',
                    recipientProfilePictureURL: friend.profilePictureURL,
                    senderFirstName: firstName,
                    senderID: id,
                    senderLastName: '',
                    senderProfilePictureURL: profilePictureURL,
                    url: this.state.downloadUrl,
                }

                firebase.firestore().collection('channels').doc(this.state.channel.id).collection('threads').add(data).then(function (docRef) {
                    // alert('Successfully sent friend request!');
                }).catch(function (error) {
                    alert(error);
                });
            });

            let lastMessage = this.state.downloadUrl;
            if (!lastMessage) {
                lastMessage = this.state.input;
            }

            const channel = { ...this.state.channel };

            delete channel.participants;
            channel.lastMessage = lastMessage;
            channel.lastMessageDate = firebase.firestore.FieldValue.serverTimestamp();

            firebase.firestore().collection('channels').doc(this.state.channel.id).set(channel);
            this.setState({ input: '', downloadUrl: '', photo: '' });
        }
    }

    onSend = () => {
        this._send();
    }

    onSelect = () => {
        const options = {
            title: 'Select a photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        const { id, firstName, profilePictureURL } = this.props.user;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                const data = {
                    content: '',
                    created: Date.now(),
                    senderFirstName: firstName,
                    senderID: id,
                    senderLastName: '',
                    senderProfilePictureURL: profilePictureURL,
                    url: 'http://fake',
                }

                this.setState({
                    photo: response.uri,
                    threads: [data, ...this.state.threads],
                });

                this.uploadPromise().then((url) => {
                    this.setState({ downloadUrl: url });
                    this._send();
                });
            }
        });
    }

    showRenameDialog = (show) => {
        this.setState({ isRenameDialogVisible: show });
    }

    onChangeName = (text) => {

        this.showRenameDialog(false);

        const channel = { ...this.state.channel };
        delete channel.participants;
        channel.name = text;

        firebase.firestore().collection('channels').doc(this.state.channel.id).set(channel).then(() => {
            const newChannel = this.state.channel;
            newChannel.name = text;
            this.setState({ channel: newChannel });
            this.props.navigation.setParams({
                channel: newChannel
            });
        });
    }

    renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressChat(item)}>
            {item.senderID == this.props.user.id &&
                <View style={styles.sendItemContainer}>
                    {item.url != '' &&
                        <View style={[styles.itemContent, styles.sendItemContent, { padding: 0 }]}>
                            <FastImage style={styles.sendPhotoMessage} source={{ uri: item.url }} />
                        </View>
                    }
                    {item.url == '' &&
                        <View style={[styles.itemContent, styles.sendItemContent]}>
                            <Text style={styles.sendTextMessage}>{item.content}</Text>
                        </View>
                    }
                    <FastImage style={styles.userIcon} source={{ uri: item.senderProfilePictureURL }} />
                </View>
            }
            {item.senderID != this.props.user.id &&
                <View style={styles.receiveItemContainer}>
                    <FastImage style={styles.userIcon} source={{ uri: item.senderProfilePictureURL }} />
                    {item.url != '' &&
                        <View style={[styles.itemContent, styles.receiveItemContent, { padding: 0 }]}>
                            <FastImage style={styles.receivePhotoMessage} source={{ uri: item.url }} />
                        </View>
                    }
                    {item.url == '' &&
                        <View style={[styles.itemContent, styles.receiveItemContent]}>
                            <Text style={styles.receiveTextMessage}>{item.content}</Text>
                        </View>
                    }

                </View>
            }
        </TouchableOpacity>
    );

    isDisable = () => {
        return !this.state.input;
    }

    sendBtnStyle = () => {
        const style = { padding: 10 };
        if (this.isDisable()) {
            style.opacity = 0.2;
        } else {
            style.opacity = 1;
        }
        return style;
    }

    render() {
        return (

            <SafeAreaView style={styles.container}>
                <KeyboardAwareView style={styles.chats}>
                    <FlatList
                        inverted
                        vertical
                        showsVerticalScrollIndicator={false}
                        data={this.state.threads}
                        renderItem={this.renderChatItem}
                        keyExtractor={item => `${item.id}`}
                    />

                    <View style={styles.inputBar}>
                        <TouchableOpacity style={styles.btnContainer} onPress={this.onSelect}>
                            <Image style={styles.icon} source={AppStyles.iconSet.camera_filled} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            value={this.state.input}
                            multiline={true}
                            onChangeText={(text) => this.setState({ input: text })}
                            placeholder='Start typing...'
                            underlineColorAndroid='transparent' />
                        <TouchableOpacity disabled={this.isDisable()} style={this.sendBtnStyle()} onPress={this.onSend}>
                            <Image style={styles.icon} source={AppStyles.iconSet.share} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareView>
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
                    hintInput={this.state.channel.name}
                    textInputProps={{ selectTextOnFocus: true }}
                    submitText={'OK'}
                    submitInput={(inputText) => { this.onChangeName(inputText) }}
                    closeDialog={() => { this.showRenameDialog(false) }}>
                </DialogInput>
            </SafeAreaView>
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
        width: 34,
        height: 34,
        borderRadius: 17,
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
    sendPhotoMessage: {
        width: 200,
        height: 150,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    receivePhotoMessage: {
        width: 200,
        height: 150,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    sendTextMessage: {
        fontSize: 16,
        color: AppStyles.colorSet.mainThemeBackgroundColor,
    },
    receiveTextMessage: {
        color: AppStyles.colorSet.mainTextColor,
        fontSize: 16,
    },
    inputBar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: AppStyles.colorSet.hairlineColor,
        flexDirection: 'row',
        marginBottom: 10,
    },
    icon: {
        tintColor: AppStyles.colorSet.mainThemeForegroundColor,
        width: 25,
        height: 25,
    },
    input: {
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        backgroundColor: AppStyles.colorSet.grayBgColor,
        fontSize: 16,
        borderRadius: 20,
    }



});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ChatScreen);

