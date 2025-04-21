import { useCallback, useEffect, useState } from "react";
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

const Calendrier = ({ appointments }) => {
    const [events, setEvents] = useState([]);

    const calendar = useCallback(() => {
        const modifiedAppointments = appointments.map(appointment => ({
            title: `<span class="text-${appointment.status_color}">
                        ${String(appointment.status_label).replace(/\b\w/g, char => char.toUpperCase())}</span><br>
                        <b>${appointment.patient_name}</b> : ${appointment.reason1}`,
            start: new Date(appointment.datetime),
            end: new Date(appointment.end_datetime)
        }));

        setEvents([...modifiedAppointments]);
    }, [appointments]);

    useEffect(() => {
        console.log(appointments)
        calendar();
    }, []);

    return (
        <div style={{ height: "500px" }}>
            <Calendar
                components={{event: CustomEvent}}
                views={['agenda', 'month']}
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

export default Calendrier;