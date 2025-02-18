import React, { useEffect, useState } from 'react';
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "moment/locale/fr";
import axiosInstance from '../../../../services/AxiosInstance';
import { rangesPicker } from '../../../constant/theme';
import Blog from './Blog';

const Earning = () => {
    const [data, setData] = useState({});
    const [dates, setDates] = useState({
        start: moment().startOf("year"),
        end: moment().endOf("year"),
    });

    const handleCallback = (start, end, label) => {
        setDates({ start, end });
    }

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            const startDate = dates.start.format("YYYY-MM-DD");
            const endDate = dates.end.format("YYYY-MM-DD");

            axiosInstance.get(`reports/earning?start_date=${startDate}&end_date=${endDate}`, 
                { signal: controller.signal, headers: {"Content-Type": "application/json"} })
                .then(function ({ data }) {
                    setData({...data})
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
    }, [dates]);

    return (
        <>
            <div className="row">
                <div className="col-12 col-sm-8 col-md-4">
                    <div className="rangeDatePicker">
                        <DateRangePicker
                            onCallback={handleCallback}
                            initialSettings={{
                                startDate: dates.start,
                                endDate: dates.end,
                                ranges: rangesPicker,
                                locale: {
                                    format: "DD/MM/YYYY",
                                    customRangeLabel: "Personnalisé",
                                    cancelLabel: "Annuler",
                                    applyLabel: "Appliquer",
                                }
                            }}
                        >
                            <input type="text" readOnly className="form-control input-daterange-timepicker" />
                        </DateRangePicker>
                    </div>
                </div>
            </div>
            <div className="row mt-4 g-3">
                <Blog data={data}/>
            </div>
        </>);
}

export default Earning;