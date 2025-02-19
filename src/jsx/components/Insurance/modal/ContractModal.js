import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { createPortal } from "react-dom";

const ContractModal = ({ show, onHide, onSave, contract, patients, insurances}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({ 
        number: '',
        coverage_rate: '',
        start_date: new Date(),
        end_date: null,
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedInsurance, setSelectedInsurance] = useState(null);

    const handlePatientChange = (option) => {
        setSelectedPatient(option);
    }

    const handleInsuranceChange = (option) => {
        setSelectedInsurance(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'number');
        handleOnChange('', 'coverage_rate');
        handlePatientChange(null);
        handleInsuranceChange(null);
        handleOnChange(new Date(), 'start_date');
        handleOnChange(new Date(), 'end_date');
    }

    useEffect(() => {
        if (contract) {
            handleOnChange(contract.number, 'number');
            handleOnChange(contract.coverage_rate, 'coverage_rate');
            handlePatientChange(patients.find(p => p.id === contract.patient_id));
            handleInsuranceChange(insurances.find(i => i.id === contract.insurance_id));
            handleOnChange(new Date(contract.start_date), 'start_date');
            handleOnChange(contract.end_date ? new Date(contract.end_date) : null, 'end_date');
        } else {
            resetForm();
        }

        setErrors({});
    }, [contract]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const start_date = format(inputs.start_date, 'yyyy-MM-dd');
        const end_date = inputs.end_date ? format(inputs.end_date, 'yyyy-MM-dd') : null;
        const patient_id = selectedPatient ? selectedPatient.id : null;
        const insurance_id = selectedInsurance ? selectedInsurance.id : null;

        axiosInstance.request({
            method: contract ? 'PUT' : 'POST',
            url: contract ? 'contracts/'+ contract.id : 'contracts',
            data: {...inputs, patient_id, insurance_id, start_date, end_date},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, contract ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Contract d'assurance ${contract ? 'modifié' : 'ajouté'} avec succès`);
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
                    <h5 className="modal-title">{(contract ? 'Modifier' : 'Ajouter') + ' un contrat d\'assurance'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Numéro de contrat<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.number} 
                                    onChange={event => handleOnChange(event.target.value, 'number')} 
                                    className="form-control" />
                                {errors.number && <div className="text-danger">
                                    <small style={errorStyle}>{errors.number.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Taux de couverture<span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input type="text" 
                                        value={inputs.coverage_rate} 
                                        onChange={event => handleOnChange(event.target.value, 'coverage_rate')} 
                                        className="form-control" />
                                    <span className="input-group-text">%</span>
                                </div>
                                {errors.coverage_rate && <div className="text-danger">
                                    <small style={errorStyle}>{errors.coverage_rate.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de début<span className="text-danger">*</span></label>
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
                                <label className="form-label">Date de fin</label>
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
                                <label className="form-label">Assurance<span className="text-danger">*</span></label>
                                <Select options={insurances} className="custom-react-select" 
                                    placeholder="Choisir une assurance"
                                    isSearchable
                                    value={selectedInsurance}
                                    onChange={handleInsuranceChange} 
                                    getOptionValue={i => i.id}
                                    getOptionLabel={i => i.name}
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
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {contract ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default ContractModal;