import { Platform } from 'react-native';

const images = {
    imgPattern: Platform.select({
        android: require('@assets/images/pattern.png'),
        ios: require('@assets/images/pattern_ios.png')
    }),
    logoFront: require('@assets/images/logo_front.png'),
    logoBack: require('@assets/images/logo_back.png'),
};

export default images;
