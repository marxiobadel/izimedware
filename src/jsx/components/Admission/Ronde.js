import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import Swal from "sweetalert2";
import { notifyInfo, notifySuccess } from "../../constant/theme";
import { Dropdown } from 'react-bootstrap';
import RondeModal from "./modal/RondeModal";

const Ronde = ({ admission }) => {
    const [rondes, setRondes] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const [editingRonde, setEditingRonde] = useState(null);

    const handleAdd = () => {
        setEditingRonde(null);
        setOpenModal(true); 
    }

    const handleAddOrEditRonde = (ronde, type) => {
        if (type === 'edit') {
            setRondes((prevState) =>
                prevState.map((state) => (state.id === ronde.id ? {...state, ...ronde} : state))
            );
        } else {
            setRondes((prevState) => [ronde, ...prevState]);
        }

        setOpenModal(false);
    };

    const handleEdit = (ronde) => {
        setEditingRonde(ronde);
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Etes-vous sûr ?',
            text: "Après suppression, vous ne pourrez pas récupérer la donnée supprimée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dd6b55',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Ok, supprimé !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`rondes/${id}`)
                    .then(({ data }) => {
                        setRondes((prevState) => prevState.filter((ronde) => ronde.id !== id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        if (error.response) {
                            if (error.response.status === 400) {
                                notifyInfo("La ronde ne peut être supprimée");
                            }
                        }
                    })
            }
        })
    };

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`admissions/${admission.id}/rondes`, { signal: controller.signal })
                .then(function ({ data }) {
                    setRondes([...data.rondes]);
                    setDoctors([...data.doctors]);
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
            <div className="card pb-0">
                <div className="card-header border-0 pb-0">
                    <h4 className="card-title">Rondes hospitalières</h4>
                    <button onClick={handleAdd} type="button" className="btn btn-xs btn-primary btn-rounded">
                        <i className="fa fa-plus color-info"></i>
                    </button>
                </div>
                <div className="card-body p-0">
                    <div
                        style={{ height: "370px" }}
                        id="DZ_W_Todo4"
                        className="widget-media dz-scroll height370  ps--active-y my-4 px-4"
                    >
                        <ul className="timeline">
                            {rondes.map(ronde => (
                                <li key={ronde.id}>
                                    <div className="timeline-panel">
                                        <div className="media-body">
                                            <h5 className="mb-0">{ronde.doctor_name} ({ronde.task})</h5>
                                            <small className="text-muted">{ronde.format_datetime}</small>
                                        </div>
                                        <Dropdown className="dropdown ms-2">
                                            <Dropdown.Toggle
                                                variant=" light"
                                                className="btn-secondary i-false p-0 sharp"
                                            >
                                                <svg
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    version="1.1"
                                                >
                                                    <g
                                                        stroke="none"
                                                        strokeWidth="1"
                                                        fill="none"
                                                        fillRule="evenodd"
                                                    >
                                                        <rect x="0" y="0" width="24" height="24" />
                                                        <circle fill="#000000" cx="5" cy="12" r="2" />
                                                        <circle fill="#000000" cx="12" cy="12" r="2" />
                                                        <circle fill="#000000" cx="19" cy="12" r="2" />
                                                    </g>
                                                </svg>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu">
                                                <Dropdown.Item className="dropdown-item" onClick={() => handleEdit(ronde)}>
                                                    Modifier
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDelete(ronde.id)} className="dropdown-item">
                                                    Supprimer
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <RondeModal
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAddOrEditRonde}
                ronde={editingRonde}
                admission={admission}
                doctors={doctors}
            />
        </>
    )
}

export default Ronde;