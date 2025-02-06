import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { errorStyle, notifySuccess } from '../../../constant/theme';
import axiosInstance from "../../../../services/AxiosInstance";
import Select from 'react-select';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const MedicineModal = ({ show, onHide, onSave, medicine, formes, categories, unities}) => {
    const [inputs, setInputs] = useState({ 
        name: '', 
        price: '',
        alert_stock: '',
        forme_id: null,
        category_id: null,
        unity_id: null,
        image: null,
        description: ''
    });

    const [forme, setForme] = useState(null);
    const [category, setCategory] = useState(null);
    const [unity, setUnity] = useState(null);
    const [files, setFiles] = useState([]);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleForme = (option) => {
        setForme(option);
    }

    const handleCategory = (option) => {
        setCategory(option);
    }

    const handleUnity = (option) => {
        setUnity(option);
    }

    const handleOnChange = (value, input) => {
        setInputs(prevState => ({...prevState, [input]: value}));
    }

    const resetForm = () => {
        handleOnChange('', 'name');
        handleOnChange('', 'price');
        handleOnChange('', 'alert_stock');
        handleOnChange('', 'description');
        setForme(null);
        setCategory(null);
        setUnity(null);
        setFiles([]);
    }
    
    useEffect(() => {
        if (medicine) {
            handleOnChange(medicine.name, 'name');
            handleOnChange(medicine.price, 'price');
            handleOnChange(medicine.alert_stock, 'alert_stock');
            handleOnChange(medicine.description ?? '', 'description');
            if (medicine.cover_url) {
                /*setFiles([{
                    source: medicine.cover_url,
                    options: {
                        type: 'local'
                    }
                }]);*/
            } 
            setCategory(categories.find(c => c.id === medicine.category_id));
            setForme(formes.find(f => f.id === medicine.forme_id));
            setUnity(unities.find(u => u.id === medicine.unity_id));
        } else {
            resetForm();
        }

        setErrors({});
    }, [medicine]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setSaving(true);

        const forme_id = forme ? forme.id : null;
        const category_id = category ? category.id : null;
        const unity_id = unity ? unity.id : null;
        const image = files.length > 0 ? files[0].file : null

        axiosInstance.request({
            method: 'POST',
            url: medicine ? 'medicines/'+ medicine.slug : 'medicines',
            data: { ...inputs, forme_id, category_id, unity_id, image},
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(function(response) {
                const data = response.data;
               
                if (Object.entries(data.data).length === 0 && data.errors) {
                    setErrors({...data.errors});
                } else {
                    onSave(data.data, medicine ? 'edit' : 'add');

                    resetForm();

                    notifySuccess(`${data.data.name} ${medicine ? 'modifié' : 'ajouté'} avec succès`);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
            .finally(function() {
                setSaving(false);
            }); 
    };

    return (
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-lg" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{(medicine ? 'Modifier' : 'Ajouter') + ' un médicament'}</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row"> 
                            <div className="col-sm-8 mb-3">
                                <label className="form-label">Nom<span className="text-danger">*</span></label>
                                <input type="text" 
                                    value={inputs.name} 
                                    onChange={event => handleOnChange(event.target.value, 'name')} 
                                    className="form-control" />
                                {errors.name && <div className="text-danger">
                                    <small style={errorStyle}>{errors.name.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-4 mb-3">                                        
                                <label className="form-label">Unité<span className="text-danger">*</span></label>
                                <Select options={unities} className="custom-react-select" 
                                    placeholder='Choisir une unité'
                                    isSearchable
                                    value={unity}
                                    onChange={handleUnity} 
                                    getOptionValue={u => u.id}
                                    getOptionLabel={u => u.name}
                                />
                                {errors.unity_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.unity_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Prix<span className="text-danger">*</span></label>
                                <input type="number" 
                                    value={inputs.price} 
                                    onChange={event => handleOnChange(event.target.value, 'price')} 
                                    className="form-control" />
                                {errors.price && <div className="text-danger">
                                    <small style={errorStyle}>{errors.price.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="form-label">Stock d'alerte<span className="text-danger">*</span></label>
                                <input type="number" 
                                    value={inputs.alert_stock} 
                                    onChange={event => handleOnChange(event.target.value, 'alert_stock')} 
                                    className="form-control" />
                                {errors.alert_stock && <div className="text-danger">
                                    <small style={errorStyle}>{errors.alert_stock.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Forme<span className="text-danger">*</span></label>
                                <Select options={formes} className="custom-react-select" 
                                    placeholder='Choisir une forme'
                                    isSearchable
                                    value={forme}
                                    onChange={handleForme} 
                                    getOptionValue={f => f.id}
                                    getOptionLabel={f => f.name}
                                />
                                {errors.forme_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.forme_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-6 mb-3">                                        
                                <label className="form-label">Catégorie<span className="text-danger">*</span></label>
                                <Select options={categories} className="custom-react-select" 
                                    placeholder='Choisir une catégorie'
                                    isSearchable
                                    value={category}
                                    onChange={handleCategory} 
                                    getOptionValue={c => c.id}
                                    getOptionLabel={c => c.name}
                                />
                                {errors.category_id && <div className="text-danger">
                                    <small style={errorStyle}>{errors.category_id.join('\n\r')}</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">                                        
                                <label className="form-label">Image</label>
                                <FilePond
                                    files={files}
                                    /*server={{
                                        load: (source, load) => {
                                            fetch(source, { credentials: 'include' })
                                                .then(res => res.blob())
                                                .then(load)
                                                .catch((err) => console.error("Error loading image:", err));
                                        }
                                    }}*/
                                    onupdatefiles={setFiles}
                                    allowMultiple={false}
                                    acceptedFilesTypes={["image/*"]}
                                    labelIdle="Glisser-déposer l'image du médicament"
                                    allowImagePreview={false}
                                    credits={false}
                                />
                                {errors.image && <div className="text-danger">
                                    <small style={errorStyle}>{errors.image.join('\n\r')}</small>
                                </div>}
                                {!errors.image && medicine && <div className="text-info">
                                    <small style={errorStyle}>Seulement pour changer l'image</small>
                                </div>}
                            </div>
                            <div className="col-sm-12 mb-3">
                                <label className="form-label">Description</label>
                                <textarea 
                                    rows={5}
                                    value={inputs.description} 
                                    onChange={event => handleOnChange(event.target.value, 'description')} 
                                    className="form-control"
                                ></textarea>
                                {errors.description && <div className="text-danger">
                                    <small style={errorStyle}>{errors.description.join('\n\r')}</small>
                                </div>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {medicine ? 'Mettre à jour' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default MedicineModal;