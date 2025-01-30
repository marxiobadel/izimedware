import { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";

const ShowInvoice = () => {
    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState('cash');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleSubmit = () => {
        setSaving(true);

        axiosInstance.post(`invoices/${id}/payment`, 
            { payment_method: paymentMethod }, 
            { headers: { "Content-Type": "application/json" }}
        )
            .then(function({data}) {
                setInvoice({...data.data});
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    }

    const handleCancel = () => {
        setCancelling(true);

        axiosInstance.get(`invoices/${id}/cancelled`, 
            { headers: { "Content-Type": "application/json" }}
        )
            .then(function({data}) {
                setInvoice({...data.data});
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setCancelling(false);
            }); 
    }

    const handlePrint = () => {
        setSaving(true);

        axiosInstance.get(`invoices/${id}/impression`, {responseType: 'blob'})
            .then(function({data}) {
                const pdfUrl = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `${invoice ? invoice.reference : 'facture'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(pdfUrl);
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    }

    useEffect(() => {
        (() => {
            axiosInstance.get(`invoices/${id}`)
                .then(function ({ data }) {
                    setInvoice(data.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })();
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Facturation'} activeMenu={'Détail de facture'} />
            <ToastContainer />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card  mt-3">
                        <div className="card-header">
                            {" "}
                            {invoice ? invoice.reference : '---'} <strong>{invoice ? invoice.created_at : '---'}</strong>{" "}
                            <span className="float-right">
                                <strong>Statut : </strong>
                                <span className={`text-${invoice ? invoice.status_color : ''}`}>{invoice ? invoice.status_label : '---'}</span>
                            </span>{" "}
                        </div>
                        <div className="card-body">
                            <div className="row mb-5">
                                <div className="mt-4 col-sm-12">
                                    <h6>A :</h6>
                                    <div>
                                        {" "}
                                        <strong>{invoice ? invoice.patient.fullname : '---'}</strong>{" "}
                                    </div>
                                    {invoice && invoice.patient.address &&
                                        <div>{invoice.patient.address}</div>
                                    }
                                    <div>E-mail : {invoice ? invoice.patient.email : '---'}</div>
                                    {invoice && invoice.patient.phone &&
                                        <div>Téléphone : {invoice.patient.phone}</div>
                                    }
                                </div>
                            </div>
                            {invoice && invoice.medicines.length > 0 &&
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">#</th>
                                                    <th>Nom</th>
                                                    <th className="text-center">Quantité</th>
                                                    <th className="text-end">P.U</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice &&
                                                    invoice.medicines.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.name}</td>
                                                            <td className="text-center">{item.pivotQuantity}</td>
                                                            <td className="text-end">{item.pivotAmountWithCurrency}</td>
                                                            <td className="text-end">{item.pivotTotalWithCurrency}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-5"></div>
                                        <div className="col-lg-4 col-sm-5 ms-auto">
                                            <table className="table table-clear">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <strong className="text-black">Sous-Total</strong>
                                                        </td>
                                                        <td className="text-end">{invoice.medicines_amount_with_currency}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>}
                            {invoice && invoice.vProducts.length > 0 &&
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">#</th>
                                                    <th>Nom</th>
                                                    <th className="text-center">Quantité</th>
                                                    <th style={{ textAlign: 'right' }}>P.U</th>
                                                    <th style={{ textAlign: 'right' }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice &&
                                                    invoice.vProducts.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.name} ({item.reference})</td>
                                                            <td className="text-center">{item.pivotQuantity}</td>
                                                            <td className="text-end">{item.pivotAmountWithCurrency}</td>
                                                            <td className="text-end">{item.pivotTotalWithCurrency}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-5"></div>
                                        <div className="col-lg-4 col-sm-5 ms-auto">
                                            <table className="table table-clear">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <strong className="text-black">Sous-Total</strong>
                                                        </td>
                                                        <td className="text-end">{invoice.v_products_amount_with_currency}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>}
                            <div className="row">
                                <div className="col-lg-4 col-sm-5"></div>
                                <div className="col-lg-4 col-sm-5 ms-auto">
                                    <table className="table table-clear">
                                        <tbody>
                                            <tr>
                                                <td className="text-start">
                                                    <strong className="text-black fs-4">Total</strong>
                                                </td>
                                                <td className="fs-4 text-black text-end">
                                                    <b>{invoice ? invoice.amount_with_currency : '---'}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {invoice && invoice.status === 'pending' &&
                            <>
                                <div className="row mt-4">
                                    <div className="col-6 col-sm-4 col-md-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label" style={{paddingTop: '4px'}}>
                                                Cash
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label" style={{paddingTop: '4px'}}>
                                                Carte (Visa, MasterCard...)
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                value="insurance"
                                                checked={paymentMethod === 'insurance'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label" style={{paddingTop: '4px'}}>
                                                Assurance
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                value="cheque"
                                                checked={paymentMethod === 'cheque'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label" style={{paddingTop: '4px'}}>
                                                Chèque
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 d-flex justify-content-end">
                                        <button onClick={handleSubmit} 
                                            disabled={saving} className="btn btn-primary">
                                            Payer
                                        </button>
                                    </div>
                                </div>
                            </>}
                            <div className="row mt-2">
                                <div className="col-12 d-flex justify-content-end">
                                    {invoice && invoice.status !== 'pending' &&
                                        <>
                                            <button onClick={handlePrint} 
                                                disabled={saving} className="btn btn-primary">
                                                Imprimer
                                            </button>
                                            {invoice.status !== 'cancelled' &&
                                                <button onClick={handleCancel} 
                                                    disabled={cancelling} className="ms-1 btn btn-danger">
                                                    Annuler
                                                </button> 
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowInvoice;