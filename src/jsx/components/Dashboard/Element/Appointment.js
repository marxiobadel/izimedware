import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import {Link} from 'react-router-dom';
import axiosInstance from '../../../../services/AxiosInstance';
import {format} from 'date-fns';
import Select from 'react-select';
import AppointmentModal from '../modal/AppointmentModal';
import {notifySuccess} from '../../../constant/theme';

const selectStyles = {
    control: (provided) => ({
        ...provided,
        width: "220px", 
    }),
};

const Appointment = ({locale, doctors, patients, currentUser, dossier = null, save = () => {}}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [slots, setSlots] = useState([]);

    const handleSave = (appointment) => {
        setOpenModal(false);
        notifySuccess(`Rendez-vous sauvegardé avec succès. Merci de patientez...`);

        save(appointment);
    }

    const handleOpen = (slot) => {
        setSelectedSlot({...slot});
        setOpenModal(true);
    }

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            const date = format(selectedDate, 'yyyy-MM-dd');
            const doctor_id = selectedDoctor ? selectedDoctor.id : null;

            axiosInstance.get(`dashboard/appointment?date=${date}&doctor_id=${doctor_id}`, 
                {signal: controller.signal})
                .then(function({data}) {
                    setSlots(data);
                    console.log(data)
                })
                .catch(function(error) {
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
    }, [selectedDate, selectedDoctor]);

    return (
        <>
            <div className="card appointment-schedule" style={dossier === null ? {} : { border: '1px solid rgba(0, 0, 0, 0.18)', borderRadius: '20px'}}>
                <div className="card-header pb-0 border-0">
                    <h3 className="fs-20 text-black mb-0">Calendrier des rendez-vous</h3>
                    <Select options={doctors} 
                        styles={selectStyles}
                        placeholder='Choisir un médecin'
                        isSearchable
                        isClearable
                        value={selectedDoctor}
                        onChange={setSelectedDoctor} 
                        getOptionValue={d => d.id}
                        getOptionLabel={d => d.fullname}
                    />
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-xl-6 col-xxl-12 col-md-6">
                            <div className="appointment-calender dz-calender style-1">
                                <DatePicker selected={selectedDate} className="form-control"
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                    inline
                                    locale={locale}
                                />
                            </div>
                        </div>
                        <div className="col-xl-6 col-xxl-12  col-md-6 height415 dz-scroll" id="appointment-schedule">
                            {slots.length > 0 ?
                            slots.map((item, index) => (
                                <div className="d-flex pb-3 border-bottom mb-3 align-items-end" key={index}>
                                    <div className="me-auto">
                                        <p className="text-black font-w600 mb-2"></p>
                                        <ul>
                                            <li><i className="las la-clock"></i>{item.format_start_time} - {item.format_end_time}</li>
                                            {!selectedDoctor &&
                                            <li><i className="las la-user"></i>{item.doctor_name}</li>}
                                            <li className={`text-${item.status_color}`}>
                                                {item.status === "free" ?
                                                    <i className="las la-plus-circle"></i> : 
                                                    (item.status === "busy" ? <i className="las la-minus-circle"></i> : <i className="las la-ban"></i>)
                                                }
                                                {item.status_label}
                                            </li>
                                        </ul>
                                    </div>
                                    {item.status === 'free' ?
                                        <Link to={"#"} onClick={() => handleOpen(item)} className="text-success me-3 mb-2">
                                            <i className="las la-check-circle scale5" />
                                        </Link>
                                        :
                                        <Link to={"#"} className="text-warning me-3 mb-2">
                                            <i className="las la-lock scale5"></i>
                                        </Link>
                                    }
                                </div>
                            ))
                            :
                                <div className="d-flex justify-content-center align-items-center">
                                    Aucun créneau horaire de disponible.
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
            <AppointmentModal 
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleSave}
                slot={selectedSlot}
                patients={patients}
                currentUser={currentUser}
                dossier={dossier}
            />
        </>
    )
}

export default Appointment;