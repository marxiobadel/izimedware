import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select';
import { errorStyle, GENDER, notifySuccess } from '../../../constant/theme';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";

const DoctorModal = ({ show, onHide, onSave, doctor, roles, skills}) => {
    registerLocale("fr", fr);
    const CustomClearText = () => "X";

    const ClearIndicator = (props) => {
    const {
        children = <CustomClearText />,
        getStyles,
        innerProps: { ref, ...restInnerProps },
    } = props;
        return (
            <div
                {...restInnerProps}
                ref={ref}
                style={getStyles("clearIndicator", props)}
            >
                <div style={{ padding: "0px 5px" }}>{children}</div>
            </div>
        );
    };

    const ClearIndicatorStyles = (base, state) => ({
        ...base,
        cursor: "pointer",
        color: state.isFocused ? "blue" : "black",
    });

    const [inputs, setInputs] = useState({
        lastname: '',
        firstname: '',
        email: '',
        address: '',
        phone: '',
        date_of_birth: new Date(),
        gender: null,
        password: '',
        password_confirmation: '',
        role_names: [],
        skill_id: null
    });

    const [genderOption, setGenderOption] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [skill, setSkill] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSkill = (option) => {
        setSkill(option);
    }
   
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
        setSelectedRoles([]);
        handleSkill(null);
    }
    
    useEffect(() => {
        if (doctor) {
            handleOnChange(doctor.lastname, 'lastname');
            handleOnChange(doctor.firstname, 'firstname');
            handleOnChange(doctor.phone ?? '', 'phone');
            handleOnChange(doctor.address ?? '', 'address');
            handleOnChange(doctor.email, 'email');
            handleGenderChange(GENDER.find(gender => gender.value === doctor.gender));
            handleOnChange(doctor.birthday ? new Date(doctor.birthday) : null, 'date_of_birth');
            handleOnChange('', 'password');
            handleOnChange('', 'password_confirmation');
            setSelectedRoles(doctor.roles.filter(role => role.name !== 'member'));
            handleSkill(doctor.skills.length > 0 ? doctor.skills[0] : null);
        } else {
            resetForm();
        }

        setErrors({});
    }, [doctor]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);
    
        const date_of_birth = inputs.date_of_birth ? format(inputs.date_of_birth, 'yyyy-MM-dd') : null;
        const gender = genderOption ? genderOption.value : null;
        const role_names = selectedRoles.length > 0 ? selectedRoles.map(role => role.name) : [];
        const skill_id = skill ? skill.id : null;

        const url = doctor ? 'doctors/'+ doctor.id : 'doctors';
        const message = doctor ? 'modifié' : 'ajouté';

        axiosInstance.post(url, {...inputs, date_of_birth, gender, role_names, skill_id}, {
            headers: { "Content-Type": "application/json" }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, doctor ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`Nouveau membre ${message} avec succès`);
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
                    <h5 className="modal-title">{(doctor ? 'Modifier' : 'Ajouter') + ' un membre'}</h5>
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
                                <label className="form-label">Roles</label>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={{ ClearIndicator }}         
                                    styles={{ clearIndicator: ClearIndicatorStyles }}
                                    className="plugins-select-feild"         
                                    onChange={setSelectedRoles}
                                    value={selectedRoles}
                                    isMulti
                                    options={roles}
                                    getOptionValue={r => r.name}
                                    getOptionLabel={r => r.display_name}
                                />
                                {errors.role_names && <div className="text-danger">
                                    <small style={errorStyle}>{errors.role_names.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Compétence<span className="text-danger">*</span></label>
                                <Select options={skills} className="custom-react-select" 
                                    placeholder='Choisir une compétence'
                                    isSearchable
                                    value={skill}
                                    onChange={handleSkill} 
                                    getOptionValue={s => s.id}
                                    getOptionLabel={s => s.name}
                                />
                                {errors.skill_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.skill_id.join('\n\r')}</small>
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
                                <label className="form-label">Mot de passe{!doctor && <span className="text-danger">*</span>}</label>
                                <input type="password" 
                                    value={inputs.password} 
                                    onChange={event => handleOnChange(event.target.value, 'password')} 
                                    className="form-control" />
                                    {!errors.password && doctor &&  <small>Seulement pour modification</small>}
                                {errors.password && <div className="text-danger">
                                    <small style={errorStyle}>{errors.password.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Confirmation{!doctor && <span className="text-danger">*</span>}</label>
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
                        {doctor ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default DoctorModal;