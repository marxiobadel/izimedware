import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import Swal from "sweetalert2";
import { notifyInfo, notifySuccess } from "../../constant/theme";
import InterdictionModal from "./modal/InterdictionModal";

const Interdiction = ({admission}) => {
    const [interdictions, setInterdictions] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const handleAdd = (interdiction) => {
        setInterdictions((prevState) => [interdiction, ...prevState]);

        setOpenModal(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title:'Etes-vous sûr ?',
            text: "Après suppression, vous ne pourrez pas récupérer la donnée supprimée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dd6b55',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Ok, supprimé !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`interdictions/${id}`)
                    .then(({data}) => {
                        setInterdictions((prevState) => prevState.filter((interdiction) => interdiction.id !== id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        if (error.response) {
                            if (error.response.status === 400) {
                                notifyInfo("L'interdiction ne peut être supprimée");
                            }
                        }
                    })
            }
        })
    };

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`admissions/${admission.id}/interdictions`, {signal: controller.signal})
                .then(function({data}) {
                    setInterdictions([...data.interdictions]);
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
            <div className="card pb-0">
                <div className="card-header border-0 pb-0">
                    <h4 className="card-title">Interdictions</h4>
                    <button onClick={() => setOpenModal(true)} type="button" className="btn btn-xs btn-primary btn-rounded">
                        <i className="fa fa-plus color-info"></i>
                    </button>
                </div>
                <div className="card-body p-0">
                    <div
                        style={{ height: "370px" }}
                        id="DZ_W_Todo4"
                        className="widget-media dz-scroll height370  ps--active-y my-4 px-4"
                    >
                        <ul className="timeline">
                            {interdictions.map(interdiction => (
                                    <li key={interdiction.id}>
                                        <div className="timeline-panel">
                                            <div className="media-body">
                                                <h5 className="mb-0">{interdiction.description}</h5>
                                                <small className="text-muted">{interdiction.created_at}</small>
                                            </div>
                                            <button onClick={() => handleDelete(interdiction.id)}
                                                className="btn btn-xs btn-danger btn-rounded ms-2"
                                            >
                                                <i className="fa fa-trash"></i>    
                                            </button>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <InterdictionModal 
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAdd}
                admission={admission}
            />
        </>
    )
}

export default Interdiction;