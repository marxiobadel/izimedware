import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

const NextAppointment = ({ nextAppointment }) => {
    const targetTime = new Date(nextAppointment.time);

    const [progress, setProgress] = useState(0);
    const [remainingTime,  setRemainingTime] = useState('00:00:00');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = new Date();
            const remainingTimeMillis = targetTime - currentTime;

            if (remainingTimeMillis <= 0) {
                setProgress(100);
                setRemainingTime('00:00:00');
                clearInterval(intervalId);
            } else {
                const totalDuration = targetTime - new Date().setHours(0, 0, 0, 0);
                const timeElapsed = totalDuration - remainingTimeMillis;

                const newProgress = Math.min((timeElapsed / totalDuration) * 100, 100);

                setProgress(newProgress);

                const hours = Math.floor(remainingTimeMillis / 1000 / 3600);
                const minutes = Math.floor((remainingTimeMillis % (1000 * 3600)) / 60000);
                const seconds = Math.floor((remainingTimeMillis % 60000) / 1000);

                setRemainingTime(
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                );
            }   
        }, 1000);

        return () => { 
            clearInterval(intervalId);
        }  
    }, [targetTime]);

    return (
        <div className="col-xl-12 col-xxl-6">
            <div className="card">
                <div className="card-body">
                    <ProgressBar now={progress} variant="primary" striped />
                    <p className="mt-2 fs-6">Prochain rendez-vous à</p>
                    <p className="mb-0 fs-2 text-primary">{nextAppointment.format_time}</p>
                    <p className="mb-0 fs-6">Temps restant : <span className="text-primary">{remainingTime}</span></p>
                </div>
            </div>
        </div>
    );
}

export default NextAppointment;