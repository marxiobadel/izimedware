import { useEffect, useState } from "react";

const Appointment = ({data}) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        setAppointments([...data]);

        console.log(appointments);
    }, []);

    return (
        <>
        </>
    );
}

export default Appointment;