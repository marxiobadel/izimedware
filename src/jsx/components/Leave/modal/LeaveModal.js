import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { createPortal } from "react-dom";

const LeaveModal = ({ show, onHide, onSave, leave, doctors, types}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({ 
        reason1: '',
        start_date: new Date(),
        end_date: new Date(),
    });

    const textareaRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const handleDoctorChange = (option) => {
        setSelectedDoctor(option);
    }

    const handleTypeChange = (option) => {
        setSelectedType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'reason1');
        handleDoctorChange(null);
        handleTypeChange(null);
        handleOnChange(new Date(), 'start_date');
        handleOnChange(new Date(), 'end_date');
    }

    useEffect(() => {
        if (leave) {
            handleOnChange(leave.reason1, 'reason1');
            handleDoctorChange(doctors.find(d => d.id === leave.doctor_id));
            handleTypeChange(types.find(t => t.id === leave.type.id));
            handleOnChange(new Date(leave.start_date), 'start_date');
            handleOnChange(new Date(leave.end_date), 'end_date');
        } else {
            resetForm();
        }

        setErrors({});
    }, [leave]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [inputs.reason1]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const start_date = format(inputs.start_date, 'yyyy-MM-dd');
        const end_date = format(inputs.end_date, 'yyyy-MM-dd');
        const user_id = selectedDoctor ? selectedDoctor.id : null;
        const type_id = selectedType ? selectedType.id : null;

        axiosInstance.request({
            method: leave ? 'PUT' : 'POST',
            url: leave ? 'leaves/'+ leave.id : 'leaves',
            data: {...inputs, user_id, type_id, start_date, end_date},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, leave ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Congé ${leave ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(leave ? 'Modifier' : 'Ajouter') + ' un congé'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de début<span className="text-danger">*</span></label> <br />
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.start_date} 
                                    onChange={(date) => handleOnChange(date, 'start_date')} 
                                />
                                {errors.start_date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.start_date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de fin<span className="text-danger">*</span></label> <br />
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.end_date} 
                                    onChange={(date) => handleOnChange(date, 'end_date')} 
                                />
                                {errors.end_date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.end_date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Type</label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type"
                                    isSearchable
                                    value={selectedType}
                                    onChange={handleTypeChange} 
                                    getOptionValue={t => t.id}
                                    getOptionLabel={t => t.name}
                                />
                                {errors.type_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Personnel<span className="text-danger">*</span></label>
                                <Select options={doctors} className="custom-react-select" 
                                    placeholder='Choisir un membre'
                                    isSearchable
                                    value={selectedDoctor}
                                    onChange={handleDoctorChange} 
                                    getOptionValue={d => d.id}
                                    getOptionLabel={d => d.fullname}
                                />
                                {errors.user_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.user_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Plus de détails<span className="text-danger">*</span></label>
                                <textarea
                                    ref={textareaRef}
                                    style={{ width: "100%", resize: "none", overflow: "hidden" }}
                                    rows={3} 
                                    value={inputs.reason1} 
                                    onChange={event => handleOnChange(event.target.value, 'reason1')} 
                                    className="form-control"></textarea>
                                {errors.reason1 && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reason1.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {leave ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default LeaveModal;