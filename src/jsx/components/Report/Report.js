import React from 'react';
import { Card, Tab, Nav } from 'react-bootstrap';
import Earning from './Element/Earning';
import Patient from './Element/Patient';
import { useDocumentTitle } from '../../hooks/useTitle';
import Graph from './Element/Graph';

const Report = () => {
    useDocumentTitle('Rapport');

    return (
        <Card>
            <Card.Body>
                <Tab.Container defaultActiveKey="tab1">
                    <Nav as="ul" className="nav-pills mb-4 justify-content-start">
                        <Nav.Item as="li">
                            <Nav.Link eventKey="tab1">
                                Rapport des gains
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link eventKey="tab2">
                                Rapport des patients
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link eventKey="tab3">
                                Rapport du personnel médical
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link eventKey="tab4">
                                Graphique
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="tab1">
                            <Earning />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2">
                            <Patient />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab3">
                            
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab4">
                            <Graph />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>);
}

export default Report;