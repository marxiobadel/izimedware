import {
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
} from '../../services/AuthService';

export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function Logout(navigate) {
    localStorage.removeItem('userDetails');
    navigate('/login');

    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(email, password, navigate) {
    return (dispatch) => {
        login(email, password)
            .then(({data}) => {
                saveTokenInLocalStorage(data);

                /** Servant à déconnecter l'utilisateur après un temps de connexion prédefinie */
                runLogoutTimer(
                    dispatch,
                    data.expiresIn * 1000,
                    navigate,
                );
                
                dispatch(loginConfirmedAction(data));
                
                navigate('/dashboard');
            })
            .catch((error) => {  
                const response = error.response;

                if (!response) {
                    dispatch(loginFailedAction(error.message));
                    return false;
                }

                if (response.status === 401 || response.status === 429) {
                    dispatch(loginFailedAction(response.data.message));
                } else if (response.status === 422) {
                    const message = response.data.message;
                    if (message.password) {
                        dispatch(loginFailedAction(message.password.join(',')));
                    } else if (message.email) {
                        dispatch(loginFailedAction(message.email.join(',')));
                    }
                } else {
                    dispatch(loginFailedAction(response.statusText));
                }
            })
            .finally(() => {
                dispatch(loadingToggleAction(false));
            });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}
