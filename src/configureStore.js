import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistCombineReducers } from 'redux-persist';

import reducers from './reducers';
import promise from './promise';

export default function configureStore() {
    const enhancer = compose(
        applyMiddleware(thunk, promise),
        devTools({
            name: 'FBChat', realtime: true,
        }),
    );
    const config = {
        key: 'root',
        storage: AsyncStorage
    };
    const store = createStore(reducers, enhancer);
    persistCombineReducers(config, reducers);

    return store;
}
