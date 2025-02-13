import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/AxiosInstance';
import { Tab, Nav } from 'react-bootstrap';
import PatientTab from '../Element/PatientTab';

const Hospitalisation = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dashboard/admission`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setData(data);
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
        <div className="card">
            <Tab.Container defaultActiveKey="Daily">
                <div className="card-header d-sm-flex d-block pb-0 border-0">
                    <div className="me-auto pe-3">
                        <h4 className="text-black fs-20 mb-0">Hospitalisations</h4>
                    </div>
                    <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
                        <Nav as="ul" className="nav nav-tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="Daily">Jour</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Weekly">Semaine</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Monthly">Mois</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </div>
                <div className="card-body">
                    <Tab.Content>
                        <Tab.Pane eventKey="Daily">
                            <PatientTab 
                                totalpatient={data ? data.patients_day_count : 0} 
                                patients={data ? data.patients_day : []} 
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Weekly">
                            <PatientTab 
                                totalpatient={data ? data.patients_week_count : 0} 
                                patients={data ? data.patients_week : []} 
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Monthly">
                            <PatientTab 
                                totalpatient={data ? data.patients_month_count : 0} 
                                patients={data ? data.patients_month : []}  
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>
        </div>
    )
}

export default Hospitalisation;