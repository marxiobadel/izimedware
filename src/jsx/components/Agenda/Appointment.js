import { ToastContainer } from "react-toastify";
import ShowAppointment from "./ShowAppointment";
import MakeAppointment from "./MakeAppointment";

const Appointment = () => {
    return (
        <>
            <ToastContainer />
            <MakeAppointment />
            <ShowAppointment />
        </>
    );
};

export default Appointment;
