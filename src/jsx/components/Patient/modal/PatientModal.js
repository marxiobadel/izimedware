import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, GENDER, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";

const PatientModal = ({ show, onHide, onSave, patient}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        lastname: '',
        firstname: '',
        email: '',
        address: '',
        phone: '',
        date_of_birth: new Date(),
        gender: null,
        password: '',
        password_confirmation: ''
    });

    const [genderOption, setGenderOption] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    
    const handleGenderChange = (option) => {
        setGenderOption(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'lastname');
        handleOnChange('', 'firstname');
        handleOnChange('', 'phone');
        handleOnChange('', 'address');
        handleOnChange('', 'email');
        handleGenderChange(null);
        handleOnChange(new Date(), 'date_of_birth');
        handleOnChange('', 'password');
        handleOnChange('', 'password_confirmation');
    }
    
    useEffect(() => {
        if (patient) {
            handleOnChange(patient.lastname, 'lastname');
            handleOnChange(patient.firstname, 'firstname');
            handleOnChange(patient.phone ?? '', 'phone');
            handleOnChange(patient.address ?? '', 'address');
            handleOnChange(patient.email, 'email');
            handleGenderChange(GENDER.find(gender => gender.value === patient.gender));
            handleOnChange(patient.birthday ? new Date(patient.birthday) : null, 'date_of_birth');
            handleOnChange('', 'password');
            handleOnChange('', 'password_confirmation');
        } else {
            resetForm();
        }

        setErrors({});
    }, [patient]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date_of_birth = inputs.date_of_birth ? format(inputs.date_of_birth, 'yyyy-MM-dd') : null;
        const gender = genderOption ? genderOption.value : null;

        const url = patient ? 'patients/'+ patient.slug : 'patients';
        const type = patient ? 'edit' : 'add';
        const message = patient ? 'modifié' : 'ajouté';

        axiosInstance.post(url, {...inputs, date_of_birth, gender}, {
            headers: { "Content-Type": "application/json" }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, type);

                    resetForm();

                    notifySuccess(`Patient ${message} avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return (
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(patient ? 'Modifier' : 'Ajouter') + ' un patient'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Nom de famille<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.lastname} 
                                    onChange={event => handleOnChange(event.target.value, 'lastname')} 
                                    className="form-control" />
                                {errors.lastname && <div className="text-danger">
                                    <small style={errorStyle}>{errors.lastname.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3"> 
                                <label className="form-label">Prénom<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.firstname} 
                                    onChange={event => handleOnChange(event.target.value, 'firstname')} 
                                    className="form-control" />
                                {errors.firstname && <div className="text-danger">
                                    <small style={errorStyle}>{errors.firstname.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Gender<span className="text-danger">*</span></label>
                                <Select options={GENDER} className="custom-react-select" 
                                    isClearable={false}
                                    placeholder='Choisir un sexe'
                                    isSearchable={false}
                                    value={genderOption}
                                    onChange={handleGenderChange} 
                                />
                                {errors.gender && <div className="text-danger">
                                    <small style={errorStyle}>{errors.gender.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Date de naissance<span className="text-danger">*</span></label> <br />
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.date_of_birth} 
                                    onChange={(date) => handleOnChange(date, 'date_of_birth')} 
                                />
                                {errors.date_of_birth && <div className="text-danger">
                                    <small style={errorStyle}>{errors.date_of_birth.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Adresse</label>
                                <input type="text"
                                    value={inputs.address} 
                                    onChange={event => handleOnChange(event.target.value, 'address')}  
                                    className="form-control" />
                                {errors.address && <div className="text-danger">
                                    <small style={errorStyle}>{errors.address.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Téléphone</label>
                                <input type="text"
                                    value={inputs.phone} 
                                    onChange={event => handleOnChange(event.target.value, 'phone')}  
                                    className="form-control" />
                                {errors.phone && <div className="text-danger">
                                    <small style={errorStyle}>{errors.phone.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Adresse e-mail<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.email} 
                                    onChange={event => handleOnChange(event.target.value, 'email')} 
                                    className="form-control" />
                                {errors.email && <div className="text-danger">
                                    <small style={errorStyle}>{errors.email.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Mot de passe{!patient && <span className="text-danger">*</span>}</label>
                                <input type="password" 
                                    value={inputs.password} 
                                    onChange={event => handleOnChange(event.target.value, 'password')} 
                                    className="form-control" />
                                    {!errors.password && patient &&  <small>Seulement pour modification</small>}
                                {errors.password && <div className="text-danger">
                                    <small style={errorStyle}>{errors.password.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Confirmation{!patient && <span className="text-danger">*</span>}</label>
                                <input type="password" 
                                    value={inputs.password_confirmation} 
                                    onChange={event => handleOnChange(event.target.value, 'password_confirmation')} 
                                    className="form-control" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {patient ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default PatientModal;