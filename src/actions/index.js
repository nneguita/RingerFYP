//this is to set-up redux properties on state (actions state)
import * as actionTypes from './types';

//user actions
export const setUser= user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    }
}

//channel actions

export const setCurrentChannel = channel => {
    return {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}

export const setPrivateChannel = isPrivateChannel => {
    return {
        type:actionTypes.SET_PRIVATE_CHANNEL,
        payload: {
            isPrivateChannel
        }
    }
}

export const setUserPosts = setUserPosts => {
    return {
        type:actionTypes.SET_USER_POSTS,
        payload: {
            setUserPosts
        }
    }
}