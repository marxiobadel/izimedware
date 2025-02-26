import { Link } from "react-router-dom";

const ShowDossier = () => {
    return (
        <>
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Dossier patient</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Dossier</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{'---'}</Link></li>
                    </ol>
                </div>
            </div>  
        </>
    );
}

export default ShowDossier;