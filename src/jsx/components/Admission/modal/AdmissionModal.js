import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { createPortal } from "react-dom";

const AdmissionModal = ({ show, onHide, onSave, admission, onRoomChange, patients, rooms, beds}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({ 
        reason: '',
        entry_date: new Date(),
        release_date: new Date(),
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);

    const handlePatientChange = (option) => {
        setSelectedPatient(option);
    }

    const handleRoomChange = (option) => {
        setSelectedRoom(option);

        const url = option ? `admissions/rooms/${option.id}` : `admissions/rooms`;

        setLoading(true);
       
        axiosInstance.get(url)
            .then(function({data}) {
                handleBedChange(null);
                onRoomChange(data.beds);

                if (admission) {
                    handleBedChange(data.beds.find(b => b.id === admission.bed_id) ?? null);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setLoading(false);
            });  
    }

    const handleBedChange = (option) => {
        setSelectedBed(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'reason');
        handlePatientChange(null);
        handleRoomChange(null);
        handleBedChange(null);
        handleOnChange(new Date(), 'entry_date');
        handleOnChange(new Date(), 'release_date');
    }

    useEffect(() => {
        if (admission) {
            handleOnChange(admission.reason, 'reason');
            handlePatientChange(patients.find(p => p.id === admission.patient_id));
            handleRoomChange(rooms.find(r => r.id === admission.room_id) ?? null);
            handleOnChange(new Date(admission.entry_date), 'entry_date');
            handleOnChange(new Date(admission.release_date), 'release_date');
        } else {
            resetForm();
        }

        setErrors({});
    }, [admission]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const release_date = format(inputs.release_date, 'yyyy-MM-dd');
        const entry_date = format(inputs.entry_date, 'yyyy-MM-dd');
        const patient_id = selectedPatient ? selectedPatient.id : null;
        const room_id = selectedRoom ? selectedRoom.id : null;
        const bed_id = selectedBed ? selectedBed.id : null;

        axiosInstance.request({
            method: admission ? 'PUT' : 'POST',
            url: admission ? 'admissions/'+ admission.id : 'admissions',
            data: {...inputs, patient_id, room_id, bed_id, release_date, entry_date},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, admission ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Hospitalisation ${admission ? 'modifiée' : 'ajoutée'} avec succès`);
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
                    <h5 className="modal-title">{(admission ? 'Modifier' : 'Ajouter') + ' une hospitalisation'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date d'admission<span className="text-danger">*</span></label> <br />
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.entry_date} 
                                    onChange={(date) => handleOnChange(date, 'entry_date')} 
                                />
                                {errors.entry_date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.entry_date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de sortie<span className="text-danger">*</span></label> <br />
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.release_date} 
                                    onChange={(date) => handleOnChange(date, 'release_date')} 
                                />
                                {errors.release_date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.release_date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <Select options={patients} className="custom-react-select" 
                                    placeholder="Choisir un patient"
                                    isSearchable
                                    value={selectedPatient}
                                    onChange={handlePatientChange} 
                                    getOptionValue={p => p.id}
                                    getOptionLabel={p => p.shortname}
                                />
                                {errors.patient_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.patient_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
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
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Lit<span className="text-danger">*</span></label>
                                <Select options={beds} className="custom-react-select" 
                                    placeholder={loading ? 'Chargement...' : 'Choisir un lit'}
                                    isSearchable
                                    value={selectedBed}
                                    onChange={handleBedChange} 
                                    getOptionValue={b => b.id}
                                    getOptionLabel={b => b.number}
                                />
                                {errors.bed_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.bed_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Motif<span className="text-danger">*</span></label>
                                <textarea
                                    rows={3} 
                                    value={inputs.reason} 
                                    onChange={event => handleOnChange(event.target.value, 'reason')} 
                                    className="form-control"></textarea>
                                {errors.reason && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reason.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {admission ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default AdmissionModal;