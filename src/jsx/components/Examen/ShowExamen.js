import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/AxiosInstance";
import PageTitle from "../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../../hooks/useTitle";

const ShowExamen = () => {
    const { id } = useParams();

    const [examen, setExamen] = useState(null);

    useDocumentTitle("Détail de l'examen");
 
    useEffect(() => {
        (() => {
            axiosInstance.get(`examens/${id}`)
                .then(function ({ data }) {
                    setExamen(data.data);
                    console.log(data.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })();
    }, []);

    return (
        <>
            <PageTitle pageContent={''} motherMenu={'Examen'} activeMenu={"Détail de l'examen"} />
            <ToastContainer />
        </>
    )
}

export default ShowExamen;