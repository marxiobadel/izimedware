import { Link } from "react-router-dom";
import axiosInstance from "../../../../services/AxiosInstance";
import { notifySuccess } from "../../../constant/theme";

const Header = ({ dossier, setDossier }) => {
    const handleChangeStatus = (dossier) => {
        axiosInstance.patch(`dossiers/${dossier.id}/status`)
            .then(({data}) => {
                const status = data.data.status;

                setDossier({...dossier, status});
                
                if (status) {
                    notifySuccess('Le dossier a été ouvert avec succès');
                } else {
                    notifySuccess('Le dossier a été fermé avec succès');
                }
            })
            .catch(error => {
                console.log(error)
            })
    };

    return (
        <>
            <div className="col-xl-4 col-lg-6 col-xxl-4 col-sm-6">
                <div className="card text-white bg-primary">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="mb-0">Groupe sanguin :</span>
                            <strong>{dossier ? dossier.patient.blood_group : '---'}</strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="mb-0">Maladie :</span>
                            <strong>{dossier ? dossier.desease_label : '---'}</strong>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-xxl-4 col-sm-6">
                <div className="card text-white bg-dark">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="mb-0">Médecin :</span>
                            <strong>{dossier ? dossier.doctor_reference : '---'}</strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="mb-0">Profil :</span>
                            <strong>{dossier ? dossier.doctor_skill : '---'}</strong>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-xl-4 col-lg-12 col-xxl-4 col-sm-12">
                <div className="card">
                    <div className={`card-body text-center ai-icon text-${dossier && dossier.status ? 'primary' : 'danger'}`}>
                        {dossier ? 
                        <Link onClick={() => handleChangeStatus(dossier)} to={"#"} 
                            className={`btn btn-${dossier.status ? 'primary' : 'danger'} btn-lg px-4`}>
                            {dossier.status ? 'OUVERT' : 'FERMÉ'}
                        </Link>
                        : '---'}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;