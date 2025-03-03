import { Link, useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useTitle";
import { createContext, useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import bg5 from '../../../images/big/img5.jpg';
import profile from "../../../images/profile/profile.png";
import { calculateAge } from "../../constant/theme";
import Data from "./Dossier/Data";
import Header from "./Dossier/Header";
import { ToastContainer } from "react-toastify";
import VitalSigns from "./Dossier/VitalSigns";

export const DataContext = createContext();

const ShowDossier = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [dossier, setDossier] = useState(null);

    useDocumentTitle('Détail du dossier');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dossiers/${id}`, { signal: controller.signal })
                .then(function ({ data }) {
                    setDossier({ ...data.data });
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
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">
                        <Link to={"#"} onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left me-2"></i>Dossier patient
                        </Link>
                    </h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Dossier</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{dossier ? dossier.reference : '---'}</Link></li>
                    </ol>
                </div>
            </div>
            <div className="row">
                <Header dossier={dossier} setDossier={setDossier} />
            </div>
            <div className="row">
                <div className="col-xl-8 col-lg-12 col-xxl-8 col-sm-12">
                    <VitalSigns dossier={dossier} />
                </div>
                <div className="col-xl-4 col-lg-12 col-sm-12">
                    <div className="card overflow-hidden">
                        <div
                            className="text-center p-5 pb-4 overlay-box"
                            style={{ backgroundImage: `url(${bg5})` }}
                        >
                            <img
                                src={dossier ? dossier.patient.avatar_url : profile}
                                width="100"
                                style={{height: '100px', objectFit: 'cover'}}
                                className="img-fluid rounded-circle"
                                alt={dossier ? dossier.patient.fullname : '---'}
                            />
                            <h3 className="mt-3 mb-0 text-white">{dossier ? dossier.patient.fullname : '---'}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="bgl-primary rounded p-3">
                                        <h4 className="mb-0">{dossier ? dossier.patient.gender_label : '---'}</h4>
                                        <small>Sexe du patient</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bgl-primary rounded p-3">
                                        <h4 className="mb-0">
                                            Age : {dossier && dossier.patient && dossier.patient.birthday ? calculateAge(dossier.patient.birthday) : '---'}
                                        </h4>
                                        <small>ans</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {dossier && dossier.patient &&
                        <div className="card-footer mt-0">
                            <Link as="button" to={`/patient-details/${dossier.patient.id}`} className="btn btn-primary btn-lg btn-block">
                                Voir le profil
                            </Link>
                        </div>}
                    </div>
                </div>
            </div>
            {dossier &&
                <div className="row">
                    <div className="col-12">
                        <DataContext.Provider value={dossier}><Data /></DataContext.Provider>
                    </div>
                </div>
            }
        </>
    );
}

export default ShowDossier;