import { useEffect, useState } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import { Link } from "react-router-dom";

const Dossier = () => {
    const [dossiers, setDossiers] = useState([]);

    const [query, setQuery] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);

            try {
                const { data, status } = await axiosInstance.get(`dossiers?query=${query}`, { signal: controller.signal });

                if (status === 200) {
                    setDossiers([...data.dossiers]);
                }
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('requête annulée.');
                } else {
                    console.error("Error fetching data:", error);
                }
            } finally {
                setLoading(false);
            }
        }, 1500);

        return () => {
            controller.abort();
            clearTimeout(delayDebounceFn);
        }
    }, [query]);

    return (
        <>
            <div className="form-head d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Dossiers</h2>
                    <p className="mb-0">Liste des dossiers</p>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="input-group search-area d-lg-inline-flex d-none">
                            <input
                                type="search" placeholder="Rechercher un dossier..."
                                value={query} onChange={event => setQuery(event.target.value)}
                                className="form-control" />
                            <span className="input-group-text">
                                <i className="flaticon-381-search-2"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {loading ? <div className="col-12 d-flex align-items-center justify-content-center fs-4">Chargement...</div> :
                    (dossiers.length > 0 ? dossiers.map((dossier, index) => (
                        <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                            <div className="card project-boxed">
                                <div className="card-header align-items-start">
                                    <div>
                                        <p className="fs-14 mb-2 text-primary">#{dossier.reference}</p>
                                        <h6 className="fs-18 font-w500 mb-3">
                                            <Link to={`/patient-details/${dossier.patient.id}`} className="text-black user-name">
                                                {dossier.patient.shortname}
                                            </Link>
                                        </h6>
                                        <div className="text-dark fs-14 text-nowrap"><i className="fas fa-calendar me-3" />Ajouté le {dossier.created_at}</div>
                                    </div>
                                    <Link to={`/dossiers/${dossier.id}`}><i className="fa fa-eye"></i></Link>
                                </div>
                                <div className="card-body p-0 pb-3">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">ID patient :</span>
                                            <span className="text-warning fs-6">{dossier.patient?.reference}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">ID médecin :</span>
                                            <span className="text-warning fs-6">{dossier.doctor_reference}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">IMC :</span>
                                            <span className="text-black">{dossier.imc}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="mb-0 title">Statut :</span>
                                            <span className={`${dossier.status ? 'text-success' : 'text-danger'} desc-text ms-2`}>
                                                {dossier.status ? 'ouvert' : 'fermé'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )) : <div className="col-12 d-flex align-items-center justify-content-center fs-4">
                        Aucun dossier de disponible
                    </div>
                    )}
            </div>
        </>
    );
}

export default Dossier;