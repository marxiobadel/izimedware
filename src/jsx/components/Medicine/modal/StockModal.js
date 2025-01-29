import { useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from "../../../constant/theme";
import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import axiosInstance from "../../../../services/AxiosInstance";

const StockModal = ({ show, onHide, onSave, medicines }) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        date: new Date(),
        quantity: '',
        medicine_id: null,
    });

    const [medicine, setMedicine] = useState(null);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleMedicine = (option) => {
        setMedicine(option);
    }

    const resetForm = () => {
        handleOnChange(new Date(), 'date');
        handleOnChange('', 'quantity');
        handleOnChange(null, 'medicine_id');
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = inputs.date ? format(inputs.date, 'yyyy-MM-dd') : null;
        const medicine_id = medicine ? medicine.id : null;

        axiosInstance.request({
            method: 'POST',
            url: 'stocks',
            data: {...inputs, date, medicine_id},
            headers: {
                "Content-Type": 'Application/json'
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data);

                    resetForm();
                    setErrors({});

                    notifySuccess(`Stock ajoutée avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            });  
    }

    return (
        <Modal className="modal fade" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Ajouter un stock</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
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
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Médicament<span className="text-danger">*</span></label>
                                <Select options={medicines} className="custom-react-select" 
                                    placeholder='Choisir un médicament'
                                    isSearchable
                                    value={medicine}
                                    onChange={handleMedicine} 
                                    getOptionValue={m => m.id}
                                    getOptionLabel={m => m.name}
                                />
                                {errors.medicine_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.medicine_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Quantity<span className="text-danger">*</span></label>
                                <input type="number"
                                    value={inputs.quantity}
                                    onChange={event => handleOnChange(event.target.value, 'quantity')}
                                    className="form-control" />
                                {errors.quantity && <div className="text-danger">
                                    <small style={errorStyle}>{errors.quantity.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        Sauvegarder
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default StockModal;