import { useEffect, useState } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import AutocompleteField from "../../../constant/AutocompleteField";
import { Modal } from "react-bootstrap";
import { format } from 'date-fns';
import { notifyError } from "../../../constant/theme";
import { DayPilot } from "@daypilot/daypilot-lite-react";

const MakeAppointmentModal = ({show, onHide, onSave, event}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        patient_id: null,
        reason1: ''
    });

    const [saving, setSaving] = useState(false);

    const [loading, setLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlotId, setSelectedSlotId] = useState(0);

    const [slots, setSlots] = useState([]);

    const handleAutocompleteSelect = (id) => {
        handleOnChange(id, 'patient_id');
    };

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedSlotId == 0) {
            notifyError('Impossible de soumettre sans sélection de créneaux horaire.');
            return false;
        }

        setSaving(true); 

        axiosInstance.request({
            method: 'POST',
            url: 'dashboard/appointment',
            data: {...inputs, slot_id: selectedSlotId, dossier_id: null},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function({data}) {
                if (Object.entries(data.data).length === 0 && data.errors) {
                    for (const error in data.errors) {
                        notifyError(data.errors[error].join('\n\r'));
                    }
                } else {
                    if (data.status) {
                        onSave(data.data);
    
                        handleOnChange('', 'reason1');
                    } else {
                        notifyError(data.message);
                    }
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

    useEffect(() => {
        const controller = new AbortController();

        if (event) {
            (() => {
                setLoading(true);
                setSlots([]);

                const date = format(selectedDate, 'yyyy-MM-dd');
                console.log(DayPilot.Date(event.start).getDatePart()); // show the current selected date
                axiosInstance.get(`dashboard/doctors/${event.doctor_id}/slots?date=${date}`, 
                    {signal: controller.signal})
                    .then(function({data}) {
                        setSlots([...data]);

                        if (data.length > 0) { 
                            setSelectedSlotId(event.id);
                        } else {
                            setSelectedSlotId(0);
                        }
                    })
                    .catch(function(error) {
                        if (error.name === 'CanceledError') {
                            console.log('requête annulée.');
                        } else {
                            console.log(error); 
                        }
                    })
                    .finally(function() {
                        setLoading(false);
                    });     
            })(); 
        }

        return () => {
            controller.abort();
        }
    }, [event, selectedDate]);

     return createPortal(
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <strong>{`Rendez-vous avec ${event ? event.doctor_name : '---'}`}</strong>
                    </h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <AutocompleteField initialName="" onSelect={handleAutocompleteSelect} />
                            </div>
                            <div className="col-sm-8 mb-3">
                                <div className="appointment-calender dz-calender">
                                    <DatePicker selected={selectedDate} className="form-control"
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                        inline
                                        locale={fr}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-4 mb-3 text-center">
                                <label className="form-label"><strong>Créneaux horaires</strong></label>
                                <div class="times">
                                    {loading ? <div className="d-flex align-items-center justify-content-center h-100">
                                        Chargement...
                                        </div>
                                        :
                                    slots.length > 0 ?
                                        slots.map((slot, index) => (
                                            <label class="time" key={index} htmlFor={`slot-${slot.id}`}>
                                                <input 
                                                    type="radio" 
                                                    id={`slot-${slot.id}`} 
                                                    checked={selectedSlotId == slot.id}
                                                    onChange={(e) => setSelectedSlotId(e.target.value)}
                                                    value={slot.id}  
                                                /> 
                                                <span class="show-time">{slot.format_start_time} - {slot.format_end_time}</span>
                                            </label>
                                        )) : 
                                        <div className="d-flex align-items-center justify-content-center h-100">Aucun</div>
                                    }
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Note<span className="text-danger">*</span></label>
                                <textarea 
                                    rows={3}
                                    value={inputs.reason1} 
                                    onChange={event => handleOnChange(event.target.value, 'reason1')} 
                                    className="form-control"
                                ></textarea>
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

export default MakeAppointmentModal;