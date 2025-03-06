import { Card, Nav, Tab } from "react-bootstrap";
import DossierAppointment from "./Appointment";
import DossierConsultation from "./Consultation";
import DossierPrescription from "./Prescription";
import DossierExamen from "./Examen";
import DossierAdmission from "./Admission";
import DossierSoin from "./Soin";

const Data = () => {
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
                        <Tab.Pane eventKey="consultations"><DossierConsultation /></Tab.Pane>
                        <Tab.Pane eventKey="prescriptions"><DossierPrescription /></Tab.Pane>
                        <Tab.Pane eventKey="examens"><DossierExamen /></Tab.Pane>
                        <Tab.Pane eventKey="admissions"><DossierAdmission /></Tab.Pane>
                        <Tab.Pane eventKey="treatments"><DossierSoin /> </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>
    );
}

export default Data;