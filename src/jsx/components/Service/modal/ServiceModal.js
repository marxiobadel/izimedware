import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import Select from 'react-select';

const ServiceModal = ({ show, onHide, onSave, service, doctors }) => {
    const [inputs, setInputs] = useState({ name: '', description: '' });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [doctor, setDoctor] = useState(null);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'description');
        handleDoctorChange(null);
    }
    
    useEffect(() => {
        if (service) {
            handleOnChange(service.name, 'name');
            handleOnChange(service.description ?? '', 'description');
            handleDoctorChange(doctors.find(d => d.id === service.doctor_id));
        } else {
            resetForm();
        }

        setErrors({});
    }, [service]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const doctor_id = doctor ? doctor.id : null;

        axiosInstance.request({
            method: service ? 'PUT' : 'POST',
            url: service ? 'services/'+ service.id : 'services',
            data: {...inputs, doctor_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, service ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Département ${service ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(service ? 'Modifier' : 'Ajouter') + ' un département'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Nom<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control" />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Chef de département</label>
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
                            <div className="col-sm-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    value={inputs.description} 
                                    rows={5}
                                    onChange={event => handleOnChange(event.target.value, 'description')} 
                                    className="form-control"></textarea>
                                {errors.description && <div className="text-danger">
                                    <small style={errorStyle}>{errors.description.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {service ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default ServiceModal;