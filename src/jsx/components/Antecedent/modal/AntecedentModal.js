import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { createPortal } from "react-dom";

const AntecedentModal = ({show, onHide, onSave, antecedent, patients, types, statuses}) => {
    registerLocale("fr", fr);
    
    const [inputs, setInputs] = useState({ 
        description: '',
        date: new Date(),
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handlePatientChange = (option) => {
        setSelectedPatient(option);
    }

    const handleTypeChange = (option) => {
        setSelectedType(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handlePatientChange(null);
        handleTypeChange(null);
        handleOnChange(new Date(), 'date');
        handleOnChange('', 'description');
        setSelectedStatus(null);
    }

    useEffect(() => {
        if (antecedent) {
            handlePatientChange(patients.find(p => p.id === antecedent.patient_id));
            handleTypeChange(types.find(t => t.id === antecedent.type.id));
            handleOnChange(new Date(antecedent.date), 'date');
            handleOnChange(antecedent.description ?? '', 'description');
            setSelectedStatus(statuses.find(status => status.value === antecedent.status) ?? null);
        } else {
            resetForm();
        }

        setErrors({});
    }, [antecedent]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(inputs.date, 'yyyy-MM-dd');
        const user_id = selectedPatient ? selectedPatient.id : null;
        const type_id = selectedType ? selectedType.id : null;
        const status = selectedStatus ? selectedStatus.value : null;

        axiosInstance.request({
            method: antecedent ? 'PUT' : 'POST',
            url: antecedent ? 'antecedents/'+ antecedent.id : 'antecedents',
            data: {...inputs, user_id, type_id, date, status},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, antecedent ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Antécédent ${antecedent ? 'modifié' : 'ajouté'} avec succès`);
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
        <Modal className="modal fade" dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(antecedent ? 'Modifier' : 'Ajouter') + ' un antécédent'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de diagnostic<span className="text-danger">*</span></label>
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
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Type<span className="text-danger">*</span></label>
                                <Select options={types} className="custom-react-select" 
                                    placeholder="Choisir une assurance"
                                    isSearchable
                                    value={selectedType}
                                    onChange={handleTypeChange} 
                                    getOptionValue={t => t.id}
                                    getOptionLabel={t => t.name}
                                />
                                {errors.insurance_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.insurance_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Patient<span className="text-danger">*</span></label>
                                <Select options={patients} className="custom-react-select" 
                                    placeholder='Choisir un patient'
                                    isSearchable
                                    value={selectedPatient}
                                    onChange={handlePatientChange} 
                                    getOptionValue={p => p.id}
                                    getOptionLabel={p => p.fullname}
                                />
                                {errors.patient_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.patient_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Statut<span className="text-danger">*</span></label>
                                <Select options={statuses} className="custom-react-select" 
                                    placeholder='Choisir un statut'
                                    value={selectedStatus}
                                    onChange={setSelectedStatus} 
                                />
                                {errors.status && <div className="text-danger">
                                    <small style={errorStyle}>{errors.status.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label">Description</label>
                                <textarea type="text" 
                                    rows={3}
                                    value={inputs.description} 
                                    onChange={event => handleOnChange(event.target.value, 'description')} 
                                    className="form-control" ></textarea>
                                {errors.description && <div className="text-danger">
                                    <small style={errorStyle}>{errors.number.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {antecedent ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default AntecedentModal;