import { useState } from "react";
import { Modal } from "react-bootstrap";
import { isPatient, notifyError } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { format } from 'date-fns';
import Select from 'react-select';

const AppointmentModal = ({ show, onHide, onSave, slot, patients, currentUser, dossier_id = null, patient_id = null}) => {
    const [inputs, setInputs] = useState({ reason1: '' });

    const [saving, setSaving] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState([]);

    const handlePatientChange = (option) => {
        setSelectedPatient(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        if (dossier_id === null) {
            patient_id = isPatient(currentUser.roles) ? currentUser.id : (selectedPatient ? selectedPatient.id : null)
        }

        const date = format(new Date(slot.date), 'yyyy-MM-dd');
        const time = format(new Date(slot.start_time), 'HH:mm');
        const doctor_id = slot.doctor_id;
        const slot_id = slot.id;
 
        axiosInstance.request({
            method: 'POST',
            url: 'dashboard/appointment',
            data: {...inputs, date, time, doctor_id, slot_id, patient_id, dossier_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function({data}) {
                if (data.status) {
                    onSave(data.data);

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
                            {!isPatient(currentUser.roles) && dossier_id === null &&
                                <div className="col-sm-12 mb-3">                                        
                                    <label className="form-label">Patient<span className="text-danger">*</span></label>
                                    <Select options={patients} className="custom-react-select" 
                                        placeholder='Associer un patient'
                                        isSearchable
                                        value={selectedPatient}
                                        onChange={handlePatientChange} 
                                        getOptionValue={p => p.id}
                                        getOptionLabel={p => p.fullname}
                                    />
                                </div>
                            }
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