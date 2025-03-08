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

const Calendrier = ({ appointments }) => {
    const [events, setEvents] = useState([]);

    const calendar = useCallback(() => {
        const modifiedAppointments = appointments.map(appointment => ({
            title: appointment.reason1,
            start: new Date(appointment.datetime),
            end: new Date(appointment.end_datetime)
        }));

        setEvents([...modifiedAppointments]);
    }, [appointments]);

    useEffect(() => {
        calendar();
    }, []);

    return (
        <div style={{ height: "500px" }}>
            <Calendar
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
                    showMore: "Voir plus",
                    noEventsInRange: "Il n'y a aucun événement dans cet interval.",
                }}
                style={{ height: 500 }}
            />
        </div>
    );
}

export default Calendrier;