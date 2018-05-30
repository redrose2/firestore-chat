import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import AuthNavigator from './auth';
import MainNavigator from './main';

const RootNavigator = StackNavigator(
    {
        Auth: { screen: AuthNavigator },
        Main: { screen: MainNavigator }
    },
    {
        headerMode: 'none'
    }
);

export default RootNavigator;