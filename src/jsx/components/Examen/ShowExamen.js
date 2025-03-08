import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../../hooks/useTitle";
import { Accordion } from "react-bootstrap";
import ResultModal from "./modal/ResultModal";
import { notifySuccess } from "../../constant/theme";
import Result from "./Result";

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
                setResults((prevState) => prevState.filter((state) => state.id !== id));

                notifySuccess(data.message);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useDocumentTitle("Détail de l'examen");

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`examens/${id}`, { signal: controller.signal })
                .then(function ({ data }) {
                    setExamen(data.data);
                    setResults(data.data.results.reverse());
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
            <PageTitle pageContent={''} motherMenu={'Examen'} activeMenu={"Détail de l'examen"} />
            <ToastContainer />
            <div className="row">
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body pb-0">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>ID</strong><span className="mb-0">{examen ? examen.reference : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Type</strong><span className="mb-0">{examen ? examen.type?.name : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Date</strong><span className="mb-0">{examen ? examen.format_date : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Patient</strong><span className="mb-0">{examen ? examen.patient_reference : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Responsable</strong><span className="mb-0">{examen ? examen.doctor?.reference : '---'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
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
                                            <Result key={i} result={result} index={i} destroy={handleDeleteResult} />
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