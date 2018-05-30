import { StyleSheet } from 'react-native';
import Colors from './Colors';
import Fonts from './Fonts';

export default StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyView: {
        width: 0,
        height: 0
    },
    headerButtonText: {
        color: Colors.textPrimary,
        fontSize: Fonts.size.h3,
    },

    header: {
        backgroundColor: Colors.backgroundPrimary
    },
    headerTitleText: {
        color: Colors.textFourth,
        fontSize: Fonts.size.h3,
        fontFamily: 'AvenirLTStd-Medium'
    },
    headerIcon: {
        fontSize: 20,
        color: Colors.textFourth
    },
    tabBarIcon: {
        fontSize: 20
    },
    inputLabel: {
        color: Colors.textThird, 
        fontFamily: 'AvenirLTStd-Medium'
    },
    inputText: {
        color: Colors.textPrimary, 
        fontFamily: 'AvenirLTStd-Medium'
    },
    buttonText: {
        color: Colors.textPrimary,
        fontSize: Fonts.size.h3,
        fontFamily: 'CircularStd-Bold'
    },
    listItemTitle: {
        fontSize: 18,
        fontFamily: 'CircularStd-Medium'
    },
    listItemDesc: {
        fontSize: Fonts.size.h5,
        fontFamily: 'CircularStd-Book',
        color: '#888'
    },
    label: {
        fontFamily: 'CircularStd-Medium',
        color: '#000'
    }
});