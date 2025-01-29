import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";

const MedicalProcedureModal = ({ show, onHide, onSave, medicalProcedure, defaultCurrency }) => {
    const [inputs, setInputs] = useState({ name: '', amount: '', description: '' });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'amount');
        handleOnChange('', 'description');
    }
    
    useEffect(() => {
        if (medicalProcedure) {
            handleOnChange(medicalProcedure.name, 'name');
            handleOnChange(medicalProcedure.amount, 'amount');
            handleOnChange(medicalProcedure.description ?? '', 'description');
        } else {
            resetForm();
        }

        setErrors({});
    }, [medicalProcedure]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const method = medicalProcedure ? 'PUT' : 'POST';
        const url = medicalProcedure ? 'medical_procedures/'+ medicalProcedure.id : 'medical_procedures';
        const type = medicalProcedure ? 'edit' : 'add';
        const message = medicalProcedure ? 'modifié' : 'ajouté';

        axiosInstance.request({
            method,
            url,
            data: inputs,
            headers: {
                "Content-Type": 'Application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, type);

                    resetForm();

                    notifySuccess(`Acte médical ${message} avec succès`);
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
                            <div className="col-sm-12 mb-3">
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
        </Modal>
    )
}

export default MedicalProcedureModal;