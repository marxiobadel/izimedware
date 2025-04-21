import { useEffect, useState } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { fr },
});

const CustomEvent = ({ event }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: event.title }} />
    );
};

const CustomPopup = ({ event }) => (
    <span className={`ms-1 text-${event.color}`}>{event.doctor}</span>
);

const Agenda = () => {
    const [events, setEvents] = useState([]);

    const calendar = (appointments) => {
        const modifiedAppointments = appointments.map(appointment => ({
            title: `<span class="text-${appointment.status_color}">
                        ${String(appointment.status_label).replace(/\b\w/g, char => char.toUpperCase())}</span><br>
                        <span>Médecin : <b>${appointment.doctor_name}</b></span><br>
                        <span>Patient : <b>${appointment.patient_name}</b></span><br>
                        <span>Motif de rendez-vous : ${appointment.reason1}</span>`,
            doctor: appointment.doctor_name,
            color: appointment.status_color,
            start: new Date(appointment.datetime),
            end: new Date(appointment.end_datetime)
        }));

        setEvents([...modifiedAppointments]);
    }

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dashboard/calendar`, { signal: controller.signal })
                .then(function ({ data }) {
                    calendar(data.appointments);
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
        <div style={{ height: "600px" }}>
            <Calendar
                components={{ event: CustomEvent, eventWrapper: CustomPopup }}
                views={['agenda', 'month', 'day', 'week']}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="fr"
                messages={{
                    month: "Mois",
                    day: "Jour",
                    week: "Semaine",
                    today: "Aujourd'hui",
                    previous: "Précédent",
                    next: "Suivant",
                    date: "Date",
                    time: "Heure",
                    event: "Événement",
                    work_week: "Semaine travail",
                    tomorrow: "Demain",
                    yesterday: "Hier",
                    allDay: "Tous les jours",
                    noEventsInRange: "Il n'y a aucun événement dans cet interval.",
                }}
                style={{ height: 500 }}
            />
        </div>
    );
}

export default Agenda;