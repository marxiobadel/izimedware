import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom'
import axiosInstance from '../../../services/AxiosInstance';
import { useDocumentTitle } from '../../hooks/useTitle';
import Antecedent from './Antecedent';
import Information from './Information';
import Coordonate from './Coordonate';
import Dossier from './Dossier';
import Data from './Data';

const PatientDetails = () => {
    const {id} = useParams(); 

    const [patient, setPatient] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [latestDossier, setLatestDossier] = useState(null);

    const [change, setChange] = useState(0);

    const handleCountChange = (newChange) => {
        setChange(newChange);
    }

    useDocumentTitle('Détail du patient');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`patients/${id}`, {signal: controller.signal})
                .then(function ({ data }) {
                    setPatient({...data.data});
                    setCoverUrl(data.cover_url);
                    setLatestDossier(data.latestDossier);
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
    }, [change]);

    return (
        <>
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Détails du patient</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Patient</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{patient ? patient.reference : '---'}</Link></li>
                    </ol>
                </div>
            </div>  
            <div className="row">
                <div className="col-xl-9 col-xxl-12">
                    <div className={`row${patient ? '' : ' h-100'}`}>
                        {patient ?
                        <>
                            {typeof patient === 'object' &&
                            <>
                                <Information patient={patient} coverUrl={coverUrl} latestDossier={latestDossier}/>
                                <Coordonate patient={patient} />
                            </>}
                            {patient.antecedents && typeof patient.antecedents === 'object' && patient.antecedents.length > 0 &&
                            <div className="col-xl-12">
                                <Antecedent antecedents={patient.antecedents} />
                            </div>}
                            {typeof patient === 'object' &&
                            <div className="col-xl-12">
                                <Dossier patient_id={patient.id} onCountChange={handleCountChange} />
                            </div>}
                        </>
                        : 
                        <div className="col-sm-12 fs-3 d-flex justify-content-center align-items-center">
                            Chargement...
                        </div>}
                    </div>
                </div>
                <div className="col-xl-3 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12 col-xxl-4 col-lg-5">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-0">Médecin désigné</h4>                                    
                                </div>
                                <div className="card-body">
                                    {latestDossier && latestDossier.doctor_id ?
                                    <>
                                        <div className="media mb-4 align-items-center">
                                            <img src={latestDossier.doctor_avatar_url} alt="" width="85" className="me-3" />
                                            <div className="media-body">
                                                <h3 className="fs-18 font-w600 mb-1">
                                                    <Link to={"#"} className="text-black">{latestDossier.doctor_name}</Link>
                                                </h3>
                                                <span className="fs-14">{latestDossier.doctor_skill}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <Link to={`/doctor-details/${latestDossier.doctor_id}`} className="btn btn-primary light mb-2 btn-sm d-block">Voir</Link>
                                            </div>
                                        </div>
                                    </> : 
                                    <div> Non défini</div>}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 col-xxl-8 col-lg-7">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div>
                                        <h4 className="fs-20 text-black mb-1">Données du patient</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Data latestDossier={latestDossier} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    );
};

export default PatientDetails;