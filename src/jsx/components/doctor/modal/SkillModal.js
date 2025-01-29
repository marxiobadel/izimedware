import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";

const SkillModal = ({ show, onHide, onSave, skill}) => {
    const [inputs, setInputs] = useState({ name: '' });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }
    
    useEffect(() => {
        if (skill) {
            handleOnChange(skill.name, 'name');
        } else {
            handleOnChange('', 'name');
        }

        setErrors({});
    }, [skill]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const method = skill ? 'PUT' : 'POST';
        const url = skill ? 'skills/'+ skill.id : 'skills';
        const type = skill ? 'edit' : 'add';
        const message = skill ? 'modifiée' : 'ajoutée';

        axiosInstance.request({
            method,
            url,
            data: inputs,
            headers: {
                "Content-Type": 'Application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, type);

                    handleOnChange('', 'name');

                    notifySuccess(`${data.data.name} ${message} avec succès`);
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
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-sm" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(skill ? 'Modifier' : 'Ajouter') + ' une compétence'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <label className="form-label">Nom<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control" />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {skill ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default SkillModal;