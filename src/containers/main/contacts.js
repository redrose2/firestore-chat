import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import firebase from 'react-native-firebase';
import Permissions from 'react-native-permissions';
import SelectableListView from '@components/contacts-listview';
import I18n from '@i18n';
import Utils from "@src/utils";
import { Styles, Colors, Fonts, Global, Images, Metrics, Icons } from '@theme';

class ContactsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            loading: false,
        };
    }

    componentWillMount() {
        this.getContacts();
    }

    componentDidMount() {
        this.props.navigation.setParams({ done: this.onPress });
    }

    getContacts() {
        Contacts.getAll((err, addresses) => {
            if (err === 'denied') {
                Utils.toast('Access is denied');
                Alert.alert(
                    I18n.t('APP_NAME'),
                    I18n.t('ALERT_CONTACT_PERMISSION_HELP'),
                    [
                        { text: I18n.t('CANCEL'), style: 'cancel' },
                        { text: I18n.t('OPEN_SETTINGS'), onPress: Permissions.openSettings }
                    ]
                )
            } else {
                let contacts = [];
                addresses.forEach(item => {
                    let contact = {
                        name: item.givenName,
                        phoneNumbers: item.phoneNumbers,
                    };
                    contacts.push(contact);
                });
                this.setState({ contacts });
            }
        });
    }

    onPress = () => {
        if (this.state.loading) {
            return;
        }
        let filteredData = this.refs.listView.getFilteredData();
        if (filteredData.length) {
            this.setState({ loading: true });
            this.createRoom(filteredData);
        } else {
            Utils.toast(I18n.t('ALERT_CONTACT_EMPTY_SELECTED'))
        }
    };

    createRoom(data) {
        let refContacts = firebase.firestore().collection('contacts');
        let room_id = Date.now();
        data.push({
            name: this.props.auth.user.name,
            phoneNumbers: [{ number: this.props.auth.user.phone }]
        });
        let roomName = this.props.auth.user.name;
        data.forEach(item => {
            if (item.name !== this.props.auth.user.name) {
                roomName = roomName + ', ' + item.name;
            }
            item.phoneNumbers.forEach((phone, index) => {
                let formattedPhoneNumber = Utils.formattedPhoneNumber(phone.number);
                if (index > 0 && formattedPhoneNumber === this.props.auth.user.phone) return;
                refContacts.add({
                    user_id: formattedPhoneNumber,
                    room_id: room_id,
                }).then(response => {

                }).catch(error => {
                    alert(error)
                });
            });
        });
        let refRoom = firebase.firestore().collection('rooms');
        refRoom.doc(`${room_id}`).set({
            name: roomName,
            creator: {
                id: this.props.auth.user.id,
                name: this.props.auth.user.name,
            },
            updated_at: room_id,
        }).then(response => {
            this.setState({ loading: false });
            this.props.navigation.state.params.refresh();
            this.props.navigation.goBack();
        }).catch(error => {
            alert(error);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SelectableListView
                    ref='listView'
                    data={this.state.contacts}
                />
                {this.state.loading && <ActivityIndicator style={styles.loading} size={'large'} animating={true} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);