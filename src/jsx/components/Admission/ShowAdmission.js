import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import PageTitle from "../../layouts/PageTitle";
import { Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const ShowAdmission = () => {
    const {id} = useParams();

    const [admission, setAdmission] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`admissions/${id}`, {signal: controller.signal})
                .then(function({data}) {
                    setAdmission([...data.data]);
                    console.log(data);
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
        <>
            <PageTitle pageContent={''} motherMenu={'Hospitalisation'} activeMenu={"Détail de l'hospitalisation"} />
            <ToastContainer />
            <Row>

            </Row>
        </>
    );
}

export default ShowAdmission;