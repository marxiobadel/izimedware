import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

import axiosInstance from '../../../services/AxiosInstance';
import { useDocumentTitle } from '../../hooks/useTitle';
import Information from './Information';
import Appointment from './Appointment';
import NextAppointment from './NextAppointment';

const DoctorDetails = () => {
    const {id} = useParams();

    const [doctor, setDoctor] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [nextAppointment, setNextAppointment] = useState(null);

    useDocumentTitle('Détail du personnel médical');

    useEffect(() => {
        const controller = new AbortController();
          
        (() => {
            axiosInstance.get(`doctors/${id}`, {signal: controller.signal})
                .then(function ({ data }) {
                    setDoctor({...data.data});
                    setCoverUrl(data.cover_url);
                    setPatients(data.patients);
                    setAppointments(data.appointments);
                    setNextAppointment({...data.nextAppointment});
                    console.log(data.nextAppointment);    
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
            <div className="form-head d-flex page-titles mb-sm-4 mb-3 align-items-center">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Détails du personnel médical</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>ID</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{doctor ? doctor.reference : '---'}</Link></li>
                    </ol>
                </div>
            </div>
            <div className="row">
				<div className="col-xl-9 col-xxl-12">
                    <div className="row">
                        {doctor &&
                        <>
                            {typeof doctor === 'object' &&
                                <Information doctor={doctor} coverUrl={coverUrl}/>
                            }
                        </>}
                    </div> 
                    {appointments.length > 0 && 
                        <div className="row">
                            <div className="col-xl-12 col-xxl-6">
                                <div className="card">
                                    <div className="card-header border-0 pb-0">
                                        <div>
                                            <h4 className="fs-20 text-black mb-1">Mes rendez-vous</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <Appointment appointments={appointments} setAppointments={setAppointments} />
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>
                <div className="col-xl-3 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12 col-xxl-6">
                            <div className="card patient-list">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-0">Mes patients</h4>
                                </div>
                                <div className="card-body">
                                    {patients.length > 0 ?
                                        patients.map((item, ind)=>(
                                            <div className="d-flex mb-2" key={ind}>
                                                <img src={item.avatar_url} alt={item.shortname} className="me-3" style={{objectFit: 'cover'}}/>
                                                <div>
                                                    <h5 className="mb-1"><Link to={`/patient-details/${item.id}`} className="fs-18 text-black">{item.shortname}</Link></h5>
                                                    <span className="fs-14 text-primary font-w600">{item.desease}</span>
                                                </div>
                                            </div>
                                        ))
                                    :
                                        <div className="text-center">Aucun</div>
                                    }                                    
                                </div>
                            </div>
                        </div>
                        {nextAppointment && typeof nextAppointment === 'object' && Object.keys(nextAppointment).length > 0 &&
                            <NextAppointment nextAppointment={nextAppointment} />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorDetails;