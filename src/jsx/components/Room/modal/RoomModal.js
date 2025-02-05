import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import { createPortal } from "react-dom";

const RoomModal = ({ show, onHide, onSave, room, types}) => {
    const [inputs, setInputs] = useState({ 
        number: '',
        capacity: '' 
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedType, setSelectedType] = useState(null);

    const handleTypeChange = (option) => {
        setSelectedType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    useEffect(() => {
        if (room) {
            handleOnChange(room.number, 'number');
            handleOnChange(room.capacity, 'capacity');
            handleTypeChange(types.find(t => t.id === room.type.id));
        } else {
            handleOnChange('', 'number');
            handleOnChange('', 'capacity');
            handleTypeChange(null);
        }

        setErrors({});
    }, [room]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const type_id = selectedType ? selectedType.id : null;

        const method = room ? 'PUT' : 'POST';
        const url = room ? 'rooms/'+ room.id : 'rooms';
        const type = room ? 'edit' : 'add';
        const message = room ? 'modifiée' : 'ajoutée';

        axiosInstance.request({
            method,
            url,
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
                    onSave(data.data, type);

                    handleOnChange('', 'number');
                    handleOnChange('', 'capacity');
                    handleTypeChange(null);

                    notifySuccess(`Chambre ${message} avec succès`);
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
                    <h5 className="modal-title">{(room ? 'Modifier' : 'Ajouter') + ' une chambre'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Numéro<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.number} 
                                    onChange={event => handleOnChange(event.target.value, 'number')} 
                                    className="form-control" />
                                {errors.number && <div className="text-danger">
                                    <small style={errorStyle}>{errors.number.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Capacité Max<span className="text-danger">*</span></label>
                                <input type="number" 
                                    value={inputs.capacity} 
                                    onChange={event => handleOnChange(event.target.value, 'capacity')} 
                                    className="form-control" />
                                {errors.capacity && <div className="text-danger">
                                    <small style={errorStyle}>{errors.capacity.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">                                        
                                <label className="form-label">Type de chambre<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type de chambre"
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
                        {room ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default RoomModal;