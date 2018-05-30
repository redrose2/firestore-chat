import React from 'react';
import { StyleSheet, Text, Image, View, FlatList, RefreshControl } from 'react-native';
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';
import ListItem from './ListItem';

class ListView extends React.PureComponent {

    componentWillReceiveProps(nextProps) {
        this.forceUpdate();
    }

    _keyExtractor = (item, index) => {
        return index;
    };

    renderItem = ({ item, index }) => {
        return (
            <ListItem
                id={index}
                onPressItem={this.props.onPressItem}
                data={item}
            />
        );
    };

    render() {
        return (
            <FlatList
                data={this.props.data}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshing}
                        onRefresh={this.props.onRefresh}
                    />
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ListView;