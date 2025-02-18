import { useParams } from 'react-router-dom';
import axiosInstance from '../../../services/AxiosInstance';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../../hooks/useTitle';
import PageTitle from '../../layouts/PageTitle';
import { Table, ToastContainer } from 'react-bootstrap';

const ShowPrescription = () => {
    const { id } = useParams();

    const [saving, setSaving] = useState(false);

    const [prescription, setPrescription] = useState(null);

    const handlePrint = () => {
        setSaving(true);

        axiosInstance.get(`prescriptions/${id}/print`, {responseType: 'blob'})
            .then(function({data}) {
                const pdfUrl = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `${prescription ? prescription.reference : 'prescription'}.pdf`;
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

    useDocumentTitle('Détail d\'une prescription');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`prescriptions/${id}`, { signal: controller.signal })
                .then(function ({ data }) {
                    setPrescription({...data.data});
                    console.log(data)
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Prescription'} activeMenu={'Détail de prescription'} />
            <ToastContainer />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card mt-3">
                        <div className="card-header">
                            {" "}
                            {prescription ? prescription.reference : '---'}
                            <span className="float-right">
                                <strong>{prescription ? prescription.created_at : '---'}</strong>{" "}
                            </span>{" "}
                        </div>
                        <div className="card-body">
                            <div className="row mb-5">
                                <div className="mt-4 col-sm-4">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Médecin</strong>
                                            <span className="mb-0">{prescription ? prescription.doctor_name : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Patient</strong>
                                            <span className="mb-0">{prescription ? prescription.patient_name : '---'}</span>
                                        </li>
                                        <li className="list-group-item d-flex px-0 justify-content-between">
                                            <strong>Origine</strong>
                                            <span className="mb-0">
                                                {prescription ? (prescription.admission ? 'Hospitalisation' : (prescription.consultation ? 'Consultation' : 'Patient')) 
                                                : '---'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-4 col-sm-8">
                                    <Table responsive>
                                        <thead> 
                                            <tr>
                                                <th><strong>Nom</strong></th>
                                                <th><strong>Quantité</strong></th>
                                                <th><strong>Durée (jour)</strong></th>
                                                <th><strong>Posologie</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescription &&
                                                prescription.medicines.map((medicine, index) => ( 
                                                    <tr key={index}>
                                                        <td>{medicine.name}</td>
                                                        <td>{medicine.pivotQuantityWithUnity}</td>
                                                        <td>{medicine.pivotDuration}</td>
                                                        <td>{medicine.pivotPosologie}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                    <div className="mt-2 text-end">
                                        <button onClick={handlePrint} disabled={saving} className="btn btn-primary">
                                            Imprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShowPrescription;