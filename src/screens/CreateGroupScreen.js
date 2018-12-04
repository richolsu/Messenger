import React from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import AppStyles from '../AppStyles';
import apiData from '../dummy_data.json';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';

class CreateGroupScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Choose People',
            headerRight:
                <TextButton style={styles.create} onPress={() => navigation.state.params.onCreate()} >Create Group</TextButton>
        }
    };

    constructor(props) {
        super(props);

        const data = apiData.friends.map((item) => {
            item.checked = true;
            return item;
        });
        this.state = {
            users: data
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onCreate: this.onCreate
        });
    }

    onCreate = () => {
        this.props.navigation.navigate('Home');
    }

    onCheck = (friend) => {
        friend.checked = !friend.checked;
    }

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onCheck(item)}>
            <View style={styles.container}>
                <FastImage style={styles.photo} source={{ uri: item.profilePictureURL }} />
                <Text style={styles.name}>{item.firstName}</Text>
                {item.checked &&
                    <Image style={styles.checked} source={AppStyles.iconSet.checked} />
                }
            </View>
        </TouchableOpacity>
    );


    render() {
        return (
            <FlatList
                data={this.state.users}
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
    create: {
        paddingRight: 10,
    },
    checkContainer: {
    },
    checked: {
        width: 30,
        height: 30,
    }

});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(CreateGroupScreen);
