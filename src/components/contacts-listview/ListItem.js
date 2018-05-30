import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';


class ListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {
        const { id, data, selected } = this.props;

        return (
            <TouchableOpacity
                key={id}
                style={[styles.container, { backgroundColor: selected ? '#cccccc' : 'white' }]}
                onPress={this._onPress}
            >
                <View style={[styles.imageContainer, { backgroundColor: selected ? '#1584fd' : 'transparent' }]}>
                    {selected && <Icon name={'ios-checkmark-outline'} size={imageSize} color={'#cdcdcd'} style={{ backgroundColor: 'transparent' }} />}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.textName}>
                        {data.name}
                    </Text>
                    <View style={styles.phoneContainer}>
                        {data.phoneNumbers.map(item => {
                            return (
                                <Text style={styles.textPhone}>
                                    {item.number}
                                </Text>
                            )
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const imageSize = 30;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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
        marginLeft: Metrics.defaultMargin
    },
    textName: {
        fontSize: Fonts.size.h4
    },
    textPhone: {
        fontSize: Fonts.size.h5
    },
    phoneContainer: {
        marginLeft: Metrics.defaultPadding
    }
});

export default ListItem;