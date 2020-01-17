import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

const defaultState = {
    stateOfThing: '',
};

export const UPDATE_STATE_OF_THING = 'UPDATE_STATE_OF_THING';

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case UPDATE_STATE_OF_THING: {
            return {
                ...state,
                stateOfThing: action.stateOfThing,
            };
        }
        default:
            return state;
    }
};

export function updateStateOfThing(stateOfThing) {
    return {
        type: UPDATE_STATE_OF_THING,
        stateOfThing,
    };
}

const composeEnhancers =
    typeof window === 'undefined'
        ? compose
        : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * @param {object} initialState
 * @param {boolean} options.isServer indicates whether it is a server side or client side
 * @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
 * @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
 * @param {boolean} options.debug User-defined debug mode param
 * @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
 */
export function makeStore(initialState /*, options*/) {
    return createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(thunkMiddleware))
    );
}
