import { Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const _colorSet = {
  mainThemeBackgroundColor : 'white',
  mainThemeForegroundColor : '#3068CC',
  mainTextColor : '#000000',
  mainSubtextColor : '#7e7e7e',
  hairlineColor: '#d6d6d6',
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
  friends: require('../assets/icons/friends-icon.png'),
  inscription: require('../assets/icons/inscription-icon.png'),
  menu: require('../assets/icons/menu.png'),
  private_chat: require('../assets/icons/private-chat-icon.png'),
  search: require('../assets/icons/search-icon.png'),
  share: require('../assets/icons/share-icon.png'),
  // defaultUser: require('../assets/icons/default_user.jpg'),
  logout: require('../assets/icons/shutdown.png'),
}

const StyleDict = {
  colorSet: _colorSet,
  iconSet: _iconSet,
  sizeSet: _sizeSet,
  fontSet: _fontSet,
  windowW: WINDOW_WIDTH,
  windowH: WINDOW_HEIGHT,
};

export default StyleDict;

