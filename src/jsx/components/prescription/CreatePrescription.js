import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import { ToastContainer } from 'react-toastify';
import PageTitle from '../../layouts/PageTitle';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { notifyError, notifyInfo, notifySuccess } from '../../constant/theme';
import axios from 'axios';

const CreatePrescription = () => {
    const [medicines, setMedicines] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    const [inputs, setInputs] = useState([]);

    const [saving, setSaving] = useState(false);

    const [reference, setReference] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const isPatient = () => { 
        /** If the ref field is the ID of patient */
        return reference && reference.startsWith('PA-');
    }

    const handleReferenceChange = (value) => { 
        if (selectedDoctor) setSelectedDoctor(null);
        setReference(value);
    }

    const handleInputChange = (e, i) => {
        const field = e.target.name; 
        const newInputs = [...inputs]; 
        newInputs[i][field] = e.target.value; 
        setInputs(newInputs); 
    };

    const handleAddInput = () => {
        if (selectedMedicine) {
            const { id, name, unity } = selectedMedicine;
           
            const input = inputs.find(i => i.id === id);
            if (!input) {
                setInputs([...inputs, { id, name, quantity: 1, unity: unity.name, duration: '', posologie: '' }]); 
            }
  
            setSelectedMedicine(null);
        } else {
            notifyInfo('Merci de sélectionner au préalable un médicament.');
        }
    };

    const handleDeleteInput = (i) => {
        const newInputs = [...inputs]; 
        newInputs.splice(i, 1); 
        setInputs(newInputs); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSaving(true);

        const doctor_id = selectedDoctor ? selectedDoctor.id : null;
        const service_id = selectedService ? selectedService.id : null;

        axiosInstance.post('prescriptions', 
            {medicines: inputs, reference, doctor_id, service_id}, {
            headers: { "Content-Type": "application/json" }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    if (data.errors.reference) {
                        notifyError(data.errors.reference.join('\n\r'));
                    } else if (data.errors.doctor_id) {
                        notifyError(data.errors.doctor_id.join('\n\r'));
                    } else if (data.errors.posologie) {
                        notifyError(data.errors.posologie.join('\n\r'));
                    } else if (data.errors.quantity) {
                        notifyError(data.errors.quantity.join('\n\r'));
                    } else if (data.errors.duration) {
                        notifyError(data.errors.duration.join('\n\r'));
                    } else if (data.errors.service_id) {
                        notifyError(data.errors.service_id.join('\n\r'));
                    }
                } else {
                    setInputs([]);

                    notifySuccess(`Prescription ajoutée avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    };

    useDocumentTitle('Ajouter une prescription');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('prescriptions/create', {signal: controller.signal})
                .then(function ({ data }) {
                    setMedicines([...data.medicines]);
                    setDoctors([...data.doctors]);
                    setServices([...data.services]);
                })
                .catch(function (error) {
                    if (axios.isCancel(error)) {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                }).finally(function () {
                    setLoading(false);
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Prescriptions'} activeMenu={'Ajouter une prescription'} />
            <ToastContainer />
            <div className="row">
                <div className="col-12">
                    <div className="card card-bx">
                        <div className="card-body">
                            <div className="row align-items-end">
                                <div className="col-sm-4 col-md-3 mb-3 mb-lg-4">
                                    <label className="form-label">ID (Patient ou Consultation)</label>
                                    <input type="text"
                                        value={reference}
                                        onChange={event => handleReferenceChange(event.target.value)}
                                        className="form-control" />
                                </div>
                                <div className="col-sm-4 col-md-3 mb-3 mb-lg-4">
                                    <label className="form-label">Staff médical</label>
                                    <Select options={doctors} className="custom-react-select"
                                        isDisabled={loading || !isPatient()}
                                        placeholder={loading ? 'Chargement...' : (!isPatient() ? 'Non nécessaire' : 'Choisir un médecin')}
                                        isSearchable
                                        value={selectedDoctor}
                                        onChange={setSelectedDoctor}
                                        getOptionValue={d => d.id}
                                        getOptionLabel={d => d.fullname}
                                    />
                                </div>
                                <div className="col-sm-4 col-md-3 mb-3 mb-lg-4">
                                    <label className="form-label">Médicament</label>
                                    <Select options={medicines} className="custom-react-select"
                                        isDisabled={loading}
                                        placeholder={loading ? 'Chargement...' : 'Choisir un médicament'}
                                        isSearchable
                                        value={selectedMedicine}
                                        onChange={setSelectedMedicine}
                                        getOptionValue={m => m.id}
                                        getOptionLabel={m => m.name}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-3 mb-3 mb-lg-4">
                                    <button onClick={handleAddInput} className="btn btn-primary btn-lg btn-block">Ajouter à la liste</button>
                                </div>
                            </div>
                            <div className="row">
                                <Table responsive>
                                    <thead> 
                                        <tr>
                                            <th><strong>Nom</strong></th>
                                            <th><strong>Quantité</strong></th>
                                            <th><strong>Unité</strong></th>
                                            <th><strong>Durée (jour)</strong></th>
                                            <th><strong>Posologie</strong></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputs.length === 0 ?
                                            <tr className="text-center"><td colSpan={6}>Liste des médicaments</td></tr>
                                        :
                                            inputs.map((input, index) => ( 
                                                <tr key={index}>
                                                    <td>{input.name}</td>
                                                    <td>
                                                        <input type="number" value={input.quantity} name="quantity" required style={{width: '100px'}}
                                                            onChange={e => handleInputChange(e, index)}  
                                                            className="form-control" />                           
                                                    </td>
                                                        <td>{input.unity}</td> 
                                                    <td>
                                                        <input type="number" value={input.duration} name="duration" required style={{width: '100px'}}
                                                            onChange={e => handleInputChange(e, index)}  
                                                            className="form-control" />  
                                                    </td>
                                                    <td>
                                                        <input type="text" value={input.posologie} name="posologie"
                                                            onChange={e => handleInputChange(e, index)}  
                                                            className="form-control" />  
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={"#"} onClick={() => handleDeleteInput(index)} className="btn btn-danger shadow btn-xs sharp">
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-sm-4 col-md-3 mb-3 mb-md-0">
                                    <label className="form-label">Département<span className="text-danger">*</span></label>
                                    <Select options={services} className="custom-react-select"
                                        isDisabled={loading}
                                        placeholder={loading ? 'Chargement...' : 'Choisir un département'}
                                        isSearchable
                                        value={selectedService}
                                        onChange={setSelectedService}
                                        getOptionValue={s => s.id}
                                        getOptionLabel={s => s.name}
                                    />
                                </div>
                                <div className="col-12 col-md-12 d-flex justify-content-end">
                                    <button onClick={handleSubmit} disabled={inputs.length === 0 || saving} className="btn btn-primary">
                                        Sauvegarder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreatePrescription;