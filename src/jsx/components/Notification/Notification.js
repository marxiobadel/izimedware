import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('notifications', {signal: controller.signal})
                .then(function ({ data }) {
                    console.log(data)
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error); 
                    }
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <></>
    );
}

export default Notification;