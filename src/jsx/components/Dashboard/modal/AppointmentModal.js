import { useState } from "react";
import { Modal } from "react-bootstrap";
import { notifyError } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { format } from 'date-fns';

const AppointmentModal = ({ show, onHide, onSave, slot}) => {
    const [inputs, setInputs] = useState({ reason1: '' });

    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(new Date(slot.date), 'yyyy-MM-dd');
        const time = format(new Date(slot.start_time), 'HH:mm');
        const doctor_id = slot.doctor_id;
        const slot_id = slot.id;

        axiosInstance.request({
            method: 'POST',
            url: 'dashboard/appointment',
            data: {...inputs, date, time, doctor_id, slot_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function({data}) {
                if (data.status) {
                    onSave();

                    handleOnChange('', 'reason1');
                } else {
                    notifyError(data.message);
                }
            })
            .catch(function(error) {
                if (error.response && error.response.data) {
                    notifyError(error.response.data.message);
                } else {
                    console.log(error.response);
                }
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return (
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Rendez-vous</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <label className="form-label">Motif<span className="text-danger">*</span></label>
                                <textarea
                                    rows={3}
                                    value={inputs.reason1} 
                                    onChange={event => handleOnChange(event.target.value, 'reason1')} 
                                    className="form-control"></textarea>
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
        </Modal>
    )
}

export default AppointmentModal;