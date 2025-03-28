import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import { ToastContainer } from 'react-toastify';
import PageTitle from '../../layouts/PageTitle';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { notifyError, notifyInfo, notifySuccess } from '../../constant/theme';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import AutocompleteField from '../../constant/AutocompleteField';

const EditPrescription = ({currentUser}) => {
    const {id} = useParams();

    registerLocale("fr", fr);

    const [medicines, setMedicines] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [admissions, setAdmissions] = useState([]);

    const [patientName, setPatientName] = useState('');

    const [inputs, setInputs] = useState([]);

    const [saving, setSaving] = useState(false);

    const [datetime, setDatetime] = useState(new Date());
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [reason, setReason] = useState('');

    const handleAutocompleteSelect = (id) => {
        setSelectedPatientId(id);

        axiosInstance.get(`prescriptions/patients/${id}`)
            .then(function ({ data }) {
                setSelectedConsultation(null);
                setSelectedAdmission(null);
                
                setConsultations([...data.consultations]);
                setAdmissions([...data.admissions]);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

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

    const handlePrescriptionMedecines = (medicines) => {
        medicines.forEach(medicine => {
            const {id, name, pivotQuantity, unity, pivotDuration, pivotPosologie } = medicine;

            const newItem = {id, name, quantity: pivotQuantity, unity: unity.name, duration: pivotDuration, posologie: pivotPosologie};
            
            setInputs(prevState => {
                const exists = prevState.some((item) => item.id === id);
                return exists ? prevState : [...prevState, newItem];
            }); 
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSaving(true);

        axiosInstance.put(`prescriptions/${id}`, 
            {
                medicines: inputs, 
                doctor_id: (selectedDoctor ? selectedDoctor.id : null), 
                service_id: (selectedService ? selectedService.id : null),  
                consultation_id: (selectedConsultation ? selectedConsultation.id : null), 
                admission_id: (selectedAdmission ? selectedAdmission.id : null), 
                patient_id: (selectedPatientId ?? null), 
                datetime: format(datetime, 'yyyy-MM-dd HH:mm'),
                reason
            }, 
            {headers: { "Content-Type": "application/json" }})
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    for(const error in data.errors) {
                        notifyError(data.errors[error].join('\n\r'));
                    }
                } else {
                    notifySuccess(`Prescription modifiée avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    };

    useDocumentTitle('Modifier une prescription');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`prescriptions/${id}/edit`, {signal: controller.signal})
                .then(function ({ data }) {
                    console.log(data.data);
                    setMedicines([...data.medicines]);
                    setDoctors([...data.doctors]);
                    setServices([...data.services]);
                    setConsultations([...data.consultations]);
                    setAdmissions([...data.admissions]);

                    setDatetime(new Date(data.data.datetime));
                    setSelectedPatientId(data.data.patient ? data.data.patient.id : null);
                    setPatientName(data.data.patient ? data.data.patient.fullname : null);
                    setSelectedDoctor(data.doctors.find(d => d.id === data.data.doctor?.id) ?? null)
                    setSelectedService(data.services.find(s => s.id === data.data.service_id) ?? null);
                    setSelectedConsultation(data.consultations.find(c => c.id === data.data.consultation?.id) ?? null);
                    setSelectedAdmission(data.admissions.find(a => a.id === data.data.admission?.id) ?? null);
                    setReason(data.data.reason ?? '');

                    handlePrescriptionMedecines(data.data.medicines);
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
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
            <PageTitle pageContent={''} motherMenu={'Prescriptions'} activeMenu={'Modifier une prescription'} />
            <ToastContainer />
            <div className="row">
                <div className="col-12">
                    <div className="card card-bx">
                        <div className="card-body">
                            <div className="row align-items-end">
                                <div className="col-sm-4 mb-3">
                                    <label className="form-label">Date<span className="text-danger">*</span></label>
                                    <DatePicker 
                                        locale="fr"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Heure"
                                        className="form-control"
                                        selected={datetime} 
                                        onChange={datetime => setDatetime(datetime)} 
                                    />
                                </div>
                                <div className="col-sm-4 mb-3">
                                    <label className="form-label">Patient<span className="text-danger">*</span></label>
                                    <AutocompleteField initialName={patientName} onSelect={handleAutocompleteSelect} />
                                </div>
                                <div className="col-sm-4 mb-3">
                                    <label className="form-label">Médecin<span className="text-danger">*</span></label>
                                    <Select options={doctors} className="custom-react-select"
                                        placeholder='Choisir un médecin'
                                        isSearchable
                                        value={selectedDoctor}
                                        onChange={setSelectedDoctor}
                                        getOptionValue={d => d.id}
                                        getOptionLabel={d => d.fullname}
                                    />
                                </div>
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label">Consultation</label>
                                    <Select options={consultations} className="custom-react-select"
                                        placeholder='Choisir une consultation'
                                        isSearchable
                                        isClearable
                                        value={selectedConsultation}
                                        onChange={setSelectedConsultation}
                                        getOptionValue={d => d.id}
                                        getOptionLabel={d => `${d.reference} (${d.format_datetime})`}
                                    />
                                </div>
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label">Hospitalisation</label>
                                    <Select options={admissions} className="custom-react-select"
                                        placeholder='Choisir une hospitalisation'
                                        isSearchable
                                        isClearable
                                        value={selectedAdmission}
                                        onChange={setSelectedAdmission}
                                        getOptionValue={d => d.id}
                                        getOptionLabel={d => `${d.reference} (${d.format_entry_date})`}
                                    />
                                </div>
                                <div className="col-sm-3 mb-3 prescription">
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
                                <div className="col-sm-3 mb-3">
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
                                <div className="col-12 col-sm-4 mb-3">
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
                                <div className="col-12 col-sm-8 mb-3">
                                    <label className="form-label">Note globale</label>
                                    <textarea 
                                        rows={2} 
                                        className="form-control" 
                                        value={reason} 
                                        onChange={(event) => setReason(event.target.value)}></textarea>
                                </div>
                                <div className="col-12 d-flex justify-content-end">
                                    <button onClick={handleSubmit} disabled={inputs.length === 0 || saving} className="btn btn-primary">
                                        Mettre à jour
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(EditPrescription);