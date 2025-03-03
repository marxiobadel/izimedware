import { Card, Nav, Tab } from "react-bootstrap";
import DossierAppointment from "./Appointment";
import Consultation from "./Consultation";
import Prescription from "./Prescription";
import Examen from "./Examen";
import Admission from "./Admission";
import Soin from "./Soin";

const Data = ({dossier}) => {
    return (
        <Card>
            <Card.Body>
                <Tab.Container defaultActiveKey="appointments">
                    <Nav as="ul" className="nav-pills mb-5 light">
                        <Nav.Item as="li"><Nav.Link eventKey="appointments">Rendez-vous</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="consultations">Consultations</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="prescriptions">Prescriptions</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="examens">Examens</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="admissions">Hospitalisations</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="treatments">Soins</Nav.Link></Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="appointments"><DossierAppointment /></Tab.Pane>
                        <Tab.Pane eventKey="consultations">
                            {dossier && dossier.consultations &&
                                <Consultation data={dossier.consultations} />
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="prescriptions">
                            {dossier && dossier.prescriptions &&
                                <Prescription data={dossier.prescriptions} />
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="examens">
                            {dossier && dossier.examens &&
                                <Examen data={dossier.examens} />
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="admissions">
                            {dossier && dossier.admissions &&
                                <Admission data={dossier.admissions} />
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="treatments">
                            {dossier && dossier.soins &&
                                <Soin data={dossier.soins} />
                            }
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>
    );
}

export default Data;