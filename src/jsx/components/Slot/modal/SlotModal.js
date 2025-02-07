import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";
import { connect } from "react-redux";
import { createPortal } from "react-dom";
import TimePickerPicker from 'react-time-picker';

const SlotModal = ({currentUser, show, onHide, onSave, slot, doctors}) => {
    registerLocale("fr", fr);

    const statuses = [
        {label: 'Reservé', value: 'reserved'},
        {label: 'Disponible', value: 'free'},
        {label: 'Indisponible', value: 'busy'}
    ];

    const [inputs, setInputs] = useState({
        date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        capacity: '1',
        status: null
    });

    const [doctor, setDoctor] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('1', 'capacity');
        handleDoctorChange(currentUser ?? null);
        handleOnChange(new Date(), 'date');
        handleOnChange(new Date(), 'start_time');
        handleOnChange(new Date(), 'end_time');
        handleOnChange(null, 'status');
    }
    
    useEffect(() => {
        if (slot) {
            handleOnChange(slot.capacity, 'capacity');
            handleDoctorChange(doctors.find(d => d.id === slot.doctor_id));
            handleOnChange(new Date(slot.date), 'date');
            handleOnChange(new Date(slot.start_time), 'start_time');
            handleOnChange(new Date(slot.end_time), 'end_time');
            handleOnChange(statuses.find(status => status.value === slot.status), 'status');
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [slot]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(inputs.date, 'yyyy-MM-dd');
        const start_time = typeof inputs.start_time === 'object' ? format(inputs.start_time, 'HH:mm') : inputs.start_time;
        const end_time = typeof inputs.end_time === 'object' ? format(inputs.end_time, 'HH:mm') : inputs.end_time;
        const doctor_id = doctor ? doctor.id : null;
        const status = inputs.status ? inputs.status.value : null;

        axiosInstance.request({
            method: slot ? 'PUT' : 'POST',
            url: slot ? 'slots/'+ slot.id : 'slots',
            data: {...inputs, date, start_time, end_time, doctor_id, status},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, slot ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Créneau horaire ${slot ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(slot ? 'Modifier' : 'Ajouter') + ' un créneau horaire'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.date} 
                                    onChange={date => handleOnChange(date, 'date')} 
                                />
                                {errors.date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 color-time-picker mb-3">
                                <label className="form-label">Heure de début<span className="text-danger">*</span></label>
                                <TimePickerPicker 
                                    onChange={time => handleOnChange(time, 'start_time')} 
                                    value={inputs.start_time} 
                                />
                                {errors.start_time && <div className="text-danger">
                                    <small style={errorStyle}>{errors.start_time.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 color-time-picker mb-3">
                                <label className="form-label">Heure<span className="text-danger">*</span></label>
                                <TimePickerPicker 
                                    onChange={time => handleOnChange(time, 'end_time')} 
                                    value={inputs.end_time} 
                                />
                                {errors.end_time && <div className="text-danger">
                                    <small style={errorStyle}>{errors.end_time.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Personnel médical<span className="text-danger">*</span></label>
                                <Select options={doctors} className="custom-react-select" 
                                    placeholder='Choisir un membre'
                                    isSearchable
                                    value={doctor}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => d.fullname}
                                />
                                {errors.doctor_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.doctor_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Nombre de patient<span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    value={inputs.capacity} 
                                    onChange={event => handleOnChange(event.target.value, 'capacity')} 
                                    className="form-control"
                                />
                                {errors.capacity && <div className="text-danger">
                                    <small style={errorStyle}>{errors.capacity.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Statut<span className="text-danger">*</span></label>
                                <Select options={statuses} className="custom-react-select" 
                                    placeholder='Choisir un statut'
                                    value={inputs.status}
                                    onChange={status => handleOnChange(status, 'status')} 
                                />
                                {errors.status && <div className="text-danger">
                                    <small style={errorStyle}>{errors.status.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {slot ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(SlotModal);