import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import TimePickerPicker from 'react-time-picker';
import Select from 'react-select';

const RondeModal = ({ show, onHide, onSave, ronde, admission, doctors }) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({ 
        task: '',
        date: new Date(),
        time: new Date(),
    });

    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleDoctorChange = (option) => {
        setSelectedDoctor(option);
    }

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'task');
        handleDoctorChange(null);
        handleOnChange(new Date(), 'date');
        handleOnChange(new Date(), 'time');
    }

    useEffect(() => {
        if (ronde) {
            handleOnChange(ronde.task ?? '', 'task');
            handleDoctorChange(doctors.find(d => d.id === ronde.doctor_id));
            handleOnChange(new Date(ronde.date), 'date');
            handleOnChange(new Date(ronde.time), 'time');
        } else {
            resetForm();
        }

        setErrors({});
    }, [ronde]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const method = ronde ? 'PUT' : 'POST';
        const url = ronde ? `rondes/${ronde.id}` : `admissions/${admission.id}/rondes`;

        const doctor_id = selectedDoctor ? selectedDoctor.id : null;
        const date = format(inputs.date, 'yyyy-MM-dd');
        const time = typeof inputs.time === 'object' ? format(inputs.time, 'HH:mm') : inputs.time;

        axiosInstance.request({
            method,
            url,
            data: {...inputs, date, time, doctor_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, ronde ? 'edit' : 'add');

                    resetForm();
                    setErrors({});

                    notifySuccess(`Ronde ${ronde ? 'ajoutée': 'modifiée'} avec succès`);
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
                    <h5 className="modal-title">{`${ronde ? 'Modifier': 'Ajouter'} une ronde`}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Personnel médical<span className="text-danger">*</span></label>
                                <Select options={doctors} className="custom-react-select" 
                                    placeholder='Choisir un membre'
                                    isSearchable
                                    value={selectedDoctor}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => d.fullname}
                                />
                                {errors.doctor_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.doctor_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.date} 
                                    onChange={(date) => handleOnChange(date, 'date')} 
                                />
                                {errors.date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3 color-time-picker">
                                <label className="form-label">Heure<span className="text-danger">*</span></label>
                                <TimePickerPicker 
                                    onChange={time => handleOnChange(time, 'time')} 
                                    value={inputs.time} 
                                />
                                {errors.time && <div className="text-danger">
                                    <small style={errorStyle}>{errors.time.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Tâche</label>
                                <textarea
                                    rows={3}
                                    value={inputs.task} 
                                    onChange={event => handleOnChange(event.target.value, 'task')} 
                                    className="form-control"></textarea>
                                {errors.task && <div className="text-danger">
                                    <small style={errorStyle}>{errors.task.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {ronde ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default RondeModal;