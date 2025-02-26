import { Link, useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useTitle";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import Clolesterol from "../../pages/WidgetBasic/Clolesterol";
import GlucoseRate from "../../pages/WidgetBasic/GlucoseRate";
import bg5 from '../../../images/big/img5.jpg';
import profile from "../../../images/profile/profile.png";
import { calculateAge, removeStringAndSpace } from "../../constant/theme";

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
                <div className="col-xl-8 col-lg-12 col-xxl-8 col-sm-12">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">Pression artérielle</h3>
                                        <span>{dossier ? dossier.blood_pressure_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-end">
                                        <h3 className="text-primary mb-0">
                                            {dossier && dossier.systolic_blood_pressure && dossier.diastolic_blood_pressure ? 
                                                removeStringAndSpace(dossier.blood_pressure, 'mmHg') : '---'}
                                        </h3>
                                        <span>mmHG</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">Fréquence cardiaque</h3>
                                        <span className="text-danger">{dossier ? dossier.heart_rate_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-end">
                                        <h3 className="text-danger mb-0">{dossier && dossier.heart_rate ? dossier.heart_rate : '---'}</h3>
                                        <span>Par Min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">Saturation en oxygène</h3>
                                        <span>{dossier ? dossier.oxygen_saturation_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-end">
                                        <h3 className="text-primary mb-0">
                                            {dossier && dossier.oxygen_saturation ? dossier.oxygen_saturation : '---'}
                                        </h3>
                                        <span>%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">IMC</h3>
                                        <span>{dossier ? dossier.imc_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-end">
                                        <h3 className="text-primary mb-0">
                                            {dossier && dossier.imc ? dossier.imc : '---'}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">Taux de glucose</h3>
                                        <span>{dossier ? dossier.blood_sugar_level_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-center">
                                        <h3 className="text-success mb-0">{dossier && dossier.blood_sugar_level ? dossier.blood_sugar_level : '---'}</h3>
                                        <span>g/dl</span>
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <Clolesterol />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div className="clearfix">
                                        <h3 className="card-title">Température corporelle</h3>
                                        <span>{dossier ? dossier.temperature_status : '---'}</span>
                                    </div>
                                    <div className="clearfix text-center">
                                        <h3 className="text-info mb-0">{dossier && dossier.temperature ? dossier.temperature : '---'}</h3>
                                        <span>°C</span>
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <GlucoseRate />
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            Age : {dossier && dossier.patient ? calculateAge(dossier.patient.birthday) : '---'}
                                        </h4>
                                        <small>ans</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {dossier && dossier.patient &&
                        <div className="card-footer mt-0">
                            <Link as="button" to={`patient-details/${dossier.patient.id}`} className="btn btn-primary btn-lg btn-block">
                                Voir le profil
                            </Link>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShowDossier;