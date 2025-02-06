import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../../hooks/useTitle";
import { Accordion } from "react-bootstrap";
import ResultModal from "./modal/ResultModal";
import { notifySuccess } from "../../constant/theme";

const ShowExamen = () => {
    const { id } = useParams();

    const [examen, setExamen] = useState(null);

    const [results, setResults] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const handleSaveResult = (result) => {
        setResults([...results, result]);

        notifySuccess("Résultat ajouté avec succès.");

        setOpenModal(false);
    }

    const handleDeleteResult = (id) => {
        axiosInstance.delete(`examens/results/${id}`)
            .then(function ({ data }) {
                setResults((prevState) => prevState.filter((r) => r.id !== id));
             
                notifySuccess(data.message);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useDocumentTitle("Détail de l'examen");
 
    useEffect(() => {
        (() => {
            axiosInstance.get(`examens/${id}`)
                .then(function ({ data }) {
                    setExamen(data.data);
                    setResults(data.data.results);
                    console.log(data.data.results)
                })
                .catch(function (error) {
                    console.log(error);
                });
        })();
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Examen'} activeMenu={"Détail de l'examen"} />
            <ToastContainer />
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body pb-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>ID</strong><span class="mb-0">{examen ? examen.reference : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Type</strong><span class="mb-0">{examen ? examen.type.name : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Date</strong><span class="mb-0">{examen ? examen.date : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Patient</strong><span class="mb-0">{examen ? examen.patient.reference : '---'}</span>
                                </li>
                                <li className="list-group-item d-flex px-0 justify-content-between">
                                    <strong>Responsable</strong><span class="mb-0">{examen ? examen.doctor.reference : '---'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <span>Résultats</span>
                            <span className="float-right">
                                <button onClick={() => setOpenModal(true)} type="button" className="btn btn-xs btn-primary">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </span>
                        </div>
                        <div className="card-body pb-0">
                            {examen && results && 
                            (results.length === 0 ? 
                                <div className="d-flex align-items-center justify-content-center">
                                    Aucun résultat d'examen
                                </div> :
                                <Accordion className="accordion accordion-rounded-stylish accordion-bordered" defaultActiveKey="0">
                                    {results.map((result, i) => (
                                    <Accordion.Item  key={i} eventKey={`${i}`}>
                                        <Accordion.Header className="accordion-header accordion-header-primary">
                                            Résultat #{i + 1}
                                            <span className="accordion-header-indicator "></span>					              
                                        </Accordion.Header>
                                        <Accordion.Collapse eventKey={`${i}`} className="accordion__body">
                                            <div className="accordion-body">
                                                {result.content}
                                                <div className="text-end mt-2">
                                                    {result.file_url &&
                                                    <Link to={'#'} onClick={() => window.open(result.file_url, "_blank", "noopener,noreferrer")}>
                                                        <i className="fa fa-download text-dark me-3"></i>
                                                    </Link>}
                                                    <Link to={'#'} onClick={() => handleDeleteResult(result.id)}>
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
            <ResultModal 
                id={id}
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleSaveResult}
                examen={examen}
            />
        </>
    )
}

export default ShowExamen;