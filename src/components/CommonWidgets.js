import React from 'react';
import { Platform, View, Text, StatusBar, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { Metrics, Styles, Icons, Colors, Fonts, Images } from '@theme/';

const CommonWidgets = {
    renderStatusBar(color = 'black', style = 'light-content', translucent = false) {
        return (
            Platform.OS === 'ios' &&
            <StatusBar
                backgroundColor={color}
                barStyle={style}
                translucent={translucent}
            />
        );
    },
    renderSpacer(count) {
        return (
            <View style={{ height: Metrics.screenHeight / 40 * (count ? count : 1) }} />
        );
    },
    renderBigSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 20 }} />
        );
    },
    renderLargeSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 10 }} />
        );
    },
    renderSmallSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 50 }} />
        );
    },
    renderTinySpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 60 }} />
        );
    },
};
export default CommonWidgets;
