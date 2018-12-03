import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AppStyles from '../AppStyles';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.openDrawer() }} >
                <FastImage style={styles.userPhoto} resizeMode={FastImage.resizeMode.cover} source={AppStyles.iconSet.menu} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);        
    }

    
    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>Hi</Text>
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
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);

