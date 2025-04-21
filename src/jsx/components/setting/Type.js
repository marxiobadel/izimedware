import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import axiosInstance from '../../../services/AxiosInstance';
import { notifyInfo, notifySuccess } from '../../constant/theme';
import Swal from 'sweetalert2';
import TypeModal from './modal/TypeModal';
import Select from 'react-select';

const selectStyles = {
    control: (provided) => ({
        ...provided,
        minWidth: "164px", 
    }),
};

const Type = () => {
    const [types, setTypes] = useState([]);

    const data = [
        {value: 'exam', label: "d'examen"},
        {value: 'leave', label: "de congé"},
        {value: 'equipement', label: "d'équipement"},
        {value: 'room', label: "de chambre"},
        {value: 'antecedent', label: "d'antécédent"},
        {value: 'soin', label: "de soin"},
    ];

    const [selectedData, setSelectedData] = useState(data[0]);

    const [openModal, setOpenModal] = useState(false);
           
    const [loading, setLoading] = useState(true);

    const handleAdd = (type) => {
        setTypes((prevState) => [type, ...prevState]);

        setOpenModal(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title:'Etes-vous sûr ?',
            text: "Après suppression, vous ne pourrez pas récupérer la donnée supprimée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dd6b55',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Ok, supprimé !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`types/${id}`)
                    .then(({data}) => {
                        setTypes((prevState) => prevState.filter((state) => state.id !== id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        if (error.response) {
                            if (error.response.status === 400) {
                                notifyInfo("Les types déjà assignées ne peuvent être supprimées");
                            }
                        }
                    })
            }
        })
    };

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`types?status=${selectedData.value}`, {signal: controller.signal})
                .then(function({data}) {
                    setTypes([...data.types]);
                })
                .catch(function(error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                }).finally(function() {
                    setLoading(false);
                });     
        })();

        return () => {
            controller.abort();
        }
    }, [selectedData]);

    return (
        <>
            <div className="card pb-0">
                <div className="card-header border-0 pb-0">
                    <h4 className="card-title">Types</h4> 
                    <Select options={data} styles={selectStyles}
                        placeholder='Choisir un type'
                        value={selectedData}
                        onChange={setSelectedData} 
                    />
                    <button onClick={() => setOpenModal(true)} type="button" className="btn btn-xs btn-primary btn-rounded">
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
                            {loading ? 
                                <li className="text-center">...</li>
                            :
                                types.map(type => (
                                    <li key={type.id}>
                                        <div className="timeline-panel">
                                            <div className="media-body">
                                                <h5 className="mb-0">{type.name}</h5>
                                                <small className="text-muted">{type.created_at}</small>
                                            </div>
                                            <Dropdown className="dropdown">
                                                <Dropdown.Toggle
                                                    variant=" light"
                                                    className="btn-danger i-false p-0 sharp"
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
                                                    <Dropdown.Item
                                                        onClick={() => handleDelete(type.id)}
                                                        className="dropdown-item"
                                                    >
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
            <TypeModal
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAdd}
                statusObject={selectedData}
            />
        </>
    )
}

export default Type;