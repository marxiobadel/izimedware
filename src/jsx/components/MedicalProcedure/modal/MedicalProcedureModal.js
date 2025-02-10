import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import Select from 'react-select';

const MedicalProcedureModal = ({ show, onHide, onSave, medicalProcedure, defaultCurrency, services }) => {
    const [inputs, setInputs] = useState({ name: '', amount: '', description: '' });

    const [service, setService] = useState(null);

    const handleService = (option) => {
        setService(option);
    }

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'amount');
        handleOnChange('', 'description');
        handleService(null);
    }
    
    useEffect(() => {
        if (medicalProcedure) {
            handleOnChange(medicalProcedure.name, 'name');
            handleOnChange(medicalProcedure.amount, 'amount');
            handleOnChange(medicalProcedure.description ?? '', 'description');
            handleService(services.find(service => service.id === medicalProcedure.service_id));
        } else {
            resetForm();
        }

        setErrors({});
    }, [medicalProcedure]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const service_id = service ? service.id : null;

        const url = medicalProcedure ? 'medical_procedures/'+ medicalProcedure.id : 'medical_procedures';

        axiosInstance.request({
            method: medicalProcedure ? 'PUT' : 'POST',
            url,
            data: {...inputs, service_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    console.log(data.errors)
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, medicalProcedure ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Acte médical ${medicalProcedure ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(medicalProcedure ? 'Modifier' : 'Ajouter') + ' un acte médical'}</h5>
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
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Coût<span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input type="number" 
                                        value={inputs.amount} 
                                        onChange={event => handleOnChange(event.target.value, 'amount')} 
                                        className="form-control" />
                                    <span className="input-group-text">{defaultCurrency ?? 'USD'}</span>
                                </div>
                                {errors.amount && <div className="text-danger">
                                    <small style={errorStyle}>{errors.amount.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Départements<span className="text-danger">*</span></label>
                                <Select options={services} className="custom-react-select" 
                                    placeholder='Choisir un département'
                                    isSearchable
                                    value={service}
                                    onChange={handleService} 
                                    getOptionValue={s => s.id}
                                    getOptionLabel={s => s.name}
                                />
                                {errors.service_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.service_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Description</label>
                                <textarea type="number" 
                                    rows={3}
                                    value={inputs.description} 
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
                        {medicalProcedure ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default MedicalProcedureModal;