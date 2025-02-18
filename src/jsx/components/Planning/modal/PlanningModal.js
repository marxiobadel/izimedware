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

const PlanningModal = ({currentUser, show, onHide, onSave, toDuplicate, planning, doctors, services}) => {
    registerLocale("fr", fr);

    const statuses = [
        {label: 'Créé', value: 'add'},
        {label: 'En cours', value: 'processing'},
        {label: 'Non complété', value: 'incomplete'},
        {label: 'Fait', value: 'done'}
    ];

    const [inputs, setInputs] = useState({
        date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        task: '',
        status: null
    });

    const [doctor, setDoctor] = useState(null);
    const [service, setService] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handleServiceChange = (option) => {
        setService(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'task');
        handleDoctorChange(currentUser ?? null);
        handleServiceChange(null);
        handleOnChange(new Date(), 'date');
        handleOnChange(new Date(), 'start_time');
        handleOnChange(new Date(), 'end_time');
        handleOnChange(statuses[0], 'status');
    }
    
    useEffect(() => {
        if (planning) {
            handleOnChange(planning.task ?? '', 'task');
            handleDoctorChange(doctors.find(d => d.id === planning.doctor_id));
            handleServiceChange(services.find(s => s.id === planning.service_id));
            handleOnChange(new Date(planning.date), 'date');
            handleOnChange(new Date(planning.start_time), 'start_time');
            handleOnChange(new Date(planning.end_time), 'end_time');
            handleOnChange(statuses.find(status => status.value === planning.status), 'status');
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [planning]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(inputs.date, 'yyyy-MM-dd');
        const start_time = typeof inputs.start_time === 'object' ? format(inputs.start_time, 'HH:mm') : inputs.start_time;
        const end_time = typeof inputs.end_time === 'object' ? format(inputs.end_time, 'HH:mm') : inputs.end_time;
        const service_id = service ? service.id : null;
        const doctor_id = doctor ? doctor.id : null;
        const status = inputs.status ? inputs.status.value : null;

        axiosInstance.request({
            method: planning && !toDuplicate ? 'PUT' : 'POST',
            url: planning && !toDuplicate ? 'plannings/'+ planning.id : 'plannings',
            data: {...inputs, date, start_time, end_time, doctor_id, service_id, status},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, planning && !toDuplicate ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Planning ${toDuplicate ? 'dupliqué' : (planning ? 'modifié' : 'ajouté')} avec succès`);
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
                    <h5 className="modal-title">{(toDuplicate ? 'Dupliquer' : (planning ? 'Modifier' : 'Ajouter')) + ' un planning'}</h5>
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
                                <label className="form-label">Heure de fin<span className="text-danger">*</span></label>
                                <TimePickerPicker 
                                    onChange={time => handleOnChange(time, 'end_time')} 
                                    value={inputs.end_time} 
                                />
                                {errors.end_time && <div className="text-danger">
                                    <small style={errorStyle}>{errors.end_time.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-7 mb-3">                                        
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
                            <div className="col-sm-5 mb-3">                                        
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
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Département<span className="text-danger">*</span></label>
                                <Select options={services} className="custom-react-select" 
                                    placeholder='Choisir un département'
                                    isSearchable
                                    value={service}
                                    onChange={handleServiceChange} 
                                    getOptionValue={s => s.id}
                                    getOptionLabel={s => s.name}
                                />
                                {errors.service_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.service_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Tâche</label>
                                <textarea
                                    rows={3}
                                    value={inputs.task} 
                                    onChange={event => handleOnChange(event.target.value, 'task')} 
                                    className="form-control"
                                ></textarea>
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
                        {planning && !toDuplicate ? 'Mettre à jour' : 'Sauvegarder'}
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
 
export default connect(mapStateToProps)(PlanningModal);