import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../../hooks/useTitle";
import { Accordion } from "react-bootstrap";
import { notifySuccess } from "../../constant/theme";
import ObservationModal from "./modal/ObservationModal";

const ShowConsultation = () => {
    const { id } = useParams();

    const [consultation, setConsultation] = useState(null);

    const [observations, setObservations] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const handleSaveObservation = (observation) => {
        setObservations([...observations, observation]);

        notifySuccess("Observation ajoutée avec succès.");

        setOpenModal(false);
    }

    const handleDeleteObservation = (id) => {
        axiosInstance.delete(`consultations/observations/${id}`)
            .then(function ({ data }) {
                setObservations((prevState) => prevState.filter((state) => state.id !== id));
             
                notifySuccess(data.message);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useDocumentTitle("Détail de la consultation"); 
 
    useEffect(() => {
        const controller = new AbortController(); 

        (() => {
            axiosInstance.get(`consultations/${id}`, {signal: controller.signal})
                .then(function ({ data }) {
                    setConsultation(data.data);
                    setObservations(data.data.observations);
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
            <PageTitle pageContent={''} motherMenu={'Consultation'} activeMenu={"Détail de consultation"} />
            <ToastContainer />
            <div className="row">
                <div className="col-md-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body pb-0">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>ID</strong><span className="mb-0">{consultation ? consultation.reference : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Date</strong><span className="mb-0">{consultation ? consultation.format_datetime : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex flex-column px-0">
                                            <strong className="mb-1">Patient</strong>
                                            <span className="mb-0">
                                                <span className="me-2">
                                                    {consultation ? (consultation.patient?.gender === 'male' ?
                                                        <i className="fa-solid fa-mars"></i> :
                                                        consultation.patient?.gender === 'female' ?
                                                            <i className="fa-solid fa-venus"></i> :
                                                            <i className="fa-solid fa-venus-mars"></i>) : '---'
                                                    }
                                                </span>
                                                {consultation &&
                                                <Link to={`/patient-details/${consultation.patient.id}`}>
                                                    #{consultation.patient?.reference}
                                                </Link>}
                                            </span>
                                            <span>{consultation ? consultation.patient?.fullname : '---'}</span>
                                            {consultation && consultation.patient && consultation.patient.phone &&
                                            <span className="text-end">({consultation.patient.phone})</span>}
                                        </li>
                                        <li className="list-group-item d-flex px-0 flex-column">
                                            <strong className="mb-1">Médecin</strong>
                                            {consultation &&
                                            <Link to={`/doctor-details/${consultation.doctor.id}`}>
                                                #{consultation.doctor?.reference}
                                            </Link>}
                                            <span>
                                                <i className="las la-stethoscope me-2 scale4"></i>
                                                {consultation ? consultation.doctor?.fullname : '---'}
                                            </span>
                                            {consultation && consultation.doctor.skills && consultation.doctor.skills.length > 0 &&
                                            <Link to={"#"} className="text-end">
                                                {consultation.doctor.skills[0].name}
                                            </Link>}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            <span>Observations</span>
                            <span className="float-right">
                                <button onClick={() => setOpenModal(true)} type="button" className="btn btn-xs btn-primary">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </span>
                        </div>
                        <div className="card-body pb-0">
                            {consultation && observations && 
                            (observations.length === 0 ? 
                                <div className="d-flex align-items-center justify-content-center">
                                    Aucune observation
                                </div> :
                                <Accordion className="accordion accordion-rounded-stylish accordion-bordered" defaultActiveKey="0">
                                    {observations.map((observation, i) => (
                                    <Accordion.Item  key={i} eventKey={`${i}`}>
                                        <Accordion.Header className="accordion-header accordion-header-primary">
                                            Observation #{i + 1} - {observation.created_at}
                                            <span className="accordion-header-indicator "></span>					              
                                        </Accordion.Header>
                                        <Accordion.Collapse eventKey={`${i}`} className="accordion__body">
                                            <div className="accordion-body">
                                                {observation.content}
                                                <div className="text-end mt-2">
                                                    {observation.file_url &&
                                                    <Link to={'#'} onClick={() => window.open(observation.file_url, "_blank", "noopener,noreferrer")}>
                                                        <i className="fa fa-download text-dark me-3"></i>
                                                    </Link>}
                                                    <Link to={'#'} onClick={() => handleDeleteObservation(observation.id)}>
                                                        <i className="fa fa-trash text-danger"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Accordion.Collapse>
                                    </Accordion.Item>
                                    ))}
                                </Accordion>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ObservationModal
                id={id}
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleSaveObservation}
                consultation={consultation}
            />
        </>
    )
}

export default ShowConsultation;