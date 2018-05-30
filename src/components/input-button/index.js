import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Metrics } from '@theme';

const styles = StyleSheet.create({
    container: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.buttonBackgroundPrimary,
        borderWidth: 2,
        borderColor: Colors.buttonBorder,
        borderRadius: Metrics.buttonHeight / 2
    },
    text: {
        flex: 1,
        padding: 0,
        textAlign: 'center',
        fontSize: Fonts.size.h3,
        color: Colors.buttonText
    },
});

export default class InputButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: props.value
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle ? this.props.containerStyle : {}]}
                disabled={!this.props.selectable}
                onPress={this.props.onPress}
            >
                {this.props.children}
                <TextInput
                    pointerEvents={this.props.editable ? 'auto' : 'none'}
                    style={[styles.text, this.props.textStyle ? this.props.textStyle : {}]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Colors.buttonHintText}
                    editable={!this.props.selectable && this.props.editable}
                    underlineColorAndroid='transparent'
                    autoCapitalize={this.props.autoCapitalize}
                    keyboardType={this.props.keyboardType}
                    onChangeText={(text) => {
                        this.setState({ text });
                        this.props.onChange(text);
                    }}
                    value={this.props.value ? this.props.value : this.state.text}
                />
            </TouchableOpacity>
        );
    }
}

InputButton.defaultProps = {
    editable: true
};
