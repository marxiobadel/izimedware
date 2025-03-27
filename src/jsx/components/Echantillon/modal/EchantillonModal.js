import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";
import { connect } from "react-redux";
import { createPortal } from "react-dom";

const EchantillonModal = ({currentUser, show, onHide, onSave, echantillon, doctors, types, patients}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        type_id: null,
        code: '',
        doctor_id: null,
        patient_id: null,
        date: new Date(),
    });

    const [doctor, setDoctor] = useState(null);
    const [type, setType] = useState(null);
    const [patient, setPatient] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handleTypeChange = (option) => {
        setType(option);
    }

    const handlePatientChange = (option) => {
        setPatient(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'code');
        handleOnChange(new Date(), 'date');
        handleTypeChange(null);
        handleDoctorChange(currentUser ?? null);
        handlePatientChange(null);
    }
    
    useEffect(() => {
        if (echantillon) {
            handleOnChange(echantillon.code, 'code');
            handleOnChange(new Date(echantillon.date), 'date');
            handleDoctorChange(doctors.find(d => d.id === echantillon.doctor_id));
            handleTypeChange(types.find(t => t.id === echantillon.type.id));
            handlePatientChange(patients.find(p => p.id === echantillon.patient_id));
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [echantillon]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(inputs.date, 'yyyy-MM-dd');
        const doctor_id = doctor ? doctor.id : null;
        const type_id = type ? type.id : null;
        const patient_id = patient ? patient.id : null;
    
        axiosInstance.request({
            method: echantillon ? 'PUT' : 'POST',
            url: echantillon ? 'echantillons/'+ echantillon.id : 'echantillons',
            data: {...inputs, date, type_id, doctor_id, patient_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, echantillon ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Echantillon ${echantillon ? 'modifié' : 'ajouté'} avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return createPortal(
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(echantillon ? 'Modifier' : 'Ajouter') + ' un echantillon'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Code barre</label>
                                <input
                                    type="text"
                                    value={inputs.code} 
                                    onChange={event => handleOnChange(event.target.value, 'code')} 
                                    className="form-control"
                                />
                                {errors.code && <div className="text-danger">
                                    <small style={errorStyle}>{errors.code.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.date} 
                                    onChange={date => handleOnChange(date, 'date')} 
                                />
                                {errors.date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Type d'échantillon<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type d'échantillon"
                                    isSearchable
                                    value={type}
                                    onChange={handleTypeChange} 
                                    getOptionValue={t => t.id}
                                    getOptionLabel={t => t.name}
                                />
                                {errors.type_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6">                                        
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
                            <div className="col-sm-6">                                        
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <Select options={patients} className="custom-react-select" 
                                    placeholder='Associer un patient'
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
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {echantillon ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(EchantillonModal);