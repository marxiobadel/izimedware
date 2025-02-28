import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const DossierModal = ({ show, onHide, onSave, dossier, patient_id, doctors, services}) => {
    const [inputs, setInputs] = useState({
        desease: '',
        systolic_blood_pressure: '',
        diastolic_blood_pressure: '',
        heart_rate: '',
        blood_sugar_level: '',
        temperature: '',
        oxygen_saturation: '',
        weight: '',
        size: '',
    });

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setSelectedDoctor(option);
    }

    const handleServiceChange = (option) => {
        setSelectedService(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'desease');
        handleOnChange('', 'systolic_blood_pressure');
        handleOnChange('', 'diastolic_blood_pressure');
        handleOnChange('', 'heart_rate');
        handleOnChange('', 'blood_sugar_level');
        handleOnChange('', 'temperature');
        handleOnChange('', 'oxygen_saturation');
        handleOnChange('', 'weight');
        handleOnChange('', 'size');
        handleDoctorChange(null);
        handleServiceChange(null);
    }
    
    useEffect(() => {
        if (dossier) {
            handleOnChange(dossier.desease ?? '', 'desease');
            handleOnChange(dossier.systolic_blood_pressure ?? '', 'systolic_blood_pressure');
            handleOnChange(dossier.diastolic_blood_pressure ?? '', 'diastolic_blood_pressure');
            handleOnChange(dossier.heart_rate ?? '', 'heart_rate');
            handleOnChange(dossier.blood_sugar_level ?? '', 'blood_sugar_level');
            handleOnChange(dossier.temperature ?? '', 'temperature');
            handleOnChange(dossier.oxygen_saturation ?? '', 'oxygen_saturation');
            handleOnChange(dossier.weight ?? '', 'weight');
            handleOnChange(dossier.size ?? '', 'size');
            handleDoctorChange(doctors.find(doctor => doctor.id === dossier.doctor_id) ?? null);
            handleServiceChange(services.find(service => service.id === dossier.service_id) ?? null);
        } else {
            resetForm();
        }

        setErrors({});
    }, [dossier]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const doctor_id = selectedDoctor ? selectedDoctor.id : null;
        const service_id = selectedService ? selectedService.id : null;

        const url = dossier ? 'dossiers/'+ dossier.id : 'patients/'+ patient_id + '/dossiers';
        const type = dossier ? 'edit' : 'add';
        const message = dossier ? 'modifié' : 'ajouté';

        axiosInstance.post(url, {...inputs, doctor_id, service_id}, {
            headers: { "Content-Type": "application/json" }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, type);

                    resetForm();

                    notifySuccess(`Patient ${message} avec succès`);
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
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(dossier ? 'Modifier' : 'Ajouter') + ' un dossier'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Maladie</label>
                                <input type="text" 
                                    value={inputs.desease} 
                                    onChange={event => handleOnChange(event.target.value, 'desease')} 
                                    className="form-control" />
                                {errors.desease && <div className="text-danger">
                                    <small style={errorStyle}>{errors.desease.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Médecin</label>
                                <Select options={doctors} className="custom-react-select" 
                                    isClearable={false}
                                    placeholder='Assigner un médecin'
                                    isSearchable={false}
                                    value={selectedDoctor}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => d.fullname}
                                />
                                {errors.doctor_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.doctor_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Tension systolique</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.systolic_blood_pressure} 
                                        onChange={event => handleOnChange(event.target.value, 'systolic_blood_pressure')} 
                                        className="form-control" />
                                    <span className="input-group-text">mmHg</span>
                                </div>
                                {errors.systolic_blood_pressure && <div className="text-danger">
                                    <small style={errorStyle}>{errors.systolic_blood_pressure.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Tension diastolique</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.diastolic_blood_pressure} 
                                        onChange={event => handleOnChange(event.target.value, 'diastolic_blood_pressure')} 
                                        className="form-control" />
                                    <span className="input-group-text">mmHg</span>
                                </div>
                                {errors.diastolic_blood_pressure && <div className="text-danger">
                                    <small style={errorStyle}>{errors.diastolic_blood_pressure.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Fréquence cardiaque</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.heart_rate} 
                                        onChange={event => handleOnChange(event.target.value, 'heart_rate')} 
                                        className="form-control" />
                                    <span className="input-group-text">BPM</span>
                                </div>
                                {errors.heart_rate && <div className="text-danger">
                                    <small style={errorStyle}>{errors.heart_rate.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Glycémie</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.blood_sugar_level} 
                                        onChange={event => handleOnChange(event.target.value, 'blood_sugar_level')} 
                                        className="form-control" />
                                    <span className="input-group-text">g/L</span>
                                </div>
                                {errors.blood_sugar_level && <div className="text-danger">
                                    <small style={errorStyle}>{errors.blood_sugar_level.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Température corporelle</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.temperature} 
                                        onChange={event => handleOnChange(event.target.value, 'temperature')} 
                                        className="form-control" />
                                    <span className="input-group-text">°C</span>
                                </div>
                                {errors.temperature && <div className="text-danger">
                                    <small style={errorStyle}>{errors.temperature.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Saturation en oxygène</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.oxygen_saturation} 
                                        onChange={event => handleOnChange(event.target.value, 'oxygen_saturation')} 
                                        className="form-control" />
                                    <span className="input-group-text">%</span>
                                </div>
                                {errors.oxygen_saturation && <div className="text-danger">
                                    <small style={errorStyle}>{errors.oxygen_saturation.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Poids</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.weight} 
                                        onChange={event => handleOnChange(event.target.value, 'weight')} 
                                        className="form-control" />
                                    <span className="input-group-text">kg</span>
                                </div>
                                {errors.weight && <div className="text-danger">
                                    <small style={errorStyle}>{errors.weight.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Taille</label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.size} 
                                        onChange={event => handleOnChange(event.target.value, 'size')} 
                                        className="form-control" />
                                    <span className="input-group-text">m</span>
                                </div>
                                {errors.size && <div className="text-danger">
                                    <small style={errorStyle}>{errors.size.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">                                        
                                <label className="form-label">Département<span className="text-danger">*</span></label>
                                <Select options={services} className="custom-react-select" 
                                    isClearable={false}
                                    placeholder='Sélectionnez un département'
                                    isSearchable={false}
                                    value={selectedService}
                                    onChange={handleServiceChange} 
                                    getOptionValue={s => s.id}
                                    getOptionLabel={s => s.name}
                                />
                                {errors.service_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.service_id.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {dossier ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default DossierModal;