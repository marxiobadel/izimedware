import { useContext, useEffect, useState } from "react";
import axiosInstance from '../../../../services/AxiosInstance';
import { Link } from "react-router-dom";
import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import Appointment from "../../Dashboard/Element/Appointment";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { DataContext } from "../ShowDossier";
import ValidateModal from "../../Appointment/modal/ValidateModal";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "../../../constant/theme";

const DossierAppointment = ({ currentUser }) => {
    registerLocale("fr", fr);

    const dossier = useContext(DataContext);

    let width = window.innerWidth;

    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [appointment, setAppointment] = useState(null);

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const handleAdd = (appointment) => {
        setAppointments(prevState => [appointment, ...prevState]);
    }

    const handleValidate = (appointment) => {
        setAppointments((prevState) =>
            prevState.map((state) => (state.id === appointment.id ? { ...state, ...appointment } : state))
        );

        setOpenModal(false);
    }

    const handleValidation = (appointment) => {
        setAppointment(appointment);

        setOpenModal(true);
    }

    const handleDelete = (appointment) => {
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
                axiosInstance.delete(`appointments/${appointment.id}`)
                    .then(({data}) => {
                        setAppointments((prevState) => prevState.filter((state) => state.id !== appointment.id));

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

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dossiers/${dossier.id}/appointments`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setAppointments(data.appointments);
                    setPatients(data.patients);
                    setDoctors(data.doctors);
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                })
                .finally(function () {
                    setLoading(false);
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <div className="row flex-row-reverse">
                <div className="col-6">
                    <Appointment
                        locale={fr}
                        patients={patients}
                        doctors={doctors}
                        dossier={dossier}
                        currentUser={currentUser}
                        save={handleAdd} />
                </div>
                <div className="col-6">
                    <div className="row">
                        {loading ? <div className="col-12 d-flex align-items-center justify-content-center fs-4">Chargement...</div> :
                            (appointments.length > 0 ? appointments.map((appointment, index) => (
                                <div className="col-sm-6" key={index}>
                                    <div className="card project-boxed" style={{ border: '1px solid rgba(0, 0, 0, 0.18)', borderRadius: '20px' }}>
                                        <div className="card-header align-items-start">
                                            <div>
                                                <p className="fs-14 mb-2 text-primary">#{appointment.id}</p>
                                                <h6 className="fs-18 font-w500 mb-3">
                                                    <Link to={'#'} className="text-black user-name">
                                                        {appointment.patient_name}
                                                    </Link>
                                                </h6>
                                                <div className="text-dark fs-14 text-nowrap"><i className="fas fa-calendar me-2" />Prévu le {appointment.format_datetime}</div>
                                            </div>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" as="div" className="btn-link i-false" >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu align="end" className="dropdown-menu-right">
                                                    {currentUser.id === appointment.doctor?.id &&
                                                        <Dropdown.Item onClick={() => handleValidation(appointment)}>Valider</Dropdown.Item>}
                                                    <Dropdown.Item className="text-danger" onClick={() => handleDelete(appointment)}>Supprimer</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="card-body p-0">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item d-flex justify-content-between">
                                                    <span className="mb-0 title">ID patient :</span>
                                                    <span className="text-warning fs-6">{appointment.patient?.reference}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between">
                                                    <span className="mb-0 title">ID médecin :</span>
                                                    <span className="text-warning fs-6">{appointment.doctor?.reference}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between">
                                                    <span className="mb-0 title">Statut :</span>
                                                    <span className={`text-${appointment.status_color} fs-6`}>
                                                        {appointment.status === 'rejected' ?
                                                            <OverlayTrigger trigger="click"
                                                                placement={
                                                                    width < 1300 && width > 700 ? "right" : width < 700 ? "bottom" : "top"
                                                                }
                                                                responsive={true}
                                                                overlay={
                                                                    <Tooltip className='toltip-popover' id={`popover-positioned-left`}>
                                                                        <h3 className='popover-header'>{`Rejet`}</h3>
                                                                        <strong>{appointment.reason2 ?? 'Aucune justification.'}</strong>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <span style={{cursor: 'pointer'}}>{appointment.status_label}</span>
                                                            </OverlayTrigger>
                                                            :
                                                            <span>{appointment.status_label}</span>
                                                        }
                                                    </span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="mb-0 title">Raison :</span>
                                                    <div className="bootstrap-popover-wrapper">
                                                        <div className="bootstrap-popover d-inline-block">
                                                            <OverlayTrigger trigger="click"
                                                                placement={
                                                                    width < 1300 && width > 700 ? "right" : width < 700 ? "bottom" : "top"
                                                                }
                                                                responsive={true}
                                                                overlay={
                                                                    <Tooltip className='toltip-popover' id={`popover-positioned-left`}>
                                                                        <h3 className='popover-header'>{`Infos patient`}</h3>
                                                                        <strong>{appointment.reason1}</strong>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <Button variant="primary" size="xs">Voir</Button>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="col-12 d-flex align-items-center justify-content-center fs-4">
                                Aucun rendez-vous de disponible
                            </div>
                            )}
                    </div>
                </div>
            </div>
            <ValidateModal
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleValidate}
                appointment={appointment}
            />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};

export default connect(mapStateToProps)(DossierAppointment);