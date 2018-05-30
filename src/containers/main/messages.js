import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import I18n from 'react-native-i18n';
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';

class MessagesScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: props.user ? props.user : {},

            messages: [],
            hasReceivedNewMessage: false,
            refreshCount: 1,
            refreshing: true,
            loadEarlier: false,
        };
        this.room = props.navigation.state.params.room;
        this.ref = firebase.firestore().collection('rooms').doc(`${this.room.id}`);
    }

    componentDidMount() {
        this.fetchMessages();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    fetchMessages() {
        this.unsubscribe = this.ref.collection('messages').onSnapshot(snapshot => {
            if (snapshot.size > 0) {
                let messages = [];
                snapshot.forEach(doc => {
                    messages.unshift({ ...doc.data(), postID: doc.id })
                });
                this.setState({ messages, refreshing: false });
            }
        });
    }

    onSend(messages) {
        this.ref.collection('messages').doc(`${Date.now()}`).set(messages[0]);
        this.ref.update({
            last_message: messages[0].text,
            updated_at: new Date()
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    isAnimated={true}
                    isLoadingEarlier={this.state.refreshing}
                    keyboardShouldPersistTaps={'never'}
                    loadEarlier={this.state.loadEarlier}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    placeholder={I18n.t('MESSAGE_INPUT_PLACEHOLDER')}
                    showUserAvatar={true}
                    user={{
                        _id: this.props.auth.user.id,
                        name: this.props.auth.user.name,
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

function mapStateToProps(state) {
    return {
        auth: state.auth,
        global: state.global
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
