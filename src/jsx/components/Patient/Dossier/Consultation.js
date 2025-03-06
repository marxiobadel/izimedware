import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import { DataContext } from "../ShowDossier";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { isPatient, notifyError, notifySuccess } from "../../../constant/theme";
import ConsultationModal from "../../consultation/modal/ConsultationModal";
import Swal from "sweetalert2";

const DossierConsultation = ({ currentUser }) => {
    const dossier = useContext(DataContext);

    let width = window.innerWidth;

    const [action, setAction] = useState(0);

    const [editingConsultation, setEditingConsultation] = useState(null);
    
    const [openModal, setOpenModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [consultations, setConsultations] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalProcedures, setMedicalProcedures] = useState([]);

    const handleAdd = () => {
        setAction((prevState) => prevState + 1);
        setEditingConsultation(null);
        setOpenModal(true); 
    }
    

    const handleEdit = (consultation) => {
        setEditingConsultation(consultation);
        setOpenModal(true);
    };

    const handleAddOrEditConsultation = (consultation, type) => {
        if (type === 'edit') {
            setConsultations((prevState) =>
                prevState.map((state) => (state.id === consultation.id ? {...state, ...consultation} : state))
            );
        } else {
            setConsultations((prevState) => [consultation, ...prevState]);
        }

        setOpenModal(false);
    };

    const handleDelete = (consultation) => {
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
                axiosInstance.delete(`consultations/${consultation.id}`)
                    .then(({data}) => {
                        setConsultations((prevState) => prevState.filter((state) => state.id !== consultation.id));

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
            axiosInstance.get(`dossiers/${dossier.id}/consultations`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setConsultations(data.consultations);
                    setDoctors(data.doctors);
                    setPatients(data.patients);
                    setMedicalProcedures(data.medicalProcedures);
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
            <div className="row text-end mb-3">
                <div className="col-12">
                    <Link to={"#"} className="btn btn-primary me-3" onClick={handleAdd}>+ Nouvelle consultation</Link>
                </div>
            </div>
            <div className="row">
                {loading ?
                    <div className="col-12 d-flex align-items-center justify-content-center fs-4">Chargement...</div>
                    :
                    (consultations.length > 0 ? consultations.map((consultation, index) => (
                        <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                            <div className="card project-boxed" style={{ border: '1px solid rgba(0, 0, 0, 0.18)', borderRadius: '20px' }}>
                                <div className="card-header align-items-start">
                                    <div>
                                        <p className="fs-14 mb-2 text-primary">#{consultation.reference}</p>
                                        <h6 className="fs-18 font-w500 mb-3">
                                            <Link to={'#'} className="text-black user-name">
                                                {consultation.patient_name}
                                            </Link>
                                        </h6>
                                        <div className="text-dark fs-14 text-nowrap"><i className="fas fa-calendar me-2" />Faite le {consultation.format_date}</div>
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
                                            <Dropdown.Item as={Link} to={`/consultations/${consultation.id}`}>Détails</Dropdown.Item>
                                            {!isPatient(currentUser.roles) &&
                                                <>
                                                    <Dropdown.Item onClick={() => handleEdit(consultation)}>Modifier</Dropdown.Item>
                                                    <Dropdown.Item className="text-danger" onClick={() => handleDelete(consultation)}>Supprimer</Dropdown.Item>
                                                </>}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">ID patient :</span>
                                            <span className="text-warning fs-6">{consultation.patient?.reference}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">ID médecin :</span>
                                            <span className="text-warning fs-6">{consultation.doctor?.reference}</span>
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
                                                                <strong>{consultation.reason}</strong>
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
                        </div>))
                        :
                        <div className="col-12 d-flex align-items-center justify-content-center fs-4">
                            Aucune consultation de disponible
                        </div>
                    )}
            </div>
            <ConsultationModal 
                action={action}
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAddOrEditConsultation}
                consultation={editingConsultation}
                doctors={doctors}
                patients={patients}
                medicalProcedures={medicalProcedures}
                dossier={dossier}
            />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};

export default connect(mapStateToProps)(DossierConsultation);