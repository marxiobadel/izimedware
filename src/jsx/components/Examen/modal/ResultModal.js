import { useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const ResultModal = ({show, onHide, onSave, examen}) => {
    const [inputs, setInputs] = useState({
        content: '',
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const handleOnChange = (value, input) => {
            setInputs(prevState => ({...prevState, [input]: value}));
        }

        const resetForm = () => {
            handleOnChange('', 'content');
        }

        axiosInstance.request({
            method: 'POST',
            url: 'examens/'+ (examen ? examen.id : 0) +'/result',
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

                    resetForm();

                    notifySuccess(`Examen médical ajouté avec succès`);
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
                    <h5 className="modal-title">Ajouter un résultat</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Contenu</label>
                                <textarea
                                    rows={5}
                                    value={inputs.content} 
                                    onChange={event => handleOnChange(event.target.value, 'content')} 
                                    className="form-control"
                                ></textarea>
                                {errors.content && <div className="text-danger">
                                    <small style={errorStyle}>{errors.content.join('\n\r')}</small>
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

export default ResultModal;