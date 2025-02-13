import React from 'react';

const PatientTab = (props) => {
    return (
        <>
            <div className="d-flex flex-wrap align-items-center px-4 bg-light">
                <div className="me-auto d-flex align-items-center py-3">
                    <span className="heart-ai bg-primary me-3">
                        <i className="fa-regular fa-heart" aria-hidden="true"></i>
                    </span>
                    <div>
                        <p className="fs-18 mb-2">Total Patient</p>
                        <span className="fs-26 text-primary font-w600">{props.totalpatient}</span>
                    </div>
                </div>
                <ul className="users ps-3 py-2">
                    {props.patients.map((patient, index) => (
                        <li key={index}>
                            <img style={{ objectFit: 'cover' }} src={patient.avatar_url} alt={patient.fullname} width="60px" height="60px"/>
                        </li>
                    ))}	
                </ul>
            </div>
        </>
    );
};

export default PatientTab;