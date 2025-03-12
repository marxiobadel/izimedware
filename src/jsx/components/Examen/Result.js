import { Link } from "react-router-dom";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import { Accordion } from "react-bootstrap";
import { useRef, useState } from "react";
import { isImageUrl, notifyError } from "../../constant/theme";
import axiosInstance from "../../../services/AxiosInstance";

const Result = ({ result, index, destroy }) => {
    const imageRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState([]);

    const loadModel = async() => {
        await tf.setBackend("webgl"); 
        await tf.ready(); 
    
        const model = await mobilenet.load();
        return model;
    }

    const classifyImage = () => {
        setLoading(true);

        axiosInstance
            .get(`examens/results/${result.id}`, { responseType: "blob" })
            .then((response) => {
                const blob = response.data;
    
                mobilenet
                    .load() 
                    .then((model) => {
                        const img = new Image();
                        img.crossOrigin = "use-credentials"; 
                        img.src = URL.createObjectURL(blob);

                        img.onload = () => {
                            imageRef.current = img;
                            model
                                .classify(img)
                                .then((results) => {
                                    setPredictions([]);
                                    setPredictions(prevState => [...prevState, ...results]);
                                })
                                .catch(() => {
                                    notifyError("La classification a échoué.");
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        };

                        img.onerror = () => notifyError("Error loading image blob");
                    })
                    .catch((error) => {
                        console.log(error);
                        notifyError("Le model d'entrainement a échoué.");
                        setLoading(false);
                    })
            }).catch((error) => {
                console.log(error);
                notifyError("Votre image n'a pas chargé correctement.");
                setLoading(false);
            });
    };

    return (
        <Accordion.Item eventKey={`${index}`}>
            <Accordion.Header className="accordion-header accordion-header-primary">
                Résultat #{index + 1} - {result.created_at}
                <span className="accordion-header-indicator "></span>
            </Accordion.Header>
            <Accordion.Collapse eventKey={`${index}`} className="accordion__body">
                <div className="accordion-body">
                    {result.content}
                    {predictions.length > 0 && (
                        <div className="mt-2">
                            <h4 className="font-semibold">Prédictions des données image grâce à l'IA :</h4>
                            <ul className="mt-2">
                                {predictions.map((prediction, i) => (
                                    <li key={i}>
                                        {prediction.className} - <strong>{(prediction.probability * 100).toFixed(2)}%</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>)}
                    <img ref={imageRef} src={result.file_url} alt="Input"
                        style={{ display: predictions.length > 0 ? 'block' : 'none', width: '100px' }}
                        className="mb-4 border rounded mt-2" 
                    />
                    <div className="text-end mt-2">
                        {result.file_url &&
                            <Link to={'#'} onClick={() => window.open(result.file_url, "_blank", "noopener,noreferrer")}>
                                <i className="fa fa-download text-dark me-3"></i>
                            </Link>}
                        {result.file_url && isImageUrl(result.file_url) &&
                            <Link to={'#'} onClick={classifyImage}>
                                {loading ?
                                    <i className="fas fa-ellipsis-h text-primary me-3"></i> :
                                    <i className="fa fa-arrows text-primary me-3"></i>}
                            </Link>}
                        <Link to={'#'} onClick={() => destroy(result.id)}>
                            <i className="fa fa-trash text-danger"></i>
                        </Link>
                    </div>
                </div>
            </Accordion.Collapse>
        </Accordion.Item>
    )
}

export default Result;