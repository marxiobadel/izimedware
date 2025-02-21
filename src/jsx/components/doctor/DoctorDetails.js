import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";


import { IMAGES } from '../../constant/theme';
import PatientPieChart from '../Dashboard/Element/PatientPieChart';
import AbilityPieChart from '../Dashboard/Element/AbilityPieChart';
import axiosInstance from '../../../services/AxiosInstance';
import { useDocumentTitle } from '../../hooks/useTitle';
import Information from './Information';

const statisticBlog = [
    { title:'Immunities' , progress:'80%', color:'#5F74BF'},
    { title:'Stamina' , progress:'50%', color:'#FFD439'},
    { title:'Heart Beat' , progress:'90%', color:'#FF6E5A'},
    { title:'Colestrol' , progress:'70%', color:'#5FBF91'},
];

const listBlog = [
    { image: IMAGES.User17, title:'Samuel Hawkins', subtitle:'Cold & Flue'},
    { image: IMAGES.User18, title:'Debora Saragih', subtitle:'Dental Care'},
    { image: IMAGES.User19, title:'Richard Kean', subtitle:'Physical Problem'},
    { image: IMAGES.User20, title:'Kevin Ash', subtitle:'Dental Care'},
];

const DoctorDetails = () => {
    const {id} = useParams();

    const [doctor, setDoctor] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);

    useDocumentTitle('Détail du personnel médical');

    useEffect(() => {
        const controller = new AbortController();
          
        (() => {
            axiosInstance.get(`doctors/${id}`, {signal: controller.signal})
                .then(function ({ data }) {
                    setDoctor({...data.data});
                    setCoverUrl(data.cover_url);
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
    }, [id]);

    return (
        <>
            <div className="form-head d-flex page-titles mb-sm-4 mb-3 align-items-center">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Détails du personnel médical</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Doctor</Link></li>
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
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div>
                                        <h4 className="fs-20 text-black mb-1">Doctor Ability</h4>
                                        <span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-lg-5 mb-lg-0 mb-3">
                                            {statisticBlog.map((item, ind)=>(
                                                <div className="d-flex mb-3 align-items-center" key={ind}>                                                    
                                                    <span className="fs-12 col-6 p-0 text-black">
                                                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="19" height="19" fill={item.color}/>
                                                        </svg>{" "}
                                                        {item.title}
                                                    </span>
                                                    <div className="progress rounded-0 col-6 p-0">
                                                        <div className="progress-bar rounded-0 progress-animated" 
                                                            style={{width: item.progress, height:"6px", background:item.color}} 
                                                        >
                                                            <span className="sr-only">{item.progress} Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}                                            
                                        </div>
                                        <div className="col-lg-7">
                                            <div className="row align-items-center">
                                                <div className="col-lg-6 col-sm-6 mb-sm-0 mb-3">
                                                    <div id="pieChart" className='d-flex justify-content-center'>
                                                        <PatientPieChart />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6">
                                                    <div id="pieChart2" className='d-flex justify-content-center'>
                                                        <AbilityPieChart />
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-sm-start justify-content-center">
                                                        <svg className="me-3" width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="3.54545" height="26" rx="1.77273" transform="matrix(-1 0 0 1 24.8184 0)" fill="#757575"/>
                                                            <rect width="3.54545" height="18.9091" rx="1.77273" transform="matrix(-1 0 0 1 17.7275 7.09091)" fill="#757575"/>
                                                            <rect width="3.54545" height="8.27273" rx="1.77273" transform="matrix(-1 0 0 1 10.6367 17.7273)" fill="#757575"/>
                                                            <rect width="4" height="16" rx="2" transform="matrix(-1 0 0 1 4 10)" fill="#757575"/>
                                                        </svg>
                                                        <div>
                                                            <p className="fs-12 mb-1">Total Statistic</p>
                                                            <span className="fs-22 text-black font-w600">452,551k</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="col-xl-3 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12 col-xxl-4">
                            <div className="card patient-list">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-0">Patient List</h4>
                                    <Dropdown className="dropdown">
                                        <Dropdown.Toggle className="btn-link i-false c-pointer" as="div">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                                <div className="card-body">
                                    {listBlog.map((item, ind)=>(
                                        <div className="d-flex mb-4" key={ind}>
                                            <img src={item.image} alt="" className="me-3" />
                                            <div>
                                                <h5 className="mb-1"><Link to={"/patient"} className="fs-18 text-black">{item.title}</Link></h5>
                                                <span className="fs-14 text-primary font-w600">{item.subtitle}</span>
                                            </div>
                                        </div>
                                    ))}                                    
                                </div>
                                <div className="card-footer pt-0 border-0">
                                    <Link to={"/patient"} className="btn d-block btn-outline-primary">+ Assign New Patient</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorDetails;