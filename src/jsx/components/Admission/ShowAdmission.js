import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import { Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useDocumentTitle } from "../../hooks/useTitle";
import Autorisation from "./Autorisation";
import Interdiction from "./Interdiction";
import Visiteur from "./Visiteur";
import Ronde from "./Ronde";

const ShowAdmission = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [admission, setAdmission] = useState(null);

    useDocumentTitle('Détails de l\'hospitalisation');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`admissions/${id}`, { signal: controller.signal })
                .then(function ({ data }) {
                    setAdmission(data.data);
                    console.log(data); 
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
            <ToastContainer />
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">
                        <Link to={"#"} onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left me-2"></i>Hospitalisation
                            (<span className={`text-${admission ? admission.status_color : ''}`}>{admission ? admission.status_label : '---'}</span>)
                        </Link>
                    </h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>ID</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{admission ? admission.reference : '---'}</Link></li>
                    </ol>
                </div>
            </div>
            {admission && admission.statutes.length > 0 &&
            <Row>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4>Précédents status d'hospitalisation</h4>
                            {admission.statutes.map((status, index, data) => (
                                <span key={index}>
                                    <span>{status}</span>{index + 1 !== data.length && <i className="fa fa-arrow-right mx-2"></i>}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Row>}
            <Row>
                <div className="col-xl-4 col-lg-6 col-xxl-4 col-sm-6">
                    <div className="card text-white bg-primary">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Patient :</span>
                                <strong>{admission ? admission.patient?.reference : '---'}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Maladie :</span>
                                <strong>{admission ? admission.desease : '---'}</strong>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-xxl-4 col-sm-6">
                    <div className="card text-white bg-dark">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Médecin :</span>
                                <strong>{admission ? admission.doctor.reference : '---'}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Profil :</span>
                                <strong>{admission ? admission.doctor_skill : '---'}</strong>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-xxl-4 col-sm-6">
                    <div className="card text-white bg-secondary">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Chambre :</span>
                                <strong>{admission ? admission.room_number : '---'}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="mb-0">Lit :</span>
                                <strong>{admission ? admission.bed_number : '---'}</strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </Row>
            <Row>
                <div className="col-xl-4 col-lg-12 col-sm-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h2 className="card-title">Motif d'hospitalisation</h2>
                        </div>
                        <div className="card-body pb-0">
                            <p>{admission ? admission.reason : '---'}</p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Date d'entrée</strong>
                                    <span className="mb-0">{admission ? admission.format_entry_date : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Date de sortie</strong>
                                    <span className="mb-0">{admission ? admission.format_release_date : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Dossier</strong>
                                    <span className={`mb-0 ${admission && admission.dossier_reference === 'aucun' ? 'text-warning' : 'fs-6'}`}>
                                        {admission ? admission.dossier_reference : '---'}
                                    </span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Service H</strong>
                                    <span 
                                        style={{width: '210px'}}
                                        className={`mb-0 text-truncate text-end ${admission && admission.service_name === 'aucun' ? 'text-warning' : 'fs-6'}`}>
                                        {admission ? admission.service_name : '---'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                                <div className="col-4 pt-3 pb-3 border-end">
                                    <h3 className="mb-1 text-primary">{admission ? admission.soins_count : '---'}</h3>
                                    <span className="fs-6">Soins</span>
                                </div>
                                <div className="col-4 pt-3 pb-3 border-end">
                                    <h3 className="mb-1 text-primary">{admission ? admission.examens_count : '---'}</h3>
                                    <span className="fs-6">Examens</span>
                                </div>
                                <div className="col-4 pt-3 pb-3">
                                    <h3 className="mb-1 text-primary">{admission ? admission.prescriptions_count : '---'}</h3>
                                    <span className="fs-6">Ordonnances</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {admission &&
                    <>
                        <div className="col-xl-4 col-lg-12 col-sm-12">
                            <Ronde admission={admission} />
                        </div>
                        <div className="col-xl-4 col-lg-12 col-sm-12">
                            <Visiteur admission={admission} />
                        </div>
                        <div className="col-xl-4 col-lg-12 col-sm-12">
                            <Autorisation admission={admission} />
                        </div>
                        <div className="col-xl-4 col-lg-12 col-sm-12">
                            <Interdiction admission={admission} />
                        </div>
                    </>
                }
            </Row>
        </>
    );
}

export default ShowAdmission;