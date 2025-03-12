import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import TimePickerPicker from 'react-time-picker';

const VisiteurModal = ({ show, onHide, onSave, visiteur, admission }) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({ 
        name: '',
        lien: '',
        date: new Date(),
        time: new Date(),
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'lien');
        handleOnChange(new Date(), 'date');
        handleOnChange(new Date(), 'time');
    }

    useEffect(() => {
        if (visiteur) {
            handleOnChange(visiteur.name, 'name');
            handleOnChange(visiteur.lien, 'lien');
            handleOnChange(new Date(visiteur.date), 'date');
            handleOnChange(new Date(visiteur.time), 'time');
        } else {
            resetForm();
        }

        setErrors({});
    }, [visiteur]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const method = visiteur ? 'PUT' : 'POST';
        const url = visiteur ? `visiteurs/${visiteur.id}` : `admissions/${admission.id}/visiteurs`;

        const date = format(inputs.date, 'yyyy-MM-dd');
        const time = typeof inputs.time === 'object' ? format(inputs.time, 'HH:mm') : inputs.time;

        axiosInstance.request({
            method,
            url,
            data: {...inputs, date, time},
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, visiteur ? 'edit' : 'add');

                    resetForm();
                    setErrors({});

                    notifySuccess(`Visiteur ${visiteur ? 'ajouté': 'modifié'} avec succès`);
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
                    <h5 className="modal-title">{`${visiteur ? 'Modifier': 'Ajouter'} un visiteur`}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Nom<span className="text-danger">*</span></label>
                                <input type="text"
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control"/>
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Lien de parentée<span className="text-danger">*</span></label>
                                <input type="text"
                                    value={inputs.lien} 
                                    onChange={event => handleOnChange(event.target.value, 'lien')} 
                                    className="form-control"/>
                                {errors.lien && <div className="text-danger">
                                    <small style={errorStyle}>{errors.lien.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Date de visite<span className="text-danger">*</span></label>
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
                            <div className="col-sm-6 color-time-picker">
                                <label className="form-label">Heure de visite<span className="text-danger">*</span></label>
                                <TimePickerPicker 
                                    onChange={time => handleOnChange(time, 'time')} 
                                    value={inputs.time} 
                                />
                                {errors.time && <div className="text-danger">
                                    <small style={errorStyle}>{errors.time.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {visiteur ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default VisiteurModal;