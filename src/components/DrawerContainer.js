import React from 'react';
import { StyleSheet, View } from 'react-native';
import MenuButton from '../components/MenuButton';
import AppStyles from '../AppStyles';

export default class DrawerContainer extends React.Component {

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuButton title='Home' source={AppStyles.iconSet.home} onPress={() => { navigation.navigate('HomeStack') }} />
          <MenuButton title='Friends' source={AppStyles.iconSet.friends} onPress={() => { navigation.navigate('FriendsStack') }} />
          <MenuButton title='Search' source={AppStyles.iconSet.search} onPress={() => { navigation.navigate('SearchStack') }} />
          <MenuButton title='Logout' source={AppStyles.iconSet.logout} onPress={() => { navigation.dispatch({ type: 'Logout' }) }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
})

