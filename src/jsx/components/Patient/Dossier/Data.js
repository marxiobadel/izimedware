import { Card, Nav, Tab } from "react-bootstrap";
import DossierAppointment from "./Appointment";
import DossierConsultation from "./Consultation";
import DossierPrescription from "./Prescription";
import DossierAdmission from "./Admission";

const Data = () => {
    return (
        <Card>
            <Card.Body>
                <Tab.Container defaultActiveKey="appointments">
                    <Nav as="ul" className="nav-pills mb-5 light">
                        <Nav.Item as="li"><Nav.Link eventKey="appointments">Rendez-vous</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="consultations">Consultations</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="prescriptions">Prescriptions</Nav.Link></Nav.Item>
                        <Nav.Item as="li"><Nav.Link eventKey="admissions">Hospitalisations</Nav.Link></Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="appointments"><DossierAppointment /></Tab.Pane>
                        <Tab.Pane eventKey="consultations"><DossierConsultation /></Tab.Pane>
                        <Tab.Pane eventKey="prescriptions"><DossierPrescription /></Tab.Pane>
                        <Tab.Pane eventKey="admissions"><DossierAdmission /></Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>
    );
}

export default Data;