import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';


class ListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.data);
    };

    render() {
        const { id, data } = this.props;

        return (
            <TouchableOpacity
                key={id}
                style={styles.container}
                onPress={this._onPress}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.textName} numberOfLines={1}>
                        {data.name}
                    </Text>
                    <Text style={styles.textMessage} numberOfLines={2}>
                        {data.last_message}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const imageSize = 30;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: Metrics.defaultMargin,
        marginTop: 1,
        alignItems: 'center'
    },
    imageContainer: {
        width: imageSize,
        height: imageSize,
        borderRadius: imageSize / 2,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        marginHorizontal: Metrics.defaultMargin,
        alignItems: 'center'
    },
    textContainer: {
        height: Metrics.screenHeight * 0.1,
        marginLeft: Metrics.defaultMargin,
        justifyContent: 'center'
    },
    textName: {
        fontSize: Fonts.size.h4,
        color: '#1584fd'
    },
    textMessage: {
        fontSize: Fonts.size.h5,
        marginTop: 5
    },
});

export default ListItem;