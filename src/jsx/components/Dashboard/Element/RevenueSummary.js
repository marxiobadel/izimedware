import { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/AxiosInstance';
import { Dropdown } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { getLastFiveYears } from '../../../constant/theme';

const RevenueSummary = () => {
    const [medicinesSales, setMedicinesSales] = useState([]);
    const [vproductsSales, setVproductsSales] = useState([]);

    const series = [
        {
            name: 'Médicaments',
            data: medicinesSales.map(medicine => medicine.total),
        },
        {
            name: 'Actes médicaux',
            data: vproductsSales.map(vproduct => vproduct.total),
        },
    ];

    const options = {
        chart: {
            type: "bar",
            height: 370,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "75%",
            },
        },
        colors: ['#007A64', '#BDA25C'],
        dataLabels: {
            enabled: false,
        },
        markers: {
            shape: "circle",
        },
        legend: {
            show: true,
            fontSize: '12px',
            offsetY: 8,
            labels: {
                colors: '#000000',
            },
            markers: {
                width: 18,
                height: 18,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 0,
            }
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent']
        },
        grid: {
            borderColor: '#eee',
        },
        xaxis: {
            categories: medicinesSales.map(medicine => medicine.month),
            labels: {
                style: {
                    colors: '#787878',
                    fontSize: '13px',
                    fontFamily: 'poppins',
                    fontWeight: 100,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            crosshairs: {
                show: false,
            }
        },
        yaxis: {
            labels: {
                offsetX: -16,
                style: {
                    colors: '#787878',
                    fontSize: '13px',
                    fontFamily: 'poppins',
                    fontWeight: 100,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
        },
    };

    const [selectYear, setSelectYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dashboard/revenue-summary?year=${selectYear}`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setMedicinesSales([...data.medicines_sales]);
                    setVproductsSales([...data.vproducts_sales]);
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
    }, [selectYear]);

    return (
        <div className="card">
            <div className="card-header border-0 pb-0">
                <h3 className="fs-20 text-black mb-0 me-2">Résumé des revenus</h3>
                <Dropdown className="dropdown mt-sm-0 mt-3">
                    <Dropdown.Toggle type="button" as="div" className="btn bg-light text-primary">
                        {selectYear}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                        {getLastFiveYears().map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => setSelectYear(item)}>{item}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="card-body pt-0">
                <div id="chartBar">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={370}
                    />
                </div>
            </div>
        </div>
    )
}

export default RevenueSummary;