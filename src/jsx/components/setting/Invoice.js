import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { useDropzone } from 'react-dropzone';
import { notifyError, notifySuccess } from '../../constant/theme';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Invoice = () => {
    const imageStyle = {
        with: '100px',
        height: '100px',
        objetFit: 'cover'
    };

    const [inputs, setInputs] = useState({
        name: '',
        address: '',
        phone: '',
        file_note: '',
        invoice_type: '',
        email: '',
        website: ''
    });

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

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
            { ...inputs, logo: image },
            { headers: {"Content-Type": "multipart/form-data"}}
        )
            .then(function ({ data }) {
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
                    handleOnChange(data.name ?? '', 'name');
                    handleOnChange(data.address ?? '', 'address');
                    handleOnChange(data.phone ?? '', 'phone');
                    handleOnChange(data.invoice_type, 'invoice_type');
                    handleOnChange(data.file_note ?? '', 'file_note');
                    handleOnChange(data.email ?? '', 'email');
                    handleOnChange(data.website ?? '', 'website');
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
                <h4 className="card-title">Paramètres de fichiers</h4>
            </div>
            <div className="card-body px-4">
                <div className="row mt-4">
                    <div className="col-6 col-sm-4 col-md-3 mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                value="receipt"
                                checked={inputs.invoice_type === 'receipt'}
                                onChange={(event) => handleOnChange(event.target.value, 'invoice_type')}
                            />
                            <label className="form-check-label" style={{ paddingTop: '4px' }}>
                                Reçu
                            </label>
                        </div>
                    </div>
                    <div className="col-6 col-sm-8 col-md-9 mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                value="invoice"
                                checked={inputs.invoice_type === 'invoice'}
                                onChange={(event) => handleOnChange(event.target.value, 'invoice_type')}
                            />
                            <label className="form-check-label" style={{ paddingTop: '4px' }}>
                                Fichier A4
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label className="form-label">Nom de l'hôpital</label>
                        <input
                            type="text"
                            value={inputs.name} 
                            onChange={event => handleOnChange(event.target.value, 'name')} 
                            className="form-control"
                        />
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label className="form-label">Numéro de contact</label>
                        <input
                            type="text"
                            value={inputs.phone} 
                            onChange={event => handleOnChange(event.target.value, 'phone')} 
                            className="form-control"
                        />
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label className="form-label">E-mail</label>
                        <input
                            type="text"
                            value={inputs.email} 
                            onChange={event => handleOnChange(event.target.value, 'email')} 
                            className="form-control"
                        />
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label className="form-label">Site web</label>
                        <input
                            type="text"
                            value={inputs.website} 
                            onChange={event => handleOnChange(event.target.value, 'website')} 
                            className="form-control"
                        />
                    </div>
                    <div className="col-sm-12 mb-3">
                        <label className="form-label">Adresse</label>
                        <input
                            type="text"
                            value={inputs.address} 
                            onChange={event => handleOnChange(event.target.value, 'address')} 
                            className="form-control"
                        />    
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Note de pieds de page :</label>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={inputs.file_note}
                            onChange={( event, editor ) => handleOnChange(editor.getData(), 'file_note')}
                            config={{language: "fr"}}
                        />
                    </div>
                    <div className="col-12">
                        <hr/>
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