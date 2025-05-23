import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, isMedecin, notifyError, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";
import { connect } from "react-redux";
import { createPortal } from "react-dom";
import AutocompleteField from "../../../constant/AutocompleteField";
import { Link } from "react-router-dom";
import PatientModal from "../../Patient/modal/PatientModal";

const ConsultationModal = ({action, currentUser, show, onHide, onSave, consultation, dossier = null}) => {
    registerLocale("fr", fr);

    const [openPatientModal, setOpenPatientModal] = useState(false);
    const [patientName, setPatientName] = useState("");

    const handleAddPatient = (patient, type) => {
		if (type === 'add') {
            handleOnChange(patient.id, 'patient_id');

            setPatientName(patient.fullname);

        	setOpenPatientModal(false);
		}
    };

    const types = [
        {label: 'Généraliste', value: 'general'},
        {label: 'Spécialiste', value: 'special'},
    ]

    const [inputs, setInputs] = useState({
        reason: '',
        patient_id: null,
        doctor_id: null,
        datetime: new Date(),
    });

    const [doctors, setDoctors] = useState([]);

    const [doctor, setDoctor] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handleTypeChange = (option) => {
        setSelectedType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleAutocompleteSelect = (id) => {
        handleOnChange(id, 'patient_id');
    };

    const handleAddNewPatient = (name) => {
        setOpenPatientModal(true);
    };

    const resetForm = () => {
        let doctor = null;

        if (dossier) {
            doctor = doctors.find(d => d.id === dossier.doctor_id) ?? null;
        } else if (isMedecin(currentUser.roles)) {
            doctor = currentUser ?? null;
        }
        
        handleOnChange('', 'reason');
        handleDoctorChange(doctor);
        handleTypeChange(types[0]);
        handleOnChange(new Date(), 'datetime');
    }

    useEffect(() => {
        resetForm();

        setErrors({});
    }, [action]);
    
    useEffect(() => {
        if (consultation) {
            handleOnChange(consultation.reason, 'reason');
            handleDoctorChange(doctors.find(d => d.id === consultation.doctor_id) ?? null);
            handleOnChange(consultation.patient_id, 'patient_id');
            handleTypeChange(types.find(t => t.value === consultation.type) ?? null);
            handleOnChange(new Date(consultation.datetime), 'datetime');
            setPatientName(consultation.patient_name)
        } 

        setErrors({});
    }, [consultation]);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('doctors', {signal: controller.signal})
                .then(function({data}) {
                    setDoctors([...data.doctors]);
                    console.log(data.doctors); 
                })
                .catch(function(error) {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const datetime = format(inputs.datetime, 'yyyy-MM-dd HH:mm');
        const doctor_id = doctor ? doctor.id : null;
        const type = selectedType ? selectedType.value : null;
        const dossier_id = dossier ? dossier.id : null;

        axiosInstance.request({
            method: consultation ? 'PUT' : 'POST',
            url: consultation ? 'consultations/'+ consultation.id : 'consultations',
            data: {...inputs, datetime, doctor_id, type, dossier_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, consultation ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Consultation ${consultation ? 'modifiée' : 'ajoutée'} avec succès`);
                }
            })
            .catch(function(error) {
                if (error.response && error.response.data) {
                    notifyError(error.response.data.message);
                } else {
                    console.log(error);
                }
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return  <> {show && createPortal(
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <strong>{(consultation ? 'Modifier' : 'Ajouter') + ' une consultation'}</strong>
                    </h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Heure"
                                    className="form-control"
                                    selected={inputs.datetime} 
                                    onChange={datetime => handleOnChange(datetime, 'datetime')} 
                                />
                                {errors.datetime && <div className="text-danger">
                                    <small style={errorStyle}>{errors.datetime.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Type<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder='Sélectionner un type'
                                    value={selectedType}
                                    onChange={handleTypeChange} 
                                />
                                {errors.type && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <AutocompleteField 
                                    initialName={patientName} 
                                    onSelect={handleAutocompleteSelect} 
                                    onAddNew={handleAddNewPatient}
                                />
                                {errors.patient_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.patient_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Médecin<span className="text-danger">*</span></label>
                                <Select options={doctors} className="custom-react-select" 
                                    placeholder='Choisir un médecin'
                                    isSearchable
                                    value={doctor}
                                    isDisabled={isMedecin(currentUser.roles)}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => `${d.fullname} (${d.skills && d.skills.length > 0 ? d.skills[0].name : 'inconnue'})`}
                                />
                                {errors.doctor_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.doctor_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Note<span className="text-danger">*</span></label>
                                <textarea 
                                    rows={3}
                                    value={inputs.reason} 
                                    onChange={event => handleOnChange(event.target.value, 'reason')} 
                                    className="form-control"
                                ></textarea>
                                {errors.reason && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reason.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    {consultation &&
                    <Link to={`/prescriptions/create?consultation_id=${consultation.id}`} className="btn btn-info btn-sm light">
                        Ajouter une prescription
                    </Link>
                    }
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {consultation ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )}
        <PatientModal 
            show={openPatientModal}
            onHide={() => setOpenPatientModal(false)}
            onSave={handleAddPatient}
            patient={null}
        />
    </>
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(ConsultationModal);