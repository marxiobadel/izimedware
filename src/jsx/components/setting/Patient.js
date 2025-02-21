import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { useDropzone } from 'react-dropzone';
import { notifyError, notifySuccess } from '../../constant/theme';

const Patient = () => {
    const imageStyle = {
        with: '100px',
        height: '100px',
        objetFit: 'cover'
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

        axiosInstance.post(`settings/patient/update`,
            { cover: image },
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
            axiosInstance.get('settings/patient/index', {signal: controller.signal})
                .then(function({data}) {
                    setPreviewImage(data.cover_url ?? null);
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
                <h4 className="card-title">Paramètres du patient</h4>
            </div>
            <div className="card-body px-4">
                <div className="row mt-4">
                    <div className="col-12 col-sm-12 col-md-12">
                        <div
                            {...getRootProps({
                                className:
                                    "border-dashed border-2 border-gray-400 p-4 text-center bg-white cursor-pointer",
                            })}
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-600">
                                Glissez-déposez la couverture du patient, ou cliquez pour sélectionner
                            </p>
                        </div>
                        {previewImage && (
                            <div className="mt-4">
                                <p className="text-sm font-medium">Aperçu de la couverture :</p>
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

export default Patient;