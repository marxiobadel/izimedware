import { useState } from "react";
import { Modal } from "react-bootstrap";
import axiosInstance from "../../../../services/AxiosInstance";
import { createPortal } from "react-dom";
import Select from 'react-select';
import { errorStyle } from "../../../constant/theme";

const PaymentModal = ({ id, show, onHide, onSave, invoice, patients }) => {
    const topStyle = {
        paddingTop: '3.5px'
    }

    const [paymentMethod, setPaymentMethod] = useState('cash');

    const [creancier, setCreancier] = useState(null);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleCreancier = (option) => {
        setCreancier(option);
    }

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const creancier_id = creancier ? creancier.id : null

        axiosInstance.post(`invoices/${id}/payment`,
            { payment_method: paymentMethod, creancier_id },
            { headers: { "Content-Type": "application/json" } }
        )
            .then(function ({ data }) {
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                setSaving(false);
            });
    };

    return createPortal(
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Facture <b>{invoice ? invoice.reference : ''}</b></h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-check">
                                    <input
                                        id="cash"
                                        className="form-check-input"
                                        type="radio"
                                        name="payment"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={handlePaymentMethodChange}
                                    />
                                    <label htmlFor="cash" className="form-check-label" style={topStyle}>
                                        Cash
                                    </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                    <input
                                        id="card"
                                        className="form-check-input"
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={handlePaymentMethodChange}
                                    />
                                    <label htmlFor="card" className="form-check-label" style={topStyle}>
                                        Carte (Visa, MasterCard...)
                                    </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                    <input
                                        id="insurance"
                                        className="form-check-input"
                                        type="radio"
                                        name="payment"
                                        value="insurance"
                                        checked={paymentMethod === 'insurance'}
                                        onChange={handlePaymentMethodChange}
                                    />
                                    <label htmlFor="insurance" className="form-check-label" style={topStyle}>
                                        Assurance
                                    </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                    <input
                                        id="cheque"
                                        className="form-check-input"
                                        type="radio"
                                        name="payment"
                                        value="cheque"
                                        checked={paymentMethod === 'cheque'}
                                        onChange={handlePaymentMethodChange}
                                    />
                                    <label htmlFor="cheque" className="form-check-label" style={topStyle}>
                                        Chèque
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-3">                                        
                                <label className="form-label">Créancier</label>
                                <Select options={patients} className="custom-react-select" 
                                    placeholder='Choisir un autre créancier'
                                    isClearable
                                    isSearchable
                                    value={creancier}
                                    onChange={handleCreancier} 
                                    getOptionValue={c => c.id}
                                    getOptionLabel={c => c.fullname}
                                />
                                {errors.forme_id ? <div className="text-danger">
                                    <small style={errorStyle}>{errors.creancier_id.join('\n\r')}</small>
                                </div> : <div className="text-dark">
                                    <small>Laissez ainsi si le patient paye lui-même sa facture</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default PaymentModal;