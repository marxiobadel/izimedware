import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const ExamenModal = ({show, onHide, onSave, examen, types}) => {
    const [inputs, setInputs] = useState({
        amount: '',
        name: '',
        description: '',
    });

    const [type, setType] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleTypeChange = (option) => {
        setType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'amount');
        handleOnChange('', 'name');
        handleOnChange('', 'description');
        handleTypeChange(null);
    }
    
    useEffect(() => {
        if (examen) {
            handleOnChange(examen.amount, 'amount');
            handleOnChange(examen.name, 'name');
            handleOnChange(examen.description, 'description');
            handleTypeChange(types.find(t => t.id === examen.type.id));
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [examen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const type_id = type ? type.id : null;
    
        axiosInstance.request({
            method: examen ? 'PUT' : 'POST',
            url: examen ? 'examens/'+ examen.id : 'examens',
            data: {...inputs, type_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, examen ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Examen médical ${examen ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">
                        <strong>{(examen ? 'Modifier' : 'Ajouter') + ' un examen médical'}</strong>
                    </h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Libellé<span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control"
                                />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-7 mb-3">                                        
                                <label className="form-label">Type d'examen<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type d'examen"
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
                            <div className="col-sm-5 mb-3">
                                <label className="form-label">Coût<span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    value={inputs.amount} 
                                    onChange={event => handleOnChange(event.target.value, 'amount')} 
                                    className="form-control"
                                />
                                {errors.amount && <div className="text-danger">
                                    <small style={errorStyle}>{errors.amount.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Description<span className="text-danger">*</span></label>
                                <textarea
                                    rows={3}
                                    value={inputs.description} 
                                    onChange={event => handleOnChange(event.target.value, 'description')} 
                                    className="form-control"
                                ></textarea>
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
                        {examen ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default ExamenModal;