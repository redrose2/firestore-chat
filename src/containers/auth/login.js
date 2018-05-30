import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import PopupDialog from 'react-native-popup-dialog';
import store from 'react-native-simple-store';
import { setUser } from '@actions/auth';
import CommonWidgets from '@components/CommonWidgets';
import InputButton from '@components/input-button';
import I18n from '@i18n';
import { Colors, Fonts, Metrics, Styles } from '@theme';
import Utils from '@src/utils';

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cca2: '',
            callingCode: '',
            countryName: '',
            phoneNumber: '',

            codeInput: '',
            confirmResult: null,

            signingIn: false
        };
    }

    componentWillMount() {
        if (this.props.auth.user) {
            this.goToMainScreen();
        } else {
            store.get('loginInfo').then(user => {
                if (user) {
                    this.setState({
                        name: user.name,
                        cca2: user.cca2,
                        callingCode: user.callingCode,
                        phoneNumber: user.phoneNumber,
                        countryName: user.countryName
                    });
                    if (this.refs.phone) {
                        this.refs.phone.onChangePhoneNumber(user.callingCode + user.phoneNumber);
                    }
                } else {
                    let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
                    const userCountryData = getAllCountries()
                        .filter(country => country.cca2 === userLocaleCountryCode)
                        .pop();
                    let cca2, callingCode, countryName;
                    if (!userLocaleCountryCode || !userCountryData) {
                        cca2 = 'US';
                        countryName = 'United States';
                        callingCode = '1'
                    } else {
                        cca2 = userLocaleCountryCode;
                        countryName = userCountryData.name.common;
                        callingCode = userCountryData.callingCode
                    }
                    this.setState({ cca2, callingCode, countryName });
                }
            });
        }
    }

    componentDidMount() {
        this.unsubscribeAuthChange = firebase.auth().onAuthStateChanged((user) => {
            if (!this.unsubscribeAuthChange) return;
            if (user) {
                console.log('user', user);
                this.onRegisterUser({
                    id: user.uid,
                    name: this.state.name,
                    phone: user.phoneNumber
                });
            } else {
                // alert('User has been signed out, reset the state');
                this.setState({
                    codeInput: '',
                    confirmResult: null,
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribeAuthChange) {
            this.unsubscribeAuthChange();
            this.unsubscribeAuthChange = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.user && !this.props.auth.user) {
            this.goToMainScreen();
        }
    }

    goToMainScreen() {
        const navigateAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Main', params: {} }),
            ]
        });
        this.props.navigation.dispatch(navigateAction);

    }

    onSignIn() {
        if (!this.isInputValid()) return;
        this.setState({ signingIn: true });
        let formattedPhoneNumber = '+' + this.state.callingCode + this.state.phoneNumber;
        firebase.auth()
            .signInWithPhoneNumber(formattedPhoneNumber)
            .then(confirmResult => {
                this.setState({ confirmResult });
                console.log('confirmResult', confirmResult);
                if (Platform.OS === 'ios') {
                    this.setState({ signingIn: false });
                    Utils.toast(I18n.t('ALERT_CONFIRMATION_SENT'));
                    this.showConfirmDialog();
                }
            })
            .catch(error => {
                console.log('error', error);
                alert(error.message);
                if (Platform.OS === 'ios') this.setState({ signingIn: false });
            });
        if (Platform.OS === 'ios') return;
        firebase.auth()
            .verifyPhoneNumber(formattedPhoneNumber)
            .on('state_changed', (phoneAuthSnapshot) => {
                this.setState({ signingIn: false });
                switch (phoneAuthSnapshot.state) {
                    //  IOS AND ANDROID EVENTS
                    case firebase.auth.PhoneAuthState.CODE_SENT:
                        console.log('code sent');
                        Utils.toast(I18n.t('ALERT_CONFIRMATION_SENT'));
                        this.showConfirmDialog();
                        break;
                    case firebase.auth.PhoneAuthState.ERROR:
                        console.log('verification error');
                        alert(phoneAuthSnapshot.error);
                        break;

                    // ANDROID ONLY EVENTS
                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
                        console.log('auto verify on android timed out');
                        Utils.toast(phoneAuthSnapshot.state);
                        this.showConfirmDialog();
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                        console.log('auto verified on android', phoneAuthSnapshot);
                        break;
                }
            }, (error) => {
                console.log(error);
                console.log(error.verificationId);
                this.setState({ signingIn: false });
            }, (phoneAuthSnapshot) => {
                console.log(phoneAuthSnapshot);
            });
    }

    showConfirmDialog() {
        if (this.popupDialog) {
            this.popupDialog.show();
        }
    }

    onConfirmCode(codeInput) {
        if (this.state.confirmResult && codeInput.length) {
            this.state.confirmResult.confirm(codeInput)
                .then(user => {
                    this.dismissConfirmDialog();
                    Utils.toast(I18n.t('ALERT_CONFIRMATION_SUCCESS'));
                })
                .catch(error => {
                    alert(error.message)
                });
        }
    }

    dismissConfirmDialog() {
        this.popupDialog.dismiss();
        Keyboard.dismiss();
        this.setState({ codeInput: '' });
    }

    isInputValid() {
        if (!this.state.name) {
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_NAME'));
        } else if (!this.state.phoneNumber) {
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_PHONE'));
        } else if (!this.refs.phone.isValidNumber()) {
            Utils.toast(I18n.t('ALERT_LOGIN_INVALID_PHONE'));
        } else {
            return true;
        }
        return false;
    }

    onRegisterUser(user) {
        let ref = firebase.firestore().collection('users');
        ref.where('phone', '==', user.phone).limit(1).get().then(snapshot => {
            if (snapshot.size > 0) {
                let user = snapshot.docs[0].data();
                console.log('user', user);
                this.saveLoginInfo(user);
            } else if (user.name) {
                ref.doc(`${user.id}`).set(user).then(() => {
                    this.saveLoginInfo(user);
                });
            }
        })
    }

    saveLoginInfo(user) {
        store.save('loginInfo', {
            name: user.name,
            cca2: this.state.cca2,
            callingCode: this.state.callingCode,
            phoneNumber: this.state.phoneNumber,
            countryName: this.state.countryName
        }).then(() => this.props.setUser(user));
    }

    renderVerificationCodeInput() {
        return (
            <View style={styles.dialogContainer}>
                <Text style={styles.dialogTitle}>{I18n.t('ALERT_CONFIRMATION_TITLE')}</Text>
                {CommonWidgets.renderSpacer(0.5)}
                <Text style={styles.dialogMessage}>{I18n.t('ALERT_CONFIRMATION_MESSAGE')}</Text>
                {CommonWidgets.renderSpacer()}
                <View style={styles.dialogInputContainer}>
                    <TextInput
                        keyboardType='numeric'
                        underlineColorAndroid='transparent'
                        style={styles.dialogInputText}
                        maxLength={6}
                        onChangeText={value => this.setState({ codeInput: value })}
                        placeholder={I18n.t('ALERT_CONFIRMATION_INPUT_HINT')}
                        value={this.state.codeInput}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={styles.dialogCancelButton}
                        onPress={() => {
                            this.dismissConfirmDialog();
                        }}
                    >
                        <Text style={styles.dialogCancelText}>{I18n.t('CANCEL')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dialogGoButton}
                        onPress={() => this.onConfirmCode(this.state.codeInput)}
                    >
                        <Text style={styles.dialogGoText}>{I18n.t('GO')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <KeyboardAwareScrollView
                scrollEnabled={false}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={[Styles.fullScreen, Styles.center]}
            >
                <InputButton
                    placeholder={'John Doe'}
                    autoCapitalize='words'
                    onChange={(text) => this.setState({ name: text })}
                    value={this.state.name}
                />
                {CommonWidgets.renderSpacer()}
                <CountryPicker
                    closeable={true}
                    filterable={true}
                    onChange={value => {
                        this.setState({ cca2: value.cca2, callingCode: value.callingCode, countryName: value.name });
                        this.refs.phone.onChangePhoneNumber(value.callingCode + this.state.phoneNumber);
                    }}
                    cca2={this.state.cca2}
                    translation="eng"
                >
                    <InputButton
                        editable={false}
                        textStyle={styles.textInput}
                        value={'+' + this.state.callingCode + ' ' + this.state.countryName}
                    >
                        <PhoneInput
                            ref='phone'
                            flagStyle={{ width: 0, height: 0 }}
                            style={{ width: 0, height: 0 }}
                        />
                    </InputButton>
                </CountryPicker>
                {CommonWidgets.renderSpacer()}
                <InputButton
                    textStyle={styles.textInput}
                    placeholder={'74434241321'}
                    keyboardType='numeric'
                    onChange={(text) => {
                        this.setState({ phoneNumber: text });
                        this.refs.phone.onChangePhoneNumber(this.state.callingCode + text);
                    }}
                    value={this.state.phoneNumber}
                />
                {CommonWidgets.renderSpacer(2)}
                <InputButton
                    editable={false}
                    selectable={true}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                    value={I18n.t('LOGIN_BUTTON')}
                    onPress={() => this.onSignIn()}
                >
                    {this.state.signingIn &&
                        <ActivityIndicator
                            style={styles.indicator}
                            animating={true}
                        />}
                </InputButton>
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    width={Metrics.screenWidth * 0.8}
                    height={Metrics.screenHeight * 0.27}
                    dialogStyle={styles.dialog}
                    containerStyle={styles.dialogWrapper}
                >
                    {this.renderVerificationCodeInput()}
                </PopupDialog>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: Fonts.size.h4
    },
    button: {
        backgroundColor: Colors.buttonBackgroundSecondary
    },
    buttonText: {
        color: 'white'
    },
    indicator: {
        position: 'absolute',
        right: Metrics.defaultPadding
    },
    dialog: {
        borderRadius: 10
    },
    dialogWrapper: {
        zIndex: 10,
        elevation: 10
    },
    dialogContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Metrics.defaultPadding
    },
    dialogTitle: {
        fontSize: Fonts.size.h4
    },
    dialogMessage: {
        fontSize: Fonts.size.h5
    },
    dialogInputContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: Metrics.defaultMargin
    },
    dialogInputText: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.buttonBorder,
        padding: 5
    },
    dialogCancelButton: {
        flex: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eee',
        padding: 10,
        alignItems: 'center'
    },
    dialogCancelText: {
        color: Colors.dialogButtonText1
    },
    dialogGoButton: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#eee',
        padding: 10,
        alignItems: 'center'
    },
    dialogGoText: {
        color: Colors.dialogButtonText2
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
        setUser: (user) => dispatch(setUser(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
