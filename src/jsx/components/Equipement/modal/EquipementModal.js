import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import { createPortal } from "react-dom";

const EquipementModal = ({ show, onHide, onSave, equipement, types, statutes}) => {
    const [inputs, setInputs] = useState({ 
        name: '',
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedType, setSelectedType] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleTypeChange = (option) => {
        setSelectedType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleTypeChange(null);
        setSelectedStatus(null);
    }
    
    useEffect(() => {
        if (equipement) {
            handleOnChange(equipement.name, 'name');
            handleTypeChange(types.find(t => t.id === equipement.type.id));
            setSelectedStatus(statutes.find(s => s.value === equipement.status))
        } else {
            resetForm();
        }
    
        setErrors({});
    }, [equipement]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const type_id = selectedType ? selectedType.id : null;
        const status = selectedStatus ? selectedStatus.value : null;

        axiosInstance.request({
            method: equipement ? 'PUT' : 'POST',
            url: equipement ? 'equipements/'+ equipement.id : 'equipements',
            data: {...inputs, type_id, status},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, equipement ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Equipement ${equipement ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(equipement ? 'Modifier' : 'Ajouter') + ' un équipement'}</h5>
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
                                <label className="form-label">Etat<span className="text-danger">*</span></label>
                                <Select options={statutes} className="custom-react-select" 
                                    placeholder="Choisir un statut"
                                    value={selectedStatus}
                                    onChange={setSelectedStatus} 
                                />
                                {errors.status && <div className="text-danger">
                                    <small style={errorStyle}>{errors.status.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">                                        
                                <label className="form-label">Type d'équipement<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type d'équipement"
                                    isSearchable
                                    value={selectedType}
                                    onChange={handleTypeChange} 
                                    getOptionValue={t => t.id}
                                    getOptionLabel={t => t.name}
                                />
                                {errors.type_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type_id.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {equipement ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default EquipementModal;