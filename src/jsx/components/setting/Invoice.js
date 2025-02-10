import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { useDropzone } from 'react-dropzone';
import { notifyError, notifySuccess } from '../../constant/theme';

const Invoice = () => {
    const imageStyle = {
        with: '100px',
        height: '100px',
        objetFit: 'cover'
    };

    const [type, setType] = useState('');

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [saving, setSaving] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length) {
            const file = acceptedFiles[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file)); 
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false,
    });

    const handleSubmit = () => {
        setSaving(true);

        axiosInstance.post(`settings/invoice/update`,
            { invoice_type: type, logo: image },
            { headers: {"Content-Type": "multipart/form-data"}}
        )
            .then(function ({ data }) {
                setType(data.invoice_type);

                notifySuccess(data.message);
            })
            .catch(function (error) {
                if (error.response && error.response.data) {
                    notifyError(error.response.data.message);
                }
            })
            .finally(function () {
                setSaving(false);
            });
    }

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('settings/invoice/index', {signal: controller.signal})
                .then(function({data}) {
                    setType(data.invoice_type);
                    setPreviewImage(data.logo_url);
                })
                .catch(function(error) {
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
        <div className="card pb-0">
            <div className="card-header border-0 pb-0">
                <h4 className="card-title">Paramètres de facture</h4>
            </div>
            <div className="card-body px-4">
                <div className="row mt-4">
                    <div className="col-6 col-sm-4 col-md-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                value="receipt"
                                checked={type === 'receipt'}
                                onChange={handleTypeChange}
                            />
                            <label className="form-check-label" style={{ paddingTop: '4px' }}>
                                Reçu
                            </label>
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-md-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                value="invoice"
                                checked={type === 'invoice'}
                                onChange={handleTypeChange}
                            />
                            <label className="form-check-label" style={{ paddingTop: '4px' }}>
                                Facture A4
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12">
                        <div
                            {...getRootProps({
                                className:
                                    "border-dashed border-2 border-gray-400 p-4 text-center bg-white cursor-pointer",
                            })}
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-600">
                                Glissez-déposez votre Logo ici, ou cliquez pour sélectionner
                            </p>
                        </div>
                        {previewImage && (
                            <div className="mt-4">
                                <p className="text-sm font-medium">Aperçu du logo :</p>
                                <img src={previewImage} alt="Logo" className="mt-2" style={imageStyle}/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 d-flex justify-content-end">
                        <button onClick={handleSubmit} disabled={saving} className="btn btn-primary btn-xs">
                            Mettre à jour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invoice;