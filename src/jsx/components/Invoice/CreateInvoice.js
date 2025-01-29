import React, { useState, useEffect, useMemo } from 'react';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import { ToastContainer } from 'react-toastify';
import PageTitle from '../../layouts/PageTitle';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { notifyError, notifySuccess } from '../../constant/theme';
import AddButton from './Part/AddButton';

const CreateInvoice = () => {
    const datas = useMemo(() => [
        {label: "Médicament", value: "medicine"},
        {label: "Acte médical", value: "medicalProcedure"}
    ]);

    const [defaultCurrency, setDefaultCurrency] = useState('USD');

    const [selectedData, setSelectedData] = useState(datas[0]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const [medicines, setMedicines] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [vProducts, setVProducts] = useState([]);

    const [inputMedicines, setInputMedicines] = useState([]);
    const [inputVProducts, setInputVProducts] = useState([]);

    const [saving, setSaving] = useState(false);

    const handlePatientChange = (option) => {
        setSelectedPatient(option);

        if (option) {
            showPatientPrescriptions(option);
        }
    };

    const handlePrescriptionChange = (option) => {
        setSelectedPrescription(option);

        if (option.medicines && option.medicines.length > 0) {
            option.medicines.forEach(medicine => {
                const { id, name, price, pivotQuantity } = medicine;

                const input = inputMedicines.find(m => m.id === id);

                const object = { id, name: name +' ('+ option.reference +')', quantity: pivotQuantity, amount: price };

                if (!input) {
                    setInputMedicines(prevItems => [...prevItems, object]);
                }
            });
        }
    }

    const handleInputMedicineChange = (e, i) => {
        const field = e.target.name; 
        const newInputs = [...inputMedicines]; 
        newInputs[i][field] = e.target.value; 
        setInputMedicines(newInputs); 
    };

    const handleInputVProductChange = (e, i) => {
        const field = e.target.name; 
        const newInputs = [...inputVProducts]; 
        newInputs[i][field] = e.target.value; 
        setInputVProducts(newInputs); 
    };

    const handleAddInputMedicine = (medicine_id) => {
        const { id, name, price } = medicines.find(m => m.id === medicine_id);

        const input = inputMedicines.find(m => m.id === medicine_id);
        if (!input) {
            setInputMedicines([...inputMedicines, { id, name, quantity: 1, amount: price }]); 
        }
    };

    const handleAddInputVProduct = (vProduct_id) => {
        const { id, name, amount, reference } = vProducts.find(vProduct => vProduct.id === vProduct_id);

        const input = inputVProducts.find(vProduct => vProduct.id === vProduct_id);
        if (!input) {
            setInputVProducts([...inputVProducts, { reference, id, name, quantity: 1, amount }]); 
        }
    };

    const subTotalMedicines = ()  => {
        return inputMedicines.reduce((acc, medicine) => {
            return acc + (parseInt(medicine.quantity) * parseFloat(medicine.amount));
        }, 0)
    }

    const subTotalVProducts = ()  => {
        return inputVProducts.reduce((acc, vProduct) => {
            return acc + (parseInt(vProduct.quantity) * parseFloat(vProduct.amount));
        }, 0)
    }

    const handleDeleteInputMedicine = (i) => {
        const newInputs = [...inputMedicines]; 
        newInputs.splice(i, 1); 
        setInputMedicines(newInputs); 
    };

    const handleDeleteInputVProduct = (i) => {
        const newInputs = [...inputVProducts]; 
        newInputs.splice(i, 1); 
        setInputVProducts(newInputs); 
    };

    const [getting, setGetting] = useState(false);

    const showPatientPrescriptions = (option) => {
        setGetting(true);

        axiosInstance.get(`invoices/${option.slug}/prescriptions`,  
            { headers: { "Content-Type": "application/json" }}
        )
            .then(function({data}) {
                setSelectedPrescription(null);
                setPrescriptions([...data.data]);
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setGetting(false);
            }); 
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setSaving(true);

        const patient_id = selectedPatient ? selectedPatient.id : null;

        axiosInstance.post('invoices', 
            { medicines: inputMedicines, vProducts: inputVProducts, patient_id }, 
            { headers: { "Content-Type": "application/json" }}
        )
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    if (data.errors.patient_id) {
                        notifyError(data.errors.patient_id.join('\n\r'));
                    }else if (data.errors.quantity) {
                        notifyError(data.errors.quantity.join('\n\r'));
                    } else if (data.errors.amount) {
                        notifyError(data.errors.amount.join('\n\r'));
                    }
                } else {
                    setInputMedicines([]);
                    setInputVProducts([]);

                    notifySuccess(`Facture créée avec succès.`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    };

    useDocumentTitle('Ajouter une facture');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (() => {
            axiosInstance.get('invoices/create')
                .then(function ({ data }) {
                    setMedicines([...data.medicines]);
                    setVProducts([...data.vProducts]);
                    setPatients([...data.patients]);
                    setDefaultCurrency(data.defaultCurrency);
                })
                .catch(function (error) {
                    console.log(error);
                }).finally(function () {
                    setLoading(false);
                });
        })();
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Facturation'} activeMenu={'Ajouter une facture'} />
            <ToastContainer />
            <div className="row">
                <div className="col-md-4">
                    <div className="card pb-0">
                        <div className="card-header border-0 pb-0 flex-column">
                            <h4 className="card-title">Médicament / Acte médical</h4>
                            <div className="mt-3 w-100 mb-1">
                                <Select options={datas} className="custom-react-select" 
                                    placeholder="Choisir une option"
                                    styles={{width: '100%'}}
                                    isSearchable
                                    value={selectedData}
                                    onChange={setSelectedData}
                                />
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div
                                style={{ height: "370px" }}
                                id="DZ_W_Todo4"
                                className="widget-media dz-scroll height370  ps--active-y my-4 px-4"
                            >
                                <ul className="timeline">
                                    {loading ? 
                                        <li className="text-center">...</li>
                                    :
                                        (selectedData.value === 'medicine' ?
                                            medicines.map(medicine => (
                                                <li key={medicine.id}>
                                                    <div className="timeline-panel">
                                                        <div className="media-body">
                                                            <h5 className="mb-0">{medicine.name}</h5>
                                                            <small className="text-muted">{medicine.price_with_currency}</small>
                                                        </div>
                                                        <AddButton add={() => handleAddInputMedicine(medicine.id)}/>
                                                    </div>
                                                </li>
                                            ))
                                            :
                                            vProducts.map(vProduct => (
                                                <li key={vProduct.id}>
                                                    <div className="timeline-panel">
                                                        <div className="media-body">
                                                            <h5 className="mb-0">{vProduct.name}</h5>
                                                            <small className="text-muted">
                                                                {vProduct.reference} - {vProduct.amount_with_currency}
                                                            </small>
                                                        </div>
                                                        <AddButton add={() => handleAddInputVProduct(vProduct.id)}/>
                                                    </div>
                                                </li>
                                            ))
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card card-bx">
                        <div className="card-body">
                            <div className="row align-items-end">
                                <div className="col-12 col-sm-6 col-lg-5 mb-3 mb-lg-4">
                                    <label className="form-label">Patient</label>
                                    <Select options={patients} className="custom-react-select"
                                        isDisabled={loading}
                                        placeholder={loading ? 'Chargement...' : 'Choisir un patient'}
                                        isSearchable
                                        value={selectedPatient}
                                        onChange={handlePatientChange}
                                        getOptionValue={p => p.id}
                                        getOptionLabel={p => p.fullname}
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-5 mb-3 mb-lg-4">
                                    <label className="form-label">Prescription</label>
                                    <Select options={prescriptions} className="custom-react-select"
                                        placeholder={getting ? 'Chargement...' : (prescriptions.length == 0 ? 'Aucune prescription' : 'Choisir une prescription')}
                                        isSearchable
                                        isDisabled={getting || prescriptions.length == 0}
                                        value={selectedPrescription}
                                        onChange={handlePrescriptionChange}
                                        getOptionValue={p => p.id}
                                        getOptionLabel={p => p.reference +' --- '+ (p.created_at)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <Table responsive>
                                    <thead> 
                                        <tr>
                                            <th><strong>Nom</strong></th>
                                            <th><strong>Quantité</strong></th>
                                            <th><strong>Montant</strong></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputMedicines.length == 0 ?
                                            (<tr className="text-center"><td colSpan={4}>Liste des médicaments</td></tr>)
                                            :  
                                            <>
                                            {inputMedicines.map((input, index) => ( 
                                                <tr key={index}>
                                                    <td>{input.name}</td>
                                                    <td>
                                                        <input type="number" value={input.quantity} name="quantity" required style={{width: '100px'}}
                                                            onChange={e => handleInputMedicineChange(e, index)}  
                                                            className="form-control" />                           
                                                    </td>
                                                    <td>
                                                        <input type="number" value={input.amount} name="amount" required style={{width: '150px'}}
                                                            onChange={e => handleInputMedicineChange(e, index)}  
                                                            className="form-control" />  
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={"#"} onClick={() => handleDeleteInputMedicine(index)} className="btn btn-danger shadow btn-xs sharp">
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                                <tr>
                                                    <td className="text-end" colSpan={2}>Sous-Total</td>
                                                    <td className="text-end" colSpan={2}>
                                                        <b>{subTotalMedicines()} {defaultCurrency}</b>
                                                    </td>
                                                </tr>
                                            </>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <div className="row mt-2">
                                <Table responsive>
                                    <thead> 
                                        <tr>
                                            <th><strong>Nom</strong></th>
                                            <th><strong>Quantité</strong></th>
                                            <th><strong>Montant</strong></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputVProducts.length == 0 ?
                                            (<tr className="text-center"><td colSpan={4}>Liste des actes médicaux</td></tr>)
                                            :  
                                            <>
                                            {inputVProducts.map((input, index) => ( 
                                                <tr key={index}>
                                                    <td>{input.name}</td>
                                                    <td>
                                                        <input type="number" value={input.quantity} name="quantity" required style={{width: '100px'}}
                                                            onChange={e => handleInputVProductChange(e, index)}  
                                                            className="form-control" />                           
                                                    </td>
                                                    <td>
                                                        <input type="number" value={input.amount} name="amount" required style={{width: '100px'}}
                                                            onChange={e => handleInputVProductChange(e, index)}  
                                                            className="form-control" />  
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link to={"#"} onClick={() => handleDeleteInputVProduct(index)} className="btn btn-danger shadow btn-xs sharp">
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                                <tr>
                                                    <td className="text-end" colSpan={2}>Sous-Total</td>
                                                    <td className="text-end" colSpan={2}><b>{subTotalVProducts()} {defaultCurrency}</b></td>
                                                </tr>
                                            </>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <div className="row mt-2 mb-4">
                                <div className="col-12 text-end fs-4">
                                    <strong>Total : {subTotalMedicines() + subTotalVProducts()} {defaultCurrency}</strong>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 d-flex justify-content-end">
                                    <button onClick={handleSubmit} 
                                        disabled={(inputVProducts.length === 0 && inputMedicines.length === 0) || saving} className="btn btn-primary">
                                        Sauvegarder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateInvoice;