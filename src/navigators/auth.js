import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import LoginScreen from '@containers/auth/login';

const AuthNavigator = StackNavigator(
    {
        Login: { screen: LoginScreen },
    },
    {
        headerMode: 'none'
    }
);

export default AuthNavigator;