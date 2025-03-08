import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import { DataContext } from "../ShowDossier";
import { Link } from "react-router-dom";
import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import { isPatient, notifyError, notifySuccess } from "../../../constant/theme";
import { connect } from "react-redux";

const DossierPrescription = ({currentUser}) => {
    const dossier = useContext(DataContext);

    let width = window.innerWidth;

    const [prescriptions, setPrescriptions] = useState([]);

    const [loading, setLoading] = useState(true);

    const handleDelete = (prescription) => {
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
                axiosInstance.delete(`prescriptions/${prescription.id}`)
                    .then(({data}) => {
                        setPrescriptions((prevState) => prevState.filter((state) => state.id !== prescription.id));

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
            axiosInstance.get(`dossiers/${dossier.id}/prescriptions`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setPrescriptions([...data.prescriptions].reverse());
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
                    <Link to={`/prescriptions/create?dossier_id=${dossier.id}`} className="btn btn-primary me-3">
                        + Nouvelle prescription
                    </Link>
                </div>
            </div>
            <div className="row">
            {loading ?
                <div className="col-12 d-flex align-items-center justify-content-center fs-4">Chargement...</div>
                :
                (prescriptions.length > 0 ? prescriptions.map((prescription, index) => (
                    <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                        <div className="card project-boxed" style={{ border: '1px solid rgba(0, 0, 0, 0.18)', borderRadius: '20px' }}>
                            <div className="card-header align-items-start">
                                <div>
                                    <p className="fs-14 mb-2 text-primary">#{prescription.reference}</p>
                                    <h6 className="fs-18 font-w500 mb-3">
                                        <Link to={'#'} className="text-black user-name">
                                            {prescription.patient_name}
                                        </Link>
                                    </h6>
                                    <div className="text-dark fs-14 text-nowrap"><i className="fas fa-calendar me-2" />Faite le {prescription.format_date}</div>
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
                                        <Dropdown.Item as={Link} to={`/prescriptions/${prescription.id}`}>Détails</Dropdown.Item>
                                        {!isPatient(currentUser.roles) &&
                                            <>
                                                <Dropdown.Item as={Link} to={`/prescriptions/${prescription.id}/edit`}>Modifier</Dropdown.Item>
                                                <Dropdown.Item className="text-danger" onClick={() => handleDelete(prescription)}>Supprimer</Dropdown.Item>
                                            </>}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span className="mb-0 title">ID patient :</span>
                                        <span className="text-warning fs-6">{prescription.patient_reference}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span className="mb-0 title">ID Medecin :</span>
                                        <span className="text-warning fs-6">{prescription.doctor_reference}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span className="mb-0 title">Médicaments :</span>
                                        <div className="bootstrap-popover-wrapper">
                                            <div className="bootstrap-popover d-inline-block">
                                                <OverlayTrigger trigger="click"
                                                    placement={
                                                        width < 1300 && width > 700 ? "right" : width < 700 ? "bottom" : "top"
                                                    }
                                                    responsive={true}
                                                    overlay={
                                                        <Tooltip className='toltip-popover' id={`popover-positioned-left`}>
                                                            <h3 className='popover-header'>{`Infos`}</h3>
                                                            <strong>{prescription.medicines.map(item => item.name).join(', ')}</strong>
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="primary" size="xs">{prescription.medicines.length}</Button>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span className="mb-0 title">Département :</span>
                                        <div className="bootstrap-popover-wrapper">
                                            <div className="bootstrap-popover d-inline-block">
                                                <OverlayTrigger trigger="click"
                                                    placement={
                                                        width < 1300 && width > 700 ? "right" : width < 700 ? "bottom" : "top"
                                                    }
                                                    responsive={true}
                                                    overlay={
                                                        <Tooltip className='toltip-popover' id={`popover-positioned-left`}>
                                                            <h3 className='popover-header'>{`Infos`}</h3>
                                                            <strong>{prescription.service?.name}</strong>
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
                        Aucune prescription de disponible
                    </div>
                )}
            </div>
        </>
    );
}


const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};

export default connect(mapStateToProps)(DossierPrescription);