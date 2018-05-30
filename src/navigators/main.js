import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import HomeScreen from '@containers/main/home';
import ContactsScreen from '@containers/main/contacts';
import MessagesScreen from '@containers/main/messages';
import I18n from '@i18n';
import { Metrics, Styles } from '@theme';

export default StackNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: ({ navigation }) => ({
                title: I18n.t('NAVIGATION_TITLE_HOME'),
                headerRight:
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: Metrics.defaultMargin }} onPress={() => navigation.navigate('Contacts', { refresh: navigation.state.params.refresh })}>
                            <Icon
                                name='md-add'
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: Metrics.defaultMargin }}
                            onPress={navigation.state.params ? navigation.state.params.logout : null}>
                            <Icon
                                name='md-arrow-forward'
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
            })
        },
        Contacts: {
            screen: ContactsScreen,
            navigationOptions: ({ navigation }) => ({
                title: I18n.t('NAVIGATION_TITLE_CONTACTS'),
                headerRight:
                    <TouchableOpacity
                        style={{ padding: Metrics.defaultMargin }}
                        onPress={navigation.state.params ? navigation.state.params.done : null}>
                        <Text style={Styles.headerButtonText}>
                            {I18n.t('DONE')}
                        </Text>
                    </TouchableOpacity>
            })
        },
        Messages: {
            screen: MessagesScreen,
            navigationOptions: ({ navigation }) => ({
                title: navigation.state.params.room.name,
            })
        },
    },
    {
        transitionConfig: getSlideFromRightTransition
    }
);