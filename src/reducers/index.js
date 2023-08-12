//to determine what property on global state are giving reducers updates
import {combineReducers} from 'redux';
//to perform change of state of the user
import * as actionTypes from '../actions/types';

//initial user state
const initialUserState = {
    currentUser: null,
    isLoading: true
};

//to reduce all user related data
const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
        return {
            currentUser: action.payload.currentUser,
            isLoading: false
        };
        case actionTypes.CLEAR_USER:
        return {
            ...state,
            isLoading: false
        }
        default: //to return the state as it was
        return state;
    }
};

const initialChannelState = {
    currentChannel : null,
    isPrivateChannel: false,
    userPosts: null
};

const channel_reducer = (state= initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel:action.payload.currentChannel
        };
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel
            };
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts:action.payload.userPosts
            };
        default:
            return state;
    }
}

//this is to make the reducer only modify user property on a global state
const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer
});

export default rootReducer;