import { useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { format } from 'date-fns';
import { createPortal } from "react-dom";
import axiosInstance from "../../../../services/AxiosInstance";
import { notifyError } from "../../../constant/theme";

const PrintModal = ({show, onHide}) => {
    registerLocale("fr", fr);

    const [inputs, setInputs] = useState({
        date: new Date(),
    });

    const [saving, setSaving] = useState(false);

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);

        const date = format(inputs.date, 'yyyy-MM-dd');

        axiosInstance.request({
            method: 'POST',
            url: 'plannings/print',
            data: {...inputs, date},
            headers: {
                "Content-Type": 'application/json'
            },
            responseType: 'blob'
        })
            .then(function({data}) {
                const pdfUrl = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'planning.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(pdfUrl);
            })
            .catch(function(error) {
                if (error.response && error.response.status === 422) {
                    notifyError('Aucun planning pour cette date.');
                } else {
                    console.log(error);
                }
            })
            .finally(function() {
                setSaving(false);
            });  
    };

    return createPortal(
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Imprimer un planning</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row picker-data">
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Date<span className="text-danger">*</span></label>
                                <DatePicker 
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={inputs.date} 
                                    onChange={date => handleOnChange(date, 'date')} 
                                />
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

export default PrintModal;