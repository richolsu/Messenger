import { Dimensions, Platform } from 'react-native';
import moment from 'moment';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const _colorSet = {
  mainThemeBackgroundColor: 'white',
  mainThemeForegroundColor: '#3068CC',
  mainTextColor: '#000000',
  mainSubtextColor: '#7e7e7e',
  hairlineColor: '#d6d6d6',
  grayBgColor: '#f5f5f5',
  onlineMarkColor: '#41C61B',
  inputBgColor: 'rgba(0.9, 0.9, 0.9, 0.1)',
};

const _fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
};

const _sizeSet = {
  buttonWidth: '70%',
  inputWidth: '80%',
  radius: 25,
}

const _iconSet = {
  home: require('../assets/icons/home-icon.png'),
  add_user: require('../assets/icons/add-user-icon.png'),
  add_user_filled: require('../assets/icons/add-user-icon-filled.png'),
  camera_filled: require('../assets/icons/camera-filled-icon.png'),
  camera: require('../assets/icons/camera-icon.png'),
  chat: require('../assets/icons/chat-icon.png'),
  close: require('../assets/icons/close-x-icon.png'),
  checked: require('../assets/icons/checked-icon.png'),
  delete: require('../assets/icons/delete.png'),
  friends: require('../assets/icons/friends-icon.png'),
  inscription: require('../assets/icons/inscription-icon.png'),
  menu: require('../assets/icons/menu.png'),
  private_chat: require('../assets/icons/private-chat-icon.png'),
  search: require('../assets/icons/search-icon.png'),
  share: require('../assets/icons/share-icon.png'),
  // defaultUser: require('../assets/icons/default_user.jpg'),
  logout: require('../assets/icons/shutdown.png'),
}

const _styleSet = {
  menuBtn: {
    container: {
      backgroundColor: _colorSet.grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10
    },
    icon: {
      tintColor: 'black',
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1
    },
    input: {
      backgroundColor: _colorSet.inputBgColor,
      borderRadius: 10,
      color: 'black'
    }
  },
  rightNavButton: {
    marginRight: 10,
  }

}

const _functions = {
  timeFormat: (timeStamp) => {
    time = "";
    if (timeStamp) {
      if (moment().diff(timeStamp, 'days') == 0) {
        time = moment(timeStamp).format('H:mm');
      } else {
        time = moment(timeStamp).fromNow();
      }
      
    }
    // time = postTime.toUTCString();
    return time;
  }
}


const StyleDict = {
  colorSet: _colorSet,
  iconSet: _iconSet,
  sizeSet: _sizeSet,
  fontSet: _fontSet,
  styleSet: _styleSet,
  windowW: WINDOW_WIDTH,
  windowH: WINDOW_HEIGHT,
  utils: _functions,
};

export default StyleDict;

