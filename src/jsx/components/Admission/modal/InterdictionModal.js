import { useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const InterdictionModal = ({ show, onHide, onSave, admission }) => {
    const [inputs, setInputs] = useState({ description: '' });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        axiosInstance.request({
            method: 'POST',
            url: `admissions/${admission.id}/interdictions`,
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
                    onSave(data.data);

                    handleOnChange('', 'description');
                    setErrors({});

                    notifySuccess(`Interdiction ajoutée avec succès`);
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
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-sm" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Ajouter une interdiction</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <label className="form-label">Description<span className="text-danger">*</span></label>
                                <textarea
                                    rows={3}
                                    value={inputs.description} 
                                    onChange={event => handleOnChange(event.target.value, 'description')} 
                                    className="form-control"> </textarea>
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
                        Sauvegarder
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default InterdictionModal;