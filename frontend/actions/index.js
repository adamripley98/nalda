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

export function saveLoginUsername(username) {
    return {
        type: 'USERNAME',
        username
    };
}

export function saveLoginPassword(password) {
    return {
        type: 'PASSWORD',
        password
    };
}

export function register() {
    return {
        type: 'REGISTER',
    };
}

export function saveRegisterUsername(username) {
    return {
        type: 'REGUSERNAME',
        username
    };
}

export function saveRegisterPassword(password) {
    return {
        type: 'REGPASSWORD',
        password
    };
}

export function saveRegisterVerPassword(verPassword) {
    return {
        type: 'VERPASSWORD',
        verPassword
    };
}
