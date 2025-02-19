import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const InsuranceModal = ({ show, onHide, onSave, insurance}) => {
    const [inputs, setInputs] = useState({ 
        name: '',
        type: '',
        phone: '',
        email: '',
        website: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'type');
        handleOnChange('', 'phone');
        handleOnChange('', 'email');
        handleOnChange('', 'website');
        handleOnChange('', 'address');
    }
    
    useEffect(() => {
        if (insurance) {
            handleOnChange(insurance.name, 'name');
            handleOnChange(insurance.type, 'type');
            handleOnChange(insurance.phone === 'aucun' ? '' : insurance.phone, 'phone');
            handleOnChange(insurance.email === 'aucun' ? '' : insurance.email, 'email');
            handleOnChange(insurance.website === 'aucun' ? '' : insurance.website, 'website');
            handleOnChange(insurance.address === 'aucune' ? '' : insurance.address, 'address');
        } else {
            resetForm();
        }

        setErrors({});
    }, [insurance]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        axiosInstance.request({
            method: insurance ? 'PUT' : 'POST',
            url: insurance ? 'insurances/'+ insurance.id : 'insurances',
            data: inputs,
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, insurance ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Assurance ${insurance ? 'modifiée' : 'ajoutée'} avec succès`);
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
        <Modal className="modal fade" dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(insurance ? 'Modifier' : 'Ajouter') + ' une assurance'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Nom de la compagnie<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control" />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Type de couverture<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.type} 
                                    onChange={event => handleOnChange(event.target.value, 'type')} 
                                    className="form-control" />
                                {errors.type && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Téléphone</label>
                                <input type="text" 
                                    value={inputs.phone} 
                                    onChange={event => handleOnChange(event.target.value, 'phone')} 
                                    className="form-control" />
                                {errors.phone && <div className="text-danger">
                                    <small style={errorStyle}>{errors.phone.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">E-mail</label>
                                <input type="text" 
                                    value={inputs.email} 
                                    onChange={event => handleOnChange(event.target.value, 'email')} 
                                    className="form-control" />
                                {errors.email && <div className="text-danger">
                                    <small style={errorStyle}>{errors.email.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Adresse</label>
                                <input type="text" 
                                    value={inputs.address} 
                                    onChange={event => handleOnChange(event.target.value, 'address')} 
                                    className="form-control" />
                                {errors.address && <div className="text-danger">
                                    <small style={errorStyle}>{errors.address.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Site web</label>
                                <input type="text" 
                                    value={inputs.website} 
                                    onChange={event => handleOnChange(event.target.value, 'website')} 
                                    className="form-control" />
                                {errors.website && <div className="text-danger">
                                    <small style={errorStyle}>{errors.website.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {insurance ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default InsuranceModal;