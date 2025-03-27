import React, { useState, useEffect } from "react";
import { ButtonGroup, Dropdown, SplitButton } from "react-bootstrap";
import { Link } from "react-router-dom";

import LogoutPage from './Logout';

import { connect } from "react-redux";
import emitter from "../../../context/eventEmitter";
import profile from './../../../images/profile/17.jpg';
import GlobalSearch from "./GlobalSearch";
import { notifyInfo } from "../../constant/theme";
import { store } from "../../../store/store";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import axiosInstance from "../../../services/AxiosInstance";
import PatientModal from "../../components/Patient/modal/PatientModal";
import ConsultationModal from "../../components/consultation/modal/ConsultationModal";

const Header = ({ onNote, currentUser }) => {
	const [notifications, setNotifications] = useState([]);
	const [headerFix, setheaderFix] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState(currentUser ? currentUser.avatar_url : profile);

	const [openPatientModal, setOpenPatientModal] = useState(false);

	const handleAddPatient = (patient, type) => {
		if (type === 'add') {
			emitter.emit('patientAdded', JSON.stringify(patient));

        	setOpenPatientModal(false);
		}
    };

	const [openConsultationModal, setOpenConsultationModal] = useState(false);
	const [consultationAction, setConsultationAction] = useState(0);

	const handleOpenConsultation = () => {
        setConsultationAction((prevState) => prevState + 1);
        setOpenConsultationModal(true); 
    }

	const handleAddConsultation = (consultation, type) => {
		if (type === 'add') {
			emitter.emit('consultationAdded', JSON.stringify(consultation));
			
        	setOpenConsultationModal(false);
		}
    };

	useEffect(() => {
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});

		const handleAvatarUrlChange = (message) => {
			setAvatarUrl(message);
		};

		emitter.on('avatarUrlChange', handleAvatarUrlChange);

		const state = store.getState();
		const token = state.auth.auth.idToken;

		window.Pusher = Pusher;

		const echo = new Echo({
			broadcaster: 'pusher',
			key: process.env.REACT_APP_PUSHER_KEY,
			wsHost: `ws-eu.pusher.com`,
			wsPort: 80,
			wssPort: 443,
			forceTLS: true,
			enabledTransports: ['ws', 'wss'],
			cluster: 'eu',
			encrypted: true,
			authEndpoint: process.env.REACT_APP_AUTH_ENDPOINT,
			auth: {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			},
		});

		echo.private(`appointment.doctor.${currentUser.id}`)
			.listen(".appointment-created", (data) => {
				const message = `Nouveau rendez-vous.<br> M./Mde/Mlle ${data.patient_name} souhaite vous rencontrez le ${data.format_datetime}.
							<br><i>${data.reason1}</i>`;

				notifyInfo(<div dangerouslySetInnerHTML={{ __html: message }} />);
			});

		const controller = new AbortController();

		(() => {
			axiosInstance.get('notifications', { signal: controller.signal })
				.then(function ({ data }) {
					setNotifications([...data.notifications].reverse());
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
			emitter.off('avatarUrlChange', handleAvatarUrlChange);
			echo.leaveChannel(`appointment.doctor.${currentUser.id}`);
			echo.disconnect();
			controller.abort();
		};
	}, []);

	return (
		<>
			<div className={`header ${headerFix ? "is-fixed" : ""}`}>
				<div className="header-content">
					<nav className="navbar navbar-expand">
						<div className="collapse navbar-collapse justify-content-between">
							<div className="header-left">
								<GlobalSearch />
								<div className="button-dropdown ms-2">
									<SplitButton
										as={ButtonGroup}
										variant="primary"
										id="dropdown-button-drop-dwon"
										drop="dwon"
										title="Raccourci"
									>
										<Dropdown.Item onClick={() => setOpenPatientModal(true)}>Ajouter un patient</Dropdown.Item>
										<Dropdown.Item onClick={handleOpenConsultation}>Nouvelle une consultation</Dropdown.Item>
										{/*<Dropdown.Item href="#">Créer un dossier médical</Dropdown.Item>*/}
										<Dropdown.Item as={Link} to='/invoices/create'>Nouvelle facture</Dropdown.Item>
									</SplitButton>
								</div>
							</div>
							<ul className="header-right navbar-nav ">
								<Dropdown as="li" className="nav-item dropdown notification_dropdown">
									<Dropdown.Toggle className="nav-link i-false c-pointer" variant="" as="a">
										<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M22.75 15.8385V13.0463C22.7471 10.8855 21.9385 8.80353 20.4821 7.20735C19.0258 5.61116 17.0264 4.61555 14.875 4.41516V2.625C14.875 2.39294 14.7828 2.17038 14.6187 2.00628C14.4546 1.84219 14.2321 1.75 14 1.75C13.7679 1.75 13.5454 1.84219 13.3813 2.00628C13.2172 2.17038 13.125 2.39294 13.125 2.625V4.41534C10.9736 4.61572 8.97429 5.61131 7.51794 7.20746C6.06159 8.80361 5.25291 10.8855 5.25 13.0463V15.8383C4.26257 16.0412 3.37529 16.5784 2.73774 17.3593C2.10019 18.1401 1.75134 19.1169 1.75 20.125C1.75076 20.821 2.02757 21.4882 2.51969 21.9803C3.01181 22.4724 3.67904 22.7492 4.375 22.75H9.71346C9.91521 23.738 10.452 24.6259 11.2331 25.2636C12.0142 25.9013 12.9916 26.2497 14 26.2497C15.0084 26.2497 15.9858 25.9013 16.7669 25.2636C17.548 24.6259 18.0848 23.738 18.2865 22.75H23.625C24.321 22.7492 24.9882 22.4724 25.4803 21.9803C25.9724 21.4882 26.2492 20.821 26.25 20.125C26.2486 19.117 25.8998 18.1402 25.2622 17.3594C24.6247 16.5786 23.7374 16.0414 22.75 15.8385ZM7 13.0463C7.00232 11.2113 7.73226 9.45223 9.02974 8.15474C10.3272 6.85726 12.0863 6.12732 13.9212 6.125H14.0788C15.9137 6.12732 17.6728 6.85726 18.9703 8.15474C20.2677 9.45223 20.9977 11.2113 21 13.0463V15.75H7V13.0463ZM14 24.5C13.4589 24.4983 12.9316 24.3292 12.4905 24.0159C12.0493 23.7026 11.716 23.2604 11.5363 22.75H16.4637C16.284 23.2604 15.9507 23.7026 15.5095 24.0159C15.0684 24.3292 14.5411 24.4983 14 24.5ZM23.625 21H4.375C4.14298 20.9999 3.9205 20.9076 3.75644 20.7436C3.59237 20.5795 3.50014 20.357 3.5 20.125C3.50076 19.429 3.77757 18.7618 4.26969 18.2697C4.76181 17.7776 5.42904 17.5008 6.125 17.5H21.875C22.571 17.5008 23.2382 17.7776 23.7303 18.2697C24.2224 18.7618 24.4992 19.429 24.5 20.125C24.4999 20.357 24.4076 20.5795 24.2436 20.7436C24.0795 20.9076 23.857 20.9999 23.625 21Z" fill="#007A64" />
										</svg>
										<span className="badge light text-white bg-primary">{notifications.length}</span>
									</Dropdown.Toggle>
									<Dropdown.Menu align="end" className="mt-2 dropdown-menu dropdown-menu-end">
										<div className="widget-media dz-scroll p-3 height380">
											<ul className="timeline">
												{notifications.length > 0 ? notifications.map((notification, index) => (
													<li key={index}>
														<div className="timeline-panel">
															<div className={`media me-2 media-info`}><i className="fa fa-home" /></div>
															<div className="media-body">
																<h6 className="mb-1">{notification.title}</h6>
																<small className="d-block">{notification.date}</small>
															</div>
														</div>
													</li>))
													:
													<li>Aucune notification</li>}
											</ul>
											<div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
												<div className="ps__thumb-x" tabIndex={0} style={{ left: 0, width: 0 }} />
											</div>
											<div className="ps__rail-y" style={{ top: 0, right: 0 }}>
												<div className="ps__thumb-y" tabIndex={0} style={{ top: 0, height: 0 }} />
											</div>
										</div>
										<Link className="all-notification" to="/notifications">
											Voir toutes les notifications <i className="ti-arrow-right" />
										</Link>
									</Dropdown.Menu>
								</Dropdown>
								<Dropdown as="li" className="nav-item header-profile">
									<Dropdown.Toggle className="nav-link i-false p-0" as="div">
										<img src={avatarUrl} alt={currentUser ? currentUser.lastname : '---'} width="20" />
									</Dropdown.Toggle>
									<Dropdown.Menu align="end">
										<Link to={"/edit-profile"} className="dropdown-item ai-icon ">
											<svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
											</svg>
											<span className="ms-2">Modifier le profil</span>
										</Link>
										<LogoutPage />
									</Dropdown.Menu>
								</Dropdown>
							</ul>
						</div>
					</nav>
				</div>
			</div>
			<PatientModal 
				show={openPatientModal}
				onHide={() => setOpenPatientModal(false)}
				onSave={handleAddPatient}
				patient={null}
			/>
			<ConsultationModal 
				action={consultationAction}
				show={openConsultationModal}
				onHide={() => setOpenConsultationModal(false)}
				onSave={handleAddConsultation}
				consultation={null}
			/>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.auth.auth.currentUser
	};
};

export default connect(mapStateToProps)(Header);
