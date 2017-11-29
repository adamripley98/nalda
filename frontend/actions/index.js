// Action Creators

// import * as types from './types';


// -----------------------------------------------------------------------------
// ---------------------------Authentication Actions----------------------------
// -----------------------------------------------------------------------------
export function login(userId) {
    return {
        type: 'LOGIN',
        userId
    };
}

export function register() {
    return {
        type: 'REGISTER',
    };
}
