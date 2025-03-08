import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import parse from 'html-react-parser';
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "../../constant/theme";
import { useDocumentTitle } from "../../hooks/useTitle";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    const handleDelete = (id) => {
        Swal.fire({
            title:'Etes-vous sûr ?',
            text: "Après suppression, vous ne pourrez pas récupérer la donnée supprimée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dd6b55',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Ok, supprimé !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`notifications/${id}`)
                    .then(({data}) => {
                        setNotifications((prevState) => prevState.filter((state) => state.id !== id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            notifyError('Désolé ! Cette donnée ne peut être supprimée.');
                        } else {
                            console.log(error);
                        }
                    })
            }
        })
    };

    const markAsRead = (id) => {
        axiosInstance.post(`notifications/${id}`)
            .then(({data}) => {
                setNotifications((prevState) =>
                    prevState.map(state => (state.id === id ? {...state, ...data.notification} : state))
                );
                console.log(data.notification);
                notifySuccess(data.message);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    notifyError(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    }

    useDocumentTitle('Notifications');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('notifications', { signal: controller.signal })
                .then(function ({ data }) {
                    setNotifications([...data.notifications].reverse());
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
        <>
            <PageTitle pageContent={''} motherMenu={'Notifications'} activeMenu={"Tous les notifications recues."} />
            <ToastContainer />
            <div className="row">
                <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12 col-12">
                    <div className="card">
                        <div className="card-body p-0">
                            <div style={{ height: "calc(100vh - 200px)" }} id="DZ_W_Todo1" className="widget-media dz-scroll  ps--active-y my-4 px-4">
                                <ul className="timeline">
                                    {notifications.length > 0 ? notifications.map((notification, index) => (
                                    <li key={index}>
                                        <div className="timeline-panel">
                                            <div className="media me-2 media-success">
                                                <i className="fa fa-home"></i>
                                            </div>
                                            <div className="media-body">
                                                <h5 className="mb-1">{notification.title}</h5>
                                                <small className="d-block">{notification.date}</small>
                                                <p>{parse(notification.message)}</p>
                                            </div>
                                            <Dropdown className="dropdown">
                                                <Dropdown.Toggle
                                                    variant=" light"
                                                    className=" i-false p-0 btn-success sharp"
                                                >
                                                    <svg
                                                        width="18px"
                                                        height="18px"
                                                        viewBox="0 0 24 24"
                                                        version="1.1"
                                                    >
                                                        <g
                                                            stroke="none"
                                                            strokeWidth="1"
                                                            fill="none"
                                                            fillRule="evenodd"
                                                        >
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <circle fill="#000000" cx="5" cy="12" r="2" />
                                                            <circle fill="#000000" cx="12" cy="12" r="2" />
                                                            <circle fill="#000000" cx="19" cy="12" r="2" />
                                                        </g>
                                                    </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu">
                                                    {!notification.is_read &&
                                                    <Dropdown.Item className="dropdown-item" to="#" onClick={() => markAsRead(notification.id)}>
                                                        Marquer comme lu
                                                    </Dropdown.Item>}
                                                    <Dropdown.Item className="dropdown-item" to="#" onClick={() => handleDelete(notification.id)}>
                                                        Supprimer
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </li>))
										:
									<li className="h-100 d-flex align-items-center justify-content-center">
                                        Aucune notification
                                    </li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notification;