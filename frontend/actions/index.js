// -----------------------------------------------------------------------------
// ---------------------------Authentication Actions----------------------------
// -----------------------------------------------------------------------------

// dispatch login action, will call appropriate reducer (loginReducer.js)
export function login(userId) {
    return {
        type: 'LOGIN',
        userId
    };
}

// dispatch register action, will call appropriate reducer (registerReducer.js)
// TODO: potentially will need userId here too, not for now though
export function register() {
    return {
        type: 'REGISTER',
    };
}
