import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

import { SVGICON } from '../../constant/theme';
import CardWidget from './Element/CardWidget';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import Appointment from './Element/Appointment';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import Hospitalisation from './Element/Hospitalisation';
import RevenueSummary from './Element/RevenueSummary';

const Home = ({ currentUser, title }) => {
	registerLocale("fr", fr);

	const [doctors, setDoctors] = useState([]);
	const [patients, setPatients] = useState([]);

	const [cardBlog, setCardBlog] = useState([
		{ id: 'appointment', svg: SVGICON.calander, number: '---', subtitle: 'Rendez-vous', progress: '50%' },
		{ id: 'total_patient', svg: SVGICON.heart, number: '---', subtitle: 'Total Patient', progress: '80%' },
		{ id: 'total_doctor', svg: SVGICON.stetho, number: '---', subtitle: 'Total Médecin', progress: '38%' },
		{ id: 'earning', svg: SVGICON.money, number: '---', subtitle: 'Gains hôpital', progress: '70%' },
	]);

	useDocumentTitle(title);

	useEffect(() => {
		const controller = new AbortController();

		(() => {
			axiosInstance.get('dashboard', { signal: controller.signal })
				.then(function ({ data }) {
					setCardBlog(prevState =>
						prevState.map(blog => blog.id === 'appointment' ? { ...blog, number: data.appointments_count } : blog));
					setCardBlog(prevState =>
						prevState.map(blog => blog.id === 'total_patient' ? { ...blog, number: data.patients_count } : blog));
					setCardBlog(prevState =>
						prevState.map(blog => blog.id === 'total_doctor' ? { ...blog, number: data.doctors_count } : blog));
					setCardBlog(prevState =>
						prevState.map(blog => blog.id === 'earning' ? { ...blog, number: parse(data.earning) } : blog));

					setDoctors(data.doctors);
					setPatients(data.patients);
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
			<div className="form-head d-flex align-items-center mb-sm-4 mb-3">
				<div className="me-auto">
					<h2 className="text-black font-w600">Tableau de bord</h2>
					<p className="mb-0">Hospital Admin Dashboard</p>
				</div>
			</div>
			<ToastContainer />
			<div className="row">
				{cardBlog.map((item, index) => (
					<div className="col-xl-3 col-sm-6" key={index}>
						<CardWidget number={item.number} subtitle={item.subtitle} svg={item.svg} progress={item.progress} />
					</div>
				))}
			</div>
			<div className="row">
				<div className="col-xl-6">
					<div className="row">
						<Hospitalisation />
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						{/*<div className="col-xl-12">
							<Appointment doctors={doctors} patients={patients} locale={fr} currentUser={currentUser} />
						</div>*/}
						<div className="col-xl-12">
							<RevenueSummary />
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