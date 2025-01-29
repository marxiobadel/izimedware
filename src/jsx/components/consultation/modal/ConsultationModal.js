import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";
import { connect } from "react-redux";

const ConsultationModal = ({currentUser, show, onHide, onSave, consultation, doctors, patients, medicalProcedures}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        reason: '',
        patient_id: null,
        doctor_id: null,
        date: null,
        observation: '',
    });

    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);
    const [medicalProcedure, setMedicalProcedure] = useState(null);
    const [curdate, setCurdate] = useState(new Date());

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handlePatientChange = (option) => {
        setPatient(option);
    }

    const handleMedicalProcedureChange = (option) => {
        setMedicalProcedure(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'reason');
        handleOnChange('', 'observation');
        handleDoctorChange(currentUser ?? null);
        handlePatientChange(null);
        handleMedicalProcedureChange(null);
        setCurdate(new Date());
    }
    
    useEffect(() => {
        if (consultation) {
            handleOnChange(consultation.reason, 'reason');
            handleOnChange(consultation.observation ?? '', 'observation');
            handleDoctorChange(doctors.find(d => parseInt(d.id) === parseInt(consultation.doctor_id)));
            handlePatientChange(patients.find(p => parseInt(p.id) === parseInt(consultation.patient_id)));
            handleMedicalProcedureChange(medicalProcedures.find(mp => parseInt(mp.id) === parseInt(consultation.medical_procedure_id)));
            setCurdate(consultation.curdate ? new Date(consultation.curdate) : new Date());
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [consultation]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(curdate, 'yyyy-MM-dd');
        const patient_id = patient ? patient.id : null;
        const doctor_id = doctor ? doctor.id : null;
        const medical_procedure_id = medicalProcedure ? medicalProcedure.id : null;

        axiosInstance.request({
            method: consultation ? 'PUT' : 'POST',
            url: consultation ? 'consultations/'+ consultation.id : 'consultations',
            data: {...inputs, date, patient_id, doctor_id, medical_procedure_id},
            headers: {
                "Content-Type": 'Application/json'
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
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return (
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(consultation ? 'Modifier' : 'Ajouter') + ' une consultation'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                        <div className="col-sm-6 mb-3">
                            <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={curdate} 
                                    onChange={setCurdate} 
                                />
                                {errors.date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <Select options={patients} className="custom-react-select" 
                                    placeholder='Choisir un patient'
                                    isSearchable
                                    value={patient}
                                    onChange={handlePatientChange} 
                                    getOptionValue={p => p.id}
                                    getOptionLabel={p => p.fullname}
                                />
                                {errors.patient_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.patient_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Personnel médical<span className="text-danger">*</span></label>
                                <Select options={doctors} className="custom-react-select" 
                                    placeholder='Choisir un membre'
                                    isSearchable
                                    value={doctor}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => d.fullname}
                                />
                                {errors.doctor_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.doctor_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Acte médical<span className="text-danger">*</span></label>
                                <Select options={medicalProcedures} className="custom-react-select" 
                                    placeholder='Associer un acte'
                                    isSearchable
                                    value={medicalProcedure}
                                    onChange={handleMedicalProcedureChange} 
                                    getOptionValue={mp => mp.id}
                                    getOptionLabel={mp => mp.name}
                                />
                                {errors.medical_procedure_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.medical_procedure_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Motif<span className="text-danger">*</span></label>
                                <textarea 
                                    rows={2}
                                    value={inputs.reason} 
                                    onChange={event => handleOnChange(event.target.value, 'reason')} 
                                    className="form-control"
                                ></textarea>
                                {errors.reason && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reason.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Observation</label>
                                <textarea 
                                    rows={4}
                                    value={inputs.observation} 
                                    onChange={event => handleOnChange(event.target.value, 'observation')} 
                                    className="form-control"
                                ></textarea>
                                {errors.observation && <div className="text-danger">
                                    <small style={errorStyle}>{errors.observation.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {consultation ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}


const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(ConsultationModal);