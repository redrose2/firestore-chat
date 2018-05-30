import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, FlatList } from 'react-native';
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';
import ListItem from './ListItem';

class SelectableListView extends React.PureComponent {

    state = { selected: (new Map(): Map<string, boolean>) };

    getFilteredData = () => {
        let filteredData = [];
        this.props.data.forEach((item, index) => {
            if (this.state.selected.get(index)) {
                filteredData.push(item);
            }
        });
        return filteredData;
    };

    _keyExtractor = (item, index) => {
        return index;
    };

    _onPressItem = (id: string) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return { selected };
        });
    };

    renderItem = ({ item, index }) => {
        return (
            <ListItem
                id={index}
                onPressItem={this._onPressItem}
                selected={!!this.state.selected.get(index)}
                data={item}
            />
        );
    };

    render() {
        return (
            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SelectableListView;