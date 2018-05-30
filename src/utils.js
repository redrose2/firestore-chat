import { Platform, ToastAndroid, Alert } from 'react-native';
import I18n from 'react-native-i18n';
import Toast from 'react-native-simple-toast';
import { Metrics, Styles, Images, Colors, Fonts } from '@theme/';

const Utils = {
    getUri(uriString) {
        let retUri;
        if (Platform.OS === 'android') {
            retUri = { uri: uriString, isStatic: true };
        } else {
            retUri = { uri: uriString.replace('file://', ''), isStatic: true };
        }
        return retUri.uri;
    },
    getTextInputBorderColor(state) {
        return state ? Colors.borderFocused : Colors.borderSecondary;
    },
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    clone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    getFullName(firstName, lastName) {
        return firstName + ' ' + lastName
    },
    getTimezoneOffset() {
        return new Date().getTimezoneOffset() / 60;
    },
    getTimeDifferenceAsString(date1, date2) {
        let diff = (date2 - date1) / (1000 * 60);
        let diffDate = Math.round(diff / (60 * 24));
        diff = diff % (60 * 24);
        let diffHour = Math.round(diff / 60);
        let diffMin = Math.round(diff % 60);
        if (diffDate) {
            return diffDate + (diffDate > 1 ? ' days' : ' day');
        } else if (diffHour) {
            return diffHour + (diffHour > 1 ? ' hours' : ' hour');
        } else {
            return diffMin + (diffMin > 1 ? ' minutes' : ' minute');
        }
    },
    getTimezoneOffset() {
        return new Date().getTimezoneOffset() / 60;
    },
    getStringFromDate(date) {
        const month = (date.getMonth() + 1);
        const day = date.getDate();
        const year = date.getFullYear();
        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;
        return day + '/' + month + '/' + year;
    },
    getAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    todayOrYesterday(date) {
        const today = new Date();
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
        if (isToday) return 0;
        if (isYesterday) return 1;
        return 2;
    },
    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    },
    formattedBinary(value, length) {
        if (!value) value = 0;
        value = value.toString(2);
        let tmp = '';
        for (let i = 0; i < length; i++) {
            tmp += '0';
        }
        return (tmp + value).substr(value.length);
    },
    getAge(birthday) {
        let ageDifMs = Date.now() - birthday.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
    toast(message) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Toast.show(message);
        }
    },
    formattedPhoneNumber(phoneNumber) {
        if (!phoneNumber) return '';
        let tmp = phoneNumber.trim();
        if ((phoneNumber.indexOf('*') === -1) && (phoneNumber.indexOf('#')) === -1 && tmp.charAt(0) !== '+') {
            tmp = '+' + tmp;
        }
        return tmp.replace(/ /g, '').replace(/-/g, '');
    }
};

export default Utils;
