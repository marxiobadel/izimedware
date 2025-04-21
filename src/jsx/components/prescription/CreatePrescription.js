import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import { ToastContainer } from 'react-toastify';
import PageTitle from '../../layouts/PageTitle';
import Select from 'react-select';
import { Button, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { isMedecin, notifyError, notifyInfo, notifySuccess } from '../../constant/theme';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import AutocompleteField from '../../constant/AutocompleteField';
import { connect } from 'react-redux';
import { format } from 'date-fns';

const CreatePrescription = ({ currentUser }) => {
    registerLocale("fr", fr);

    const [searchParams] = useSearchParams();

    const dossier_id = searchParams.get("dossier_id");
    const consultation_id = searchParams.get("consultation_id");

    const [medicines, setMedicines] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [examens, setExamens] = useState([]);
    const [soins, setSoins] = useState([]);

    const [patientName, setPatientName] = useState('');

    const [inputsMedicine, setInputsMedicine] = useState([]);
    const [inputsExamen, setInputsExamen] = useState([]);
    const [inputsSoin, setInputsSoin] = useState([]);

    const [saving, setSaving] = useState(false);

    const [datetime, setDatetime] = useState(new Date());
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [selectedExamen, setSelectedExamen] = useState(null);
    const [selectedSoin, setSelectedSoin] = useState(null);
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

    const handleInputChange = (e, i, inputs, setInputs) => {
        const field = e.target.name;
        const newInputs = [...inputs];
        newInputs[i][field] = e.target.value;
        setInputs(newInputs);
    };

    const handleAddInputMedicine = () => {
        if (selectedMedicine) {
            const { id, name, unity } = selectedMedicine;

            const input = inputsMedicine.find(i => i.id === id);
            if (!input) {
                setInputsMedicine([...inputsMedicine, { id, name, quantity: 1, unity: unity.name, duration: '', posologie: '' }]);
            }

            setSelectedMedicine(null);
        } else {
            notifyInfo('Merci de sélectionner au préalable un médicament.');
        }
    };

    const handleAddInputSoin = () => {
        if (selectedSoin) {
            const { id, name } = selectedSoin;

            const input = inputsSoin.find(i => i.id === id);
            if (!input) {
                setInputsSoin([...inputsSoin, { id, name, duration: '', frequency: '', comment: '' }]);
            }

            setSelectedSoin(null);
        } else {
            notifyInfo('Merci de sélectionner au préalable un soin.');
        }
    };

    const handleAddInputExamen = () => {
        if (selectedExamen) {
            const { id, name } = selectedExamen;

            const input = inputsExamen.find(i => i.id === id);
            if (!input) {
                setInputsExamen([...inputsExamen, { id, name }]);
            }

            setSelectedExamen(null);
        } else {
            notifyInfo('Merci de sélectionner au préalable un examen.');
        }
    };

    const handleDeleteInput = (i, inputs, setInputs) => {
        const newInputs = [...inputs];
        newInputs.splice(i, 1);
        setInputs(newInputs);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSaving(true);

        axiosInstance.post('prescriptions',
            {
                medicines: inputsMedicine,
                examens: inputsExamen,
                soins: inputsSoin,
                doctor_id: (selectedDoctor ? selectedDoctor.id : null),
                service_id: (selectedService ? selectedService.id : null),
                dossier_id,
                consultation_id: (selectedConsultation ? selectedConsultation.id : null),
                admission_id: (selectedAdmission ? selectedAdmission.id : null),
                patient_id: (selectedPatientId ?? null),
                datetime: format(datetime, 'yyyy-MM-dd HH:mm'),
                reason
            }, {
            headers: { "Content-Type": "application/json" }
        })
            .then(function (response) {
                const data = response.data;

                if (Object.entries(data.data).length === 0 && data.errors) {
                    for (const error in data.errors) {
                        notifyError(data.errors[error].join('\n\r'));
                    }
                } else {
                    setInputsMedicine([]);
                    setInputsExamen([]);
                    setInputsSoin([]);

                    notifySuccess(`Prescription ajoutée avec succès`);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                setSaving(false);
            });
    };

    useDocumentTitle('Ajouter une prescription');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const url = consultation_id ? `prescriptions/create?consultation_id=${consultation_id}` : 'prescriptions/create';

        (() => {
            axiosInstance.get(url, { signal: controller.signal })
                .then(function ({ data }) {
                    setMedicines([...data.medicines]);
                    setDoctors([...data.doctors]);
                    setServices([...data.services]);
                    setExamens([...data.examens]);
                    setSoins([...data.soins]);
                    setConsultations([...data.consultations]);
                    setAdmissions([...data.admissions]);

                    if (data.consultation) {
                        setSelectedPatientId(data.consultation.patient_id);
                        setPatientName(data.consultation.patient_name);
                        setSelectedDoctor(data.doctors.find(d => d.id === data.consultation.doctor_id));
                        setSelectedConsultation(data.consultations.find(c => c.id === data.consultation.id) ?? null);

                        if (data.admission) {
                            setSelectedAdmission(data.admissions.find(a => a.id === data.admission.id) ?? null);
                        }
                    } else if (isMedecin(currentUser.roles)) {
                        setSelectedDoctor(currentUser ?? null);
                    }
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
            <PageTitle pageContent={''} motherMenu={'Prescriptions'} activeMenu={'Ajouter une prescription'} />
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
                            </div>
                            <div className="row">
                                <div className="col-12 my-2">
                                    <div className="hr-text">Médicaments</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-md-6 col-sm-3 col-12 mb-3 prescription">
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
                                <div className="col-sm-3 col-12 mb-3 d-flex align-items-end">
                                    <button onClick={handleAddInputMedicine} className="btn btn-primary btn-lg btn-block">Ajouter à la liste</button>
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
                                        {inputsMedicine.length === 0 ?
                                            <tr className="text-center"><td colSpan={6}>Liste des médicaments</td></tr>
                                            :
                                            inputsMedicine.map((input, index) => (
                                                <tr key={index}>
                                                    <td>{input.name}</td>
                                                    <td>
                                                        <input type="number" value={input.quantity} name="quantity" required style={{ width: '100px' }}
                                                            onChange={e => handleInputChange(e, index, inputsMedicine, setInputsMedicine)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>{input.unity}</td>
                                                    <td>
                                                        <input type="number" value={input.duration} name="duration" required style={{ width: '100px' }}
                                                            onChange={e => handleInputChange(e, index, inputsMedicine, setInputsMedicine)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={input.posologie} name="posologie"
                                                            onChange={e => handleInputChange(e, index, inputsMedicine, setInputsMedicine)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={"#"} onClick={() => handleDeleteInput(index, inputsMedicine, setInputsMedicine)} className="btn btn-danger shadow btn-xs sharp">
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="row">
                                <div className="col-12 my-2">
                                    <div className="hr-text">Soins</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-md-6 col-sm-3 col-12 mb-3 prescription">
                                    <label className="form-label">Soin</label>
                                    <Select options={soins} className="custom-react-select"
                                        isDisabled={loading}
                                        placeholder={loading ? 'Chargement...' : 'Choisir un traitement'}
                                        isSearchable
                                        value={selectedSoin}
                                        onChange={setSelectedSoin}
                                        getOptionValue={s => s.id}
                                        getOptionLabel={s => s.name}
                                    />
                                </div>
                                <div className="col-sm-3 col-12 mb-3 d-flex align-items-end">
                                    <button onClick={handleAddInputSoin} className="btn btn-primary btn-lg btn-block">Ajouter à la liste</button>
                                </div>
                            </div>
                            <div className="row">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th><strong>Nom</strong></th>
                                            <th><strong>Durée (jour)</strong></th>
                                            <th><strong>Fréquence</strong></th>
                                            <th><strong>Commentaire</strong></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputsSoin.length === 0 ?
                                            <tr className="text-center"><td colSpan={6}>Liste des soins</td></tr>
                                            :
                                            inputsSoin.map((input, index) => (
                                                <tr key={index}>
                                                    <td>{input.name}</td>
                                                    <td>
                                                        <input type="number" value={input.duration} name="duration" required style={{ width: '100px' }}
                                                            onChange={e => handleInputChange(e, index, inputsSoin, setInputsSoin)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={input.frequency} name="frequency" required
                                                            onChange={e => handleInputChange(e, index, inputsSoin, setInputsSoin)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={input.comment} name="comment"
                                                            onChange={e => handleInputChange(e, index, inputsSoin, setInputsSoin)}
                                                            className="form-control" />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={"#"} onClick={() => handleDeleteInput(index, inputsSoin, setInputsSoin)} className="btn btn-danger shadow btn-xs sharp">
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="row">
                                <div className="col-12 my-2">
                                    <div className="hr-text">Examens</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-md-6 col-sm-3 col-12 mb-3">
                                    <label className="form-label">Examen</label>
                                    <Select options={examens} className="custom-react-select"
                                        isDisabled={loading}
                                        placeholder={loading ? 'Chargement...' : 'Choisir un examen'}
                                        isSearchable
                                        value={selectedExamen}
                                        onChange={setSelectedExamen}
                                        getOptionValue={e => e.id}
                                        getOptionLabel={e => e.name}
                                    />
                                </div>
                                <div className="col-sm-3 col-12 mb-3 d-flex align-items-end">
                                    <button onClick={handleAddInputExamen} className="btn btn-primary btn-lg btn-block">Ajouter à la liste</button>
                                </div>
                            </div>
                            <div className="row">
                            {inputsExamen.length === 0 ?
                                <div className="col-12 text-center small">Aucun examen attribué</div>
                                :
                                <div className="col-12">
                                    {inputsExamen.map((input, index) => (
                                        <Button key={index} className="me-2 mb-2" variant="dark">
                                            {input.name}
                                            <Link className="btn-icon-end text-warning" onClick={() => handleDeleteInput(index, inputsExamen, setInputsExamen)}>
                                                <i className="fas fa-times" />
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            }
                            </div>
                            <div className="row">
                                <div class="col-12 my-2">
                                    <div class="hr-text"></div>
                                </div>
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
                                <div className="col-12 col-md-12 d-flex justify-content-end">
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={(inputsSoin.length === 0 && inputsExamen.length === 0 && inputsMedicine.length === 0) || saving} 
                                        className="btn btn-primary">
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};

export default connect(mapStateToProps)(CreatePrescription);