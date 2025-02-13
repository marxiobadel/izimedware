import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { store } from "../../store/store";

window.Pusher = Pusher;

const state = store.getState();
const token = state.auth.auth.idToken;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '7edddbc56c1993817b0a',
    wsHost: `ws-eu.pusher.com`,
    wsPort: 80,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    cluster: 'eu',
    encrypted: true,
    authEndpoint: "http://localhost:8000/broadcasting/auth",
    auth: {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
        },
    },
});

//export default echo;