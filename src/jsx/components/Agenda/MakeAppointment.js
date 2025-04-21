import { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import axiosInstance from "../../../services/AxiosInstance";
import MakeAppointmentModal from "./modal/AppoitmentModal";
import { notifyInfo, notifySuccess } from "../../constant/theme";
import { Row } from "react-bootstrap";
import emitter from "../../../context/eventEmitter";

const MakeAppointment = () => {
    const [viewType, setViewType] = useState("Week");
    const [startDate, setStartDate] = useState(DayPilot.Date.today());

    const [events, setEvents] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    // Move to the next/previous date range
    const navigate = (direction) => {
        let newDate = new DayPilot.Date(startDate);

        if (viewType === "Day") {
            newDate = direction === "next" ? newDate.addDays(1) : newDate.addDays(-1);
        } else if (viewType === "Week") {
            newDate = direction === "next" ? newDate.addDays(7) : newDate.addDays(-7);
        } else if (viewType === "Month") {
            newDate = direction === "next" ? newDate.addMonths(1) : newDate.addMonths(-1);
        }

        setStartDate(newDate);
    };

    const formattedDate = new Date(startDate.toString()).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const handleSave = (appointment) => {
        setOpenModal(false);
        notifySuccess(`Rendez-vous sauvegardé avec succès. Merci de patientez...`);

        emitter.emit('appointmentAdded', JSON.stringify(appointment));
    }

    const handleEventClick = (args) => {
        if (args.e.data.status === 'reserved') {
            notifyInfo('Cette évènement est réservé.');
            return false;
        }

        if (args.e.data.status === 'busy') {
            notifyInfo(`${args.e.data.doctor_name} est indisponible.`);
            return false;
        }

        setSelectedEvent(args.e.data);

        setOpenModal(true);
    };

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dashboard/slots`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setEvents([...data]);
                    console.log(data)
                })
                .catch(function (error) {
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
            <Row style={{marginBottom: '100px'}}>
                <div className="col-12" style={{ textAlign: "center", padding: "20px" }}>
                    {/* View selection buttons */}
                    <div style={{ marginBottom: "10px" }}>
                        {["Day", "Week", "Month"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setViewType(type)}
                                style={{
                                    margin: "5px",
                                    padding: "10px 15px",
                                    borderRadius: "5px",
                                    border: `1px solid ${viewType === type ? "#007A64" : "#ccc"}`,
                                    backgroundColor: viewType === type ? "#007A64" : "#fff",
                                    color: viewType === type ? "#fff" : "#000",
                                    fontWeight: viewType === type ? "bold" : "normal",
                                    cursor: "pointer",
                                }}
                            >
                                {type === "Day" ? "Jour" : type === "Week" ? "Semaine" : "Mois"}
                            </button>
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div style={{ marginBottom: "10px" }}>
                        <button className="btn btn-primary btn-xs" onClick={() => navigate("prev")}>⬅ Précédent</button>
                        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
                            {formattedDate}
                        </span>
                        <button className="btn btn-primary btn-xs" onClick={() => navigate("next")}>Suivant ➡</button>
                    </div>

                    {/* Render correct calendar based on selected view */}
                    <div style={{ height: "500px" }}>
                        {viewType === "Month" ? (
                            <DayPilotMonth
                                startDate={startDate.toString()} // Pass updated date
                                locale="fr-fr"
                                events={events}
                                onEventClick={handleEventClick}
                            />
                        ) : (
                            <DayPilotCalendar
                                startDate={startDate.toString()} // Pass updated date
                                viewType={viewType}
                                locale="fr-fr"
                                events={events}
                                onEventClick={handleEventClick}
                            />
                        )}
                    </div>
                </div>
            </Row>
            <MakeAppointmentModal
                show={openModal}
                onHide={() => setOpenModal(false)}
                event={selectedEvent}
                onSave={handleSave}
            />
        </>
    );
};

export default MakeAppointment;
