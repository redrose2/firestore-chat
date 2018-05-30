import React, { Component } from 'react';
import { connect } from 'react-redux';
import RootNavigator from '@navigators';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RootNavigator />
        );
    }
}

function bindAction(dispatch) {
    return {
        dispatch,
    };
}

const mapStateToProps = (state) => ({
    global: state.global,
    auth: state.auth
});

export default connect(mapStateToProps, bindAction)(App);