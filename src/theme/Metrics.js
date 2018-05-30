import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
    screenWidth: width,
    screenHeight: height,
    buttonWidth: width * 0.7,
    buttonHeight: height * 0.08,
    defaultPadding: 20,
    defaultMargin: 10
};