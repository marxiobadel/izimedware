import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";

const FormeModal = ({ show, onHide, onSave, forme}) => {
    const [inputs, setInputs] = useState({ name: '' });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    useEffect(() => {
        if (forme) {
            handleOnChange(forme.name, 'name');
        } else {
            handleOnChange('', 'name');
        }

        setErrors({});
    }, [forme]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const url = forme ? 'formes/'+ forme.id : 'formes';

            const { data } = await axiosInstance.request({
                method: forme ? 'PUT' : 'POST',
                url,
                data: inputs,
                headers: {
                    "Content-Type": 'application/json'
                }
            });

            if (Object.entries(data.data).length === 0 && data.errors) {
                setErrors({...data.errors});
            } else {
                onSave(data.data, forme ? 'edit' : 'add');

                handleOnChange('', 'name');

                notifySuccess(`${data.data.name} ${forme ? 'modifiée' : 'ajoutée'} avec succès`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-sm" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(forme ? 'Modifier' : 'Ajouter') + ' une forme'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <label className="form-label">Nom<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control" />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {forme ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default FormeModal;