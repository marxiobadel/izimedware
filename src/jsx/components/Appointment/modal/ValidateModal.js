import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import { createPortal } from "react-dom";

const ValidateModal = ({ show, onHide, onSave, appointment}) => {
    const statuses = [
        {label: 'Rejeté', value: 'rejected'},
        {label: 'En attente', value: 'pending'},
        {label: 'Accepté', value: 'approved'}
    ];

    const [inputs, setInputs] = useState({ 
        reason2: '',
    });

    const [selectedStatus, setSelectedStatus] = useState(null);

    const textareaRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    useEffect(() => {
        if (appointment) {
            setSelectedStatus(statuses.find(status => status.value === appointment.status));
            handleOnChange(appointment.reason2 ?? '', 'reason2');
        }
    }, [appointment]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [inputs.reason2]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const status = selectedStatus ? selectedStatus.value : null;

        axiosInstance.request({
            method: 'PATCH',
            url: 'appointments/'+ (appointment ? appointment.id : 0) +'/validate',
            data: {...inputs, status},
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

                    notifySuccess(`Rendez-vous validé avec succès`);
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
                    <h5 className="modal-title">Valider un rendez-vous</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Status<span className="text-danger">*</span></label>
                                <Select options={statuses} className="custom-react-select" 
                                    placeholder='Choisir un Statut'
                                    value={selectedStatus}
                                    onChange={setSelectedStatus} 
                                />
                                {errors.status && <div className="text-danger">
                                    <small style={errorStyle}>{errors.status.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Motif en cas de refus</label>
                                <textarea
                                    ref={textareaRef}
                                    style={{ width: "100%", resize: "none", overflow: "hidden" }}
                                    rows={3} 
                                    value={inputs.reason2} 
                                    onChange={event => handleOnChange(event.target.value, 'reason2')} 
                                    className="form-control"></textarea>
                                {errors.reason2 && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reason2.join('\n\r')}</small>
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

export default ValidateModal;