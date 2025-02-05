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

const ExamenModal = ({currentUser, show, onHide, onSave, examen, doctors, types, medicalProcedures}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        type_id: null,
        reference: '',
        doctor_id: null,
        date: null,
    });

    const [doctor, setDoctor] = useState(null);
    const [type, setType] = useState(null);
    const [medicalProcedure, setMedicalProcedure] = useState(null);
    const [curdate, setCurdate] = useState(new Date());

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleDoctorChange = (option) => {
        setDoctor(option);
    }

    const handleTypeChange = (option) => {
        setType(option);
    }

    const handleMedicalProcedureChange = (option) => {
        setMedicalProcedure(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'reference');
        handleTypeChange(null);
        handleDoctorChange(currentUser ?? null);
        handleMedicalProcedureChange(null);
        setCurdate(new Date());
    }
    
    useEffect(() => {
        if (examen) {
            handleOnChange(examen.consultation_or_patient_ref, 'reference');
            handleDoctorChange(doctors.find(d => d.id === examen.doctor_id));
            handleTypeChange(types.find(t => t.id === examen.type.id));
            handleMedicalProcedureChange(medicalProcedures.find(mp => mp.id === examen.medical_procedure_id));
            setCurdate(examen.curdate ? new Date(examen.curdate) : new Date());
        } else {
            resetForm();
        }
        
        setErrors({});
    }, [examen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(curdate, 'yyyy-MM-dd');
        const doctor_id = doctor ? doctor.id : null;
        const type_id = type ? type.id : null;
        const medical_procedure_id = medicalProcedure ? medicalProcedure.id : null;

        axiosInstance.request({
            method: examen ? 'PUT' : 'POST',
            url: examen ? 'examens/'+ examen.id : 'examens',
            data: {...inputs, date, type_id, doctor_id, medical_procedure_id},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, data.medical_procedure_id, examen ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Examen médical ${examen ? 'modifié' : 'ajouté'} avec succès`);
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
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(examen ? 'Modifier' : 'Ajouter') + ' un examen médical'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                        <div className="col-sm-6 mb-3">
                            <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={curdate} 
                                    onChange={setCurdate} 
                                />
                                {errors.date && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Type d'examen<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir un type d'examen"
                                    isSearchable
                                    value={type}
                                    onChange={handleTypeChange} 
                                    getOptionValue={t => t.id}
                                    getOptionLabel={t => t.name}
                                />
                                {errors.type_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.type_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
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
                                <label className="form-label">Acte médical<span className="text-danger">*</span></label>
                                <Select options={medicalProcedures} className="custom-react-select" 
                                    placeholder='Associer un acte'
                                    isSearchable
                                    value={medicalProcedure}
                                    onChange={handleMedicalProcedureChange} 
                                    getOptionValue={mp => mp.id}
                                    getOptionLabel={mp => mp.name}
                                />
                                {errors.medical_procedure_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.medical_procedure_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">ID (consultation ou patient)<span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={inputs.reference} 
                                    onChange={event => handleOnChange(event.target.value, 'reference')} 
                                    className="form-control"
                                />
                                {errors.reference && <div className="text-danger">
                                    <small style={errorStyle}>{errors.reference.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {examen ? 'Mettre à jour' : 'Sauvegarder'}
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
 
export default connect(mapStateToProps)(ExamenModal);