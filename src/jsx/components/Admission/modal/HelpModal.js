import { Badge, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";

const HelpModal = ({ show, onHide }) => {
    return createPortal(
        <Modal className="modal fade" backdrop={true} show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Liste des statuts</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <ul>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-info me-2">En attente</Badge>
                                        <span>Patient en attente d'un lit ou d'un service.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2">Admis</Badge>
                                        <span>Patient officiellement hospitalisé.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2 mb-1">Pré-opératoire</Badge>
                                        <span>Patient en préparation pour une intervention.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2">En observation</Badge>
                                        <span>Surveillance sans traitement lourd.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2 mb-1">En traitement</Badge> 
                                        <span>Soins actifs (médicaments, perfusions, opérations)</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2">En rééducation</Badge>
                                        <span>Récupération après intervention ou maladie.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-warning me-2">Isolement</Badge>
                                        <span>Quarantaine pour infections contagieuses.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-warning me-2">Soins intensifs</Badge>
                                        <span>Surveillance critique (monitoring 24h/24).</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-info me-2">Stable</Badge>
                                        <span>État du patient inchangé mais toujours hospitalisé.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-success me-2">Amélioration</Badge>
                                        <span>Le patient va mieux, sortie envisagée.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-warning me-2">Aggravation</Badge>
                                        <span>L'état se dégrade, possible passage en soins intensifs.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-info me-2">Transféré</Badge>
                                        <span>Déplacement vers un autre service/hôpital.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-primary me-2">Sortie avec suivi</Badge>
                                        <span>Rentre chez lui avec un traitement à suivre.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-success me-2">Sortie sans suivi</Badge>
                                        <span>Totalement rétabli, aucun suivi nécessaire.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-warning me-2">Sortie contre avis médical</Badge>
                                        <span>Quitte l'hôpital sans accord du médecin.</span>
                                    </li>
                                    <li className="mb-2">
                                        <Badge bg="" className="badge-rounded badge-outline-danger me-2">Décédé</Badge>
                                        <span>Le patient ne survit pas.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger btn-sm light" onClick={onHide}>Fermer</button>
                </div>
            </div>
        </Modal>, document.body
    )
}

export default HelpModal;