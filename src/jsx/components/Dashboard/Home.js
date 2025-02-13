import React, { useEffect, useState } from 'react';
import {Tab, Nav, Dropdown} from 'react-bootstrap';
import parse from 'html-react-parser';
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

import { IMAGES, SVGICON } from '../../constant/theme';
import RecoveredChart from './Element/RecoveredChart';
import VisitorsChart from './Element/VisitorsChart';
import RevenuChart from './Element/RevenuChart';
import CardWidget from './Element/CardWidget';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import Appointment from './Element/Appointment';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import Hospitalisation from './Element/Hospitalisation';

const Home = ({currentUser, title}) => {	
	registerLocale("fr", fr);

	const [doctors, setDoctors] = useState([]);

	const [selectYear, setSelectYear] = useState(2023);

	const [cardBlog, setCardBlog] = useState([
		{id: 'appointment', svg: SVGICON.calander, number:'---', subtitle:'Rendez-vous', progress:'50%' },
		{id: 'total_patient', svg: SVGICON.heart, number:'---', subtitle:'Total Patient', progress:'80%' },
		{id: 'total_doctor', svg: SVGICON.stetho, number:'---', subtitle:'Total Médecin', progress:'38%' },
		{id: 'earning', svg: SVGICON.money, number:'---', subtitle:'Gains hôpital', progress:'70%' },
	]);

	useDocumentTitle(title);

	useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('dashboard', {signal: controller.signal})
                .then(function({data}) {
					setCardBlog(prevState => 
						prevState.map(blog => blog.id === 'appointment' ? {...blog, number: data.appointments_count} : blog));
                    setCardBlog(prevState => 
						prevState.map(blog => blog.id === 'total_patient' ? {...blog, number: data.patients_count} : blog));
					setCardBlog(prevState => 
						prevState.map(blog => blog.id === 'total_doctor' ? {...blog, number: data.doctors_count} : blog));
					setCardBlog(prevState => 
						prevState.map(blog => blog.id === 'earning' ? {...blog, number: parse(data.earning)} : blog));

					setDoctors(data.doctors);
                })
                .catch(function(error) {
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

	return(
		<>
			<div className="form-head d-flex align-items-center mb-sm-4 mb-3">
				<div className="me-auto">
					<h2 className="text-black font-w600">Tableau de bord</h2>
					<p className="mb-0">Hospital Admin Dashboard</p>
				</div>
			</div>
			<ToastContainer />
			<div className="row">
				{cardBlog.map((item, index)=>(
					<div className="col-xl-3 col-sm-6" key={index}>						
						<CardWidget number={item.number} subtitle={item.subtitle} svg={item.svg} progress={item.progress} />
					</div>
				))}				
			</div>
			<div className="row">
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">	
							<Hospitalisation />
						</div>
						<div className="col-xl-6 col-xxl-12 col-md-6">
							<div className="card">
								<div className="card-header d-block border-0 pb-0">
									<div className="d-flex mb-3">
										<h3 className="fs-20 text-black mb-0">Patient Overview</h3>
										<Dropdown className="ms-auto c-pointer">
											<Dropdown.Toggle className="btn-link i-false" as="div">
												{SVGICON.dropsvg}
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu-end" align="end">
												<Dropdown.Item className="text-black">Info</Dropdown.Item>
												<Dropdown.Item className="text-black">Details</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="d-flex">
										<div className="d-flex me-auto align-items-center">
											<svg width="12" height="54" viewBox="0 0 12 54" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect width="12" height="54" fill="#BDA25C"/>
											</svg>
											<div className="ms-2">
												<p className="mb-1">New</p>
												<span className="text-black font-w500">451</span>
											</div>
										</div>
										<div className="d-flex align-items-center">
											<svg width="12" height="54" viewBox="0 0 12 54" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect width="12" height="54" fill="#209F84"/>
											</svg>
											<div className="ms-2">
												<p className="mb-1">Recovered</p>
												<span className="text-black font-w500">623</span>
											</div>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="chartTimeline">
										<RecoveredChart />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-md-6">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0">Visitors</h3>
									<Dropdown className="ms-auto c-pointer">
										<Dropdown.Toggle className="btn-link i-false" as="div">
											{SVGICON.dropsvg}
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end" align="end">
											<Dropdown.Item className="text-black">Info</Dropdown.Item>
											<Dropdown.Item className="text-black">Details</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body pb-0">
									<ul className="users-sm mb-3">
										<li><img src={IMAGES.User6} alt="" /></li>
										<li><img src={IMAGES.User7} alt="" /></li>
										<li><img src={IMAGES.User8} alt="" /></li>
										<li><img src={IMAGES.User9} alt="" /></li>
										<li><img src={IMAGES.User10} alt="" /></li>
									</ul>
									<div className="d-flex align-items-center">
										<svg className="me-3" width="30" height="19" viewBox="0 0 30 19" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" clipRule="evenodd" d="M28.8124 0.990788C29.6459 1.71558 29.734 2.97884 29.0092 3.81236L20.2578 13.8765C18.859 15.4851 16.4444 15.7141 14.7681 14.397L10.6176 11.1359L3.37074 17.9564C2.56639 18.7134 1.30064 18.6751 0.543606 17.8707C-0.213427 17.0664 -0.175071 15.8006 0.629276 15.0436L7.8761 8.22306C9.317 6.86692 11.5329 6.76809 13.0888 7.99059L17.2394 11.2517L25.9908 1.18764C26.7156 0.354128 27.9788 0.265993 28.8124 0.990788Z" fill="#007A64"/>
										</svg>
										<div>
											<p className="fs-12 mb-0">Customer</p>
											<span className="fs-22 text-black font-w600">765 Person</span>
										</div>
									</div>
									<div id="lineChart">
										<VisitorsChart />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">	
							<Appointment doctors={doctors} locale={fr} />
						</div>
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0 me-2">Revenue Summary</h3>
									<Dropdown className="dropdown mt-sm-0 mt-3">
										<Dropdown.Toggle type="button" as="div" className="btn bg-light text-primary">
											{selectYear}
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end" align="end">
											<Dropdown.Item onClick={()=>setSelectYear('2021')}>2021</Dropdown.Item>
											<Dropdown.Item onClick={()=>setSelectYear('2022')}>2022</Dropdown.Item>
											<Dropdown.Item onClick={()=>setSelectYear('2023')}>2023</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body pt-0">
									<div id="chartBar">
										<RevenuChart />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(Home);