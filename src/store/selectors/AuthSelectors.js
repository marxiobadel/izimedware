export const isAuthenticated = (state) => {
    if (state.auth.auth.idToken) {
        return true;
    } else {
        return false;
    }
};
