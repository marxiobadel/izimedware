import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";

import { GENDER, IMAGES, notifyError, notifySuccess } from '../../../constant/theme';
import PageTitle from '../../../layouts/PageTitle';
import axiosInstance from '../../../../services/AxiosInstance';
import { connect } from 'react-redux';
import { useDocumentTitle } from '../../../hooks/useTitle';
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { ToastContainer } from 'react-toastify';
import emitter from '../../../../context/eventEmitter';

function EditProfile ({currentUser}) {
    registerLocale("fr", fr);

    const preStyle = {
        marginBottom: 0
    };

    const avatarStyle = {
        objectFit: 'cover',
        height: 130
    }
     
    const [inputs, setInputs] = useState({
        lastname: currentUser ? currentUser.lastname : '',
        firstname: currentUser ? currentUser.firstname : '',
        email: currentUser ? currentUser.email : '',
        address: currentUser && currentUser.address ? currentUser.address : '',
        phone: currentUser && currentUser.phone ? currentUser.phone : '',
        date_of_birth: currentUser && currentUser.birthday ? new Date(currentUser.birthday) : null,
        gender: currentUser ? GENDER.find(gender => gender.value === currentUser.gender) : null,
        avatar: null
    });

    const [avatarPreview, setAvatarPreview] = useState('');

    const [errors, setErrors] = useState({});

    const [saving, setSaving] = useState(false); 

    const [displayName, setDisplayName] = useState(currentUser ? currentUser.shortname : '---');
 
    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleOnChange(file, 'avatar');

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file); 
        }
    };

    const saveUserInLocalStorage = (currentUser) => {
        const tokenDetailsString = localStorage.getItem('userDetails');

        const tokenDetails = JSON.parse(tokenDetailsString);

        tokenDetails.currentUser = currentUser;
        tokenDetails.displayName = currentUser.fullname;
        tokenDetails.email = currentUser.email;

        setDisplayName(currentUser.shortname);
    
        localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
    }

    const save = (event) => {
        event.preventDefault();

        const date_of_birth = inputs.date_of_birth ? format(inputs.date_of_birth, 'yyyy-MM-dd') : null;
        const gender = inputs.gender.value;

        setSaving(true);
            
        axiosInstance.post('profile', {...inputs, date_of_birth, gender}, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(function(response) {
                const data = response.data;

                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});

                    if (errors.avatar) { 
                        notifyError(errors.avatar.join('\n'));
                    }
                } else {
                    saveUserInLocalStorage(data.data);

                    emitter.emit('avatarUrlChange', data.data.avatar_url);

                    notifySuccess('Profil modifié avec succès !');
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            });        
    }

    useDocumentTitle('Modifier le profil');

    return(
        <>
            <PageTitle pageContent={'Modifier le profil'} motherMenu={'Paramètres'}  activeMenu={'Modifier le profil'}/> 
            <ToastContainer />
            <div className="row">
                <div className="col-xl-3 col-lg-4">
                    <div className="clearfix">
                        <div className="card card-bx profile-card author-profile mb-3">
                            <div className="card-body">
                                <div className="p-5">
                                    <div className="author-profile">
                                        <div className="author-media">
                                        {avatarPreview ? 
                                            <img style={avatarStyle} src={avatarPreview} alt={currentUser ? currentUser.lastname : '---'} />
                                            :
                                            <img style={avatarStyle} src={currentUser ? currentUser.avatar_url : IMAGES.User1} alt={currentUser ? currentUser.lastname : '---'} />
                                        }
                                            <div className="upload-link" title="" data-toggle="tooltip" data-placement="right" data-original-title="update">
                                                <input type="file" className="update-flie" onChange={handleImageChange} />
                                                <i className="fa fa-camera"></i>
                                            </div>
                                        </div>
                                        <div className="author-info">
                                            <h6 className="title">{displayName}</h6>
                                            {currentUser && currentUser.skills && currentUser.skills.length > 0 &&
                                                <span>{currentUser.skills[0].name}</span> 
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="info-list">
                                    <ul>
                                        <li><Link to={"/app-profile"}>Models</Link><span>36</span></li>
                                        <li><Link to={"/uc-lightgallery"}>Gallery</Link><span>3</span></li>
                                        <li><Link to={"/app-profile"}>Lessons</Link><span>1</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="input-group mb-3">
                                    <div className="form-control rounded text-center bg-white">Enregistré depuis le</div>
                                </div>
                                <div className="input-group">
                                    <div className="form-control rounded text-primary text-center bg-white">
                                        {currentUser ? currentUser.created_at : 'Inconnue'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-9 col-lg-8">
                    <div className="card profile-card card-bx">
                        <div className="card-header">
                            <h6 className="title">Configuration du compte</h6>
                        </div>
                        <form className="profile-form" onSubmit={save}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Nom de famille</label>
                                        <input type="text" 
                                            value={inputs.lastname} 
                                            onChange={event => handleOnChange(event.target.value, 'lastname')} 
                                            className="form-control" />
                                        {errors.lastname && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.lastname.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                    <div className="col-sm-6 mb-3"> 
                                        <label className="form-label">Prénom</label>
                                        <input type="text" 
                                            value={inputs.firstname} 
                                            onChange={event => handleOnChange(event.target.value, 'firstname')} 
                                            className="form-control" />
                                        {errors.firstname && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.firstname.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                    <div className="col-sm-6 mb-3">                                        
                                        <label className="form-label">Gender</label>
                                        <Select options={GENDER} className="custom-react-select" 
                                            placeholder='Choisir un sexe'
                                            value={inputs.gender}
                                            isSearchable={false}
                                            onChange={value => handleOnChange(value, 'gender')} 
                                        />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Date de naissance</label> <br />
                                        <DatePicker 
                                            locale="fr"
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control"
                                            selected={inputs.date_of_birth} 
                                            onChange={(date) => handleOnChange(date, 'date_of_birth')} 
                                        />
                                        {errors.date_of_birth && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.date_of_birth.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                    <div className="col-sm-12 mb-3">
                                        <label className="form-label">Adresse</label>
                                        <input type="text"
                                            value={inputs.address} 
                                            onChange={event => handleOnChange(event.target.value, 'address')}  
                                            className="form-control" />
                                        {errors.address && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.address.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Téléphone</label>
                                        <input type="text"
                                            value={inputs.phone} 
                                            onChange={event => handleOnChange(event.target.value, 'phone')}  
                                            className="form-control" />
                                        {errors.phone && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.phone.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Adresse e-mail</label>
                                        <input type="text" 
                                            value={inputs.email} 
                                            onChange={event => handleOnChange(event.target.value, 'email')} 
                                            className="form-control" />
                                        {errors.email && <div className="text-danger fs-12 mt-1">
                                            <pre style={preStyle}>{errors.email.join('\n\r')}</pre>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer align-items-center d-flex justify-content-between">
                                <button type="submit" disabled={saving} className="btn btn-primary">Mettre à jour</button>
                                <Link to={"#"} className="btn-link">Mot de passe oublié ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.auth.currentUser
    };
};
 
export default connect(mapStateToProps)(EditProfile);
