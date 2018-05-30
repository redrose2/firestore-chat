import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from "react-navigation";
import firebase from 'react-native-firebase';
import { logout } from '@actions/auth';
import { setRoomList } from '@actions/global';
import ListView from '@components/rooms-listview';
import I18n from '@i18n';
import Utils from "@src/utils";
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';

class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            rooms: props.global.roomList
        };
        this.unsubscribe = {};
    }

    componentDidMount() {
        this.onRefresh();
        setTimeout(() => {
            this.props.navigation.setParams({ logout: this.logout, refresh: this.onRefresh });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.user === null) {
            this.goToAuthScreen();
        }
    }

    componentWillUnmount() {
        for (let id in this.unsubscribe) {
            this.unsubscribe[`${id}`]();
        }
    }

    logout = () => {
        Alert.alert(
            I18n.t('APP_NAME'),
            I18n.t('ALERT_LOGOUT_CONFIRM'),
            [
                {
                    text: I18n.t('OK'),
                    onPress: this.doSignOut
                },
                { text: I18n.t('CANCEL'), style: 'cancel' }
            ],
            { cancelable: false }
        );
    };

    doSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                if (this.props.auth.user) {
                    this.props.logout();
                } else {
                    this.goToAuthScreen();
                }
            })
            .catch(error => {
                alert(error.message);
                if (this.props.auth.user) {
                    this.props.logout();
                } else {
                    this.goToAuthScreen();
                }
            });
    };

    goToAuthScreen() {
        const navigateAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Auth', params: {} }),
            ]
        });
        this.props.navigation.dispatch(navigateAction);
    }

    getContacts() {
        const refContact = firebase.firestore().collection('contacts');
        refContact.where('user_id', '==', this.props.auth.user.phone)
            .get()
            .then(snapshot => {
                this.fetchRooms(snapshot);
            });
    }

    fetchRooms(querySnapshot) {
        if (querySnapshot.size > 0) {
            let rooms = [];
            let new_ids = [];
            querySnapshot.forEach(doc => new_ids.push(doc.data().room_id));
            new_ids = new_ids.sort((a, b) => a < b ? 1 : -1);
            new_ids.forEach((id, index) => {
                if (this.unsubscribe && this.unsubscribe[`${id}`]) {
                    this.unsubscribe[`${id}`]();
                }
                this.unsubscribe[`${id}`] = firebase.firestore()
                    .collection('rooms')
                    .doc(`${id}`)
                    .onSnapshot(snapshot => {
                        const data = { ...snapshot.data(), id };
                        if (rooms[index]) {
                            rooms[index] = data;
                        } else {
                            rooms.push(data);
                        }
                        this.setState({ rooms });
                    });
            });
        }
        this.setState({ refreshing: false });
    }

    onPressItem = (room) => {
        this.props.navigation.navigate('Messages', { room });
    };

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getContacts();
    };

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    ref='listView'
                    data={this.state.rooms}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    onPressItem={this.onPressItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        global: state.global
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        logout: () => dispatch(logout()),
        setRoomList: (roomList) => dispatch(setRoomList(roomList)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);