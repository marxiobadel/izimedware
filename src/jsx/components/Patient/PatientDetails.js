import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap';

import { IMAGES, patient_cover } from '../../constant/theme';
import PatientPieChart from '../Dashboard/Element/PatientPieChart';
import axiosInstance from '../../../services/AxiosInstance';
import { useDocumentTitle } from '../../hooks/useTitle';

const statisticBlog = [
    { title:'Immunities' , progress:'80%', color:'#5F74BF'},
    { title:'Stamina' , progress:'50%', color:'#FFD439'},
    { title:'Heart Beat' , progress:'90%', color:'#FF6E5A'},
    { title:'Colestrol' , progress:'70%', color:'#5FBF91'},
];

const PatientDetails = () => {
    const {id} = useParams(); 

    const [patient, setPatient] = useState({});

    useDocumentTitle('Détail du patient');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`patients/${id}`, {signal: controller.signal})
                .then(function ({ data }) {
                    setPatient({...data.data});
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
                    <h2 className="text-black font-w600">Détails du patient</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Patient</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{patient ? patient.reference : '---'}</Link></li>
                    </ol>
                </div>
                <div className="d-flex">
                    <Dropdown className="dropdown me-3">
                        <Dropdown.Toggle  className="btn btn-warning i-false">
                            In Treatment
                            <i className="las la-angle-down ms-2 scale5"></i>
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>
            </div>  
            <div className="row">
                <div className="col-xl-9 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card details-card">
                                <img src={patient_cover} alt="" className="bg-img" />
                                <div className="card-body">
                                    <div className="d-sm-flex mb-3">
                                        <div className="img-card mb-sm-0 mb-3">	
                                            <img src={patient ? patient.avatar_url : IMAGES.profileimg2} alt={patient ? patient.shortname : '---'} /> 
                                            <div className="info d-flex align-items-center p-md-3 p-2 bg-primary">
                                                <svg className="me-3 d-sm-inline-block d-none" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M28.75 12.5C28.7538 11.8116 28.568 11.1355 28.213 10.5458C27.8581 9.95597 27.3476 9.47527 26.7376 9.15632C26.1276 8.83737 25.4415 8.69248 24.7547 8.73752C24.0678 8.78257 23.4065 9.01581 22.8434 9.4117C22.2803 9.80758 21.837 10.3508 21.5621 10.9819C21.2872 11.613 21.1913 12.3076 21.2849 12.9896C21.3785 13.6715 21.6581 14.3146 22.0929 14.8482C22.5277 15.3819 23.101 15.7855 23.75 16.015V20C23.75 21.6576 23.0915 23.2473 21.9194 24.4194C20.7473 25.5915 19.1576 26.25 17.5 26.25C15.8424 26.25 14.2527 25.5915 13.0806 24.4194C11.9085 23.2473 11.25 21.6576 11.25 20V18.65C13.3301 18.3482 15.2323 17.3083 16.6092 15.7203C17.9861 14.1322 18.746 12.1019 18.75 10V2.5C18.75 2.16848 18.6183 1.85054 18.3839 1.61612C18.1495 1.3817 17.8315 1.25 17.5 1.25H13.75C13.4185 1.25 13.1005 1.3817 12.8661 1.61612C12.6317 1.85054 12.5 2.16848 12.5 2.5C12.5 2.83152 12.6317 3.14946 12.8661 3.38388C13.1005 3.6183 13.4185 3.75 13.75 3.75H16.25V10C16.25 11.6576 15.5915 13.2473 14.4194 14.4194C13.2473 15.5915 11.6576 16.25 10 16.25C8.34239 16.25 6.75268 15.5915 5.58058 14.4194C4.40848 13.2473 3.75 11.6576 3.75 10V3.75H6.25C6.58152 3.75 6.89946 3.6183 7.13388 3.38388C7.3683 3.14946 7.5 2.83152 7.5 2.5C7.5 2.16848 7.3683 1.85054 7.13388 1.61612C6.89946 1.3817 6.58152 1.25 6.25 1.25H2.5C2.16848 1.25 1.85054 1.3817 1.61612 1.61612C1.3817 1.85054 1.25 2.16848 1.25 2.5V10C1.25402 12.1019 2.01386 14.1322 3.3908 15.7203C4.76773 17.3083 6.6699 18.3482 8.75 18.65V20C8.75 22.3206 9.67187 24.5462 11.3128 26.1872C12.9538 27.8281 15.1794 28.75 17.5 28.75C19.8206 28.75 22.0462 27.8281 23.6872 26.1872C25.3281 24.5462 26.25 22.3206 26.25 20V16.015C26.9792 15.7599 27.6114 15.2848 28.0591 14.6552C28.5069 14.0256 28.7483 13.2726 28.75 12.5Z" fill="white"/>
                                                </svg>
                                                <div>
                                                    <p className="fs-14 text-white op5 mb-1">Maladie</p>
                                                    <span className="fs-18 text-white">Cold & Flu</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-info d-flex align-items-start">
                                            <div className="me-auto pe-3">
                                                <h2 className="font-w600 mb-2 text-black">{}</h2>
                                                <p className="mb-2">{patient ? patient.fullname : '---'}</p>
                                                <span className="date">
                                                    <i className="las la-clock"></i>
                                                    Créé le {patient ? patient.created_at : '---'}
                                                </span>
                                            </div>
                                            <span className="mr-ico bg-primary">
                                                {patient ? 
                                                <>
                                                {patient.gender === 'male' ?
                                                    <i className="fa-solid fa-mars"></i> : 
                                                    patient.gender === 'female' ? 
                                                    <i className="fa-solid fa-venus"></i> : 
                                                    <i className="fa-solid fa-venus-mars"></i>
                                                }
                                                </>
                                                : '---'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-12 col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="media align-items-center">
                                                <i className="las la-map-marker text-primary fs-34 me-3"></i>
                                                <div className="media-body">
                                                    <span className="d-block mb-1">Adresse</span>
                                                    <p className="fs-18 mb-0 text-black">{patient ? patient.address : '---'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="media align-items-center">
                                                <i className="las la-calendar-check fs-30 text-primary me-3" />
                                                <div className="media-body">
                                                    <span className="d-block mb-1">Date de naissance</span>
                                                    <p className="fs-18 mb-0 text-black">{patient ? patient.date_of_birth : '---'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-lg-12 col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="media align-items-center">
                                                <i className="las la-phone fs-30 text-primary me-3" />
                                                <div className="media-body">
                                                    <span className="d-block mb-1">Téléphone</span>
                                                    <p className="fs-18 mb-0 text-black">{patient ? patient.phone : '---'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="media align-items-center">
                                                <i className="las la-envelope-open fs-30 text-primary me-3" />
                                                <div className="media-body">
                                                    <span className="d-block mb-1">E-mail</span>
                                                    <p className="fs-18 mb-0 text-black">{patient ? patient.email : '---'}</p>
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
                        <div className="col-xl-12 col-xxl-4 col-lg-5">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-0">Assigned Doctor</h4>                                    
                                    <Dropdown className="ms-auto c-pointer">
                                        <Dropdown.Toggle className="btn-link i-false" as="div">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu-end" align="end">
                                            <Dropdown.Item>Accept Patient</Dropdown.Item>
                                            <Dropdown.Item>Reject Order</Dropdown.Item>
                                            <Dropdown.Item>View Details</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body">
                                    <div className="media mb-4 align-items-center">
                                        <img src={IMAGES.User22} alt="" width="85" className="me-3" />
                                        <div className="media-body">
                                            <h3 className="fs-18 font-w600 mb-1"><Link to={"#"} className="text-black">Dr. Elisabeth Moss</Link></h3>
                                            <span className="fs-14">Dentist</span>
                                            <ul className="stars">
                                                <li><i className="las la-star"></i></li>
                                                <li><i className="las la-star"></i></li>
                                                <li><i className="las la-star"></i></li>
                                                <li><i className="las la-star"></i></li>
                                                <li><i className="las la-star text-dark"></i></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <Link to={"#"} className="btn btn-outline-dark mb-2 btn-sm d-block">Unassign</Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to={"#"} className="btn btn-primary light mb-2 btn-sm d-block">Check</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 col-xxl-8 col-lg-7">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div>
                                        <h4 className="fs-20 text-black mb-1">Patient Statistic</h4>
                                        <span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-xl-12 col-xxl-6 col-sm-6">
                                            <div id="pieChart" className='d-flex justify-content-center'>
                                                <PatientPieChart />
                                            </div>
                                        </div>
                                        <div className="mt-4 col-xl-12 col-xxl-6 col-sm-6">
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
                                    </div>
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