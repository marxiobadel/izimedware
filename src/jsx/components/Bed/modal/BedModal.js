import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifyError, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import { createPortal } from "react-dom";

const BedModal = ({ show, onHide, onSave, bed, rooms}) => {
    const [inputs, setInputs] = useState({ 
        number: '',
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleRoomChange = (option) => {
        setSelectedRoom(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    useEffect(() => {
        if (bed) {
            handleOnChange(bed.number, 'number');
            handleRoomChange(rooms.find(r => r.id === bed.room_id));
        } else {
            handleOnChange('', 'number');
            handleRoomChange(null);
        }

        setErrors({});
    }, [bed]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const room_id = selectedRoom ? selectedRoom.id : null;

        const method = bed ? 'PUT' : 'POST';
        const url = bed ? 'beds/'+ bed.id : 'beds';
        const type = bed ? 'edit' : 'add';
        const message = bed ? 'modifié' : 'ajouté';

        axiosInstance.request({
            method,
            url,
            data: {...inputs, room_id},
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
                    handleRoomChange(null)

                    notifySuccess(`Lit ${message} avec succès`);
                }
            })
            .catch(function(error) {
                if (error.response && error.response.data) {
                    notifyError(error.response.data.message);
                } else {
                    console.log(error);
                }
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return createPortal(
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(bed ? 'Modifier' : 'Ajouter') + ' un lit'}</h5>
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
                            <div className="col-sm-12">                                        
                                <label className="form-label">Chambre</label>
                                <Select options={rooms} className="custom-react-select" 
                                    placeholder="Choisir une chambre"
                                    isSearchable
                                    isClearable
                                    value={selectedRoom}
                                    onChange={handleRoomChange} 
                                    getOptionValue={r => r.id}
                                    getOptionLabel={r => r.number}
                                />
                                {errors.room_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.room_id.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {bed ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default BedModal;