import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../../services/AxiosInstance';
import { Tab, Nav } from 'react-bootstrap';
import PatientTab from '../Element/PatientTab';
import { ColumnFilter } from '../../../constant/theme';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

const Hospitalisation = () => {
    const [donnee, setDonnee] = useState(null);

    const [admissions, setAdmissions] = useState([]);

    const [loading, setLoading] = useState(true);

    const columns = useMemo(() => [
        {
            Header: "Patient",
            Footer: "Patient",
            accessor: 'patient_name',
            Filter: ColumnFilter,
        },
        {
            Header: "Date d'admission",
            Footer: "Date d'admission",
            accessor: 'format_entry_date',
            Filter: ColumnFilter,
        },
        {
            Header: "Chambre",
            Footer: "Chambre",
            accessor: 'room_number',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'aucune' ? 'text-warning' : ''}>{value}</span>
            ),
        },
        {
            Header : "Lit",
            Footer : "Lit",
            accessor: 'bed_number',
            Filter: ColumnFilter,
        }
    ], []);

    const tableInstance = useTable({
        columns,
        data: admissions,
        initialState: { pageIndex: 0 }
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        pageCount,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage
    } = tableInstance;

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`dashboard/admission`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setDonnee(data);
                    setAdmissions(data.admissions);
                    console.log(data);
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                })
                .finally(function () {
                    setLoading(false);
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <div className="col-xl-12">
                <div className="card">
                    <Tab.Container defaultActiveKey="Daily">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                            <div className="me-auto pe-3">
                                <h4 className="text-black fs-20 mb-0">Hospitalisations</h4>
                            </div>
                            <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
                                <Nav as="ul" className="nav nav-tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="Daily">Ce jour</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Weekly">Cette semaine</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Monthly">Ce mois</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </div>
                        <div className="card-body">
                            <Tab.Content>
                                <Tab.Pane eventKey="Daily">
                                    <PatientTab
                                        totalpatient={donnee ? donnee.patients_day_count : 0}
                                        patients={donnee ? donnee.patients_day : []}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Weekly">
                                    <PatientTab
                                        totalpatient={donnee ? donnee.patients_week_count : 0}
                                        patients={donnee ? donnee.patients_week : []}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Monthly">
                                    <PatientTab
                                        totalpatient={donnee ? donnee.patients_month_count : 0}
                                        patients={donnee ? donnee.patients_month : []}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-body pb-2">
                        <div className="form-head align-items-center d-flex">
                            <div className="me-auto pe-3">
                                <h4 className="text-black fs-20 mb-0">Hospitalisations en cours</h4>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table {...getTableProps()} className="table dataTable display">
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()} className="align-top">
                                                    <span>{column.render('Header')}</span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()} className="">
                                    {loading ?
                                        <tr style={{ textAlign: 'center' }}>
                                            <td colSpan={columns.length}>En cours de chargement...</td>
                                        </tr>
                                        :
                                        (page.length > 0 ?
                                            page.map((row) => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map((cell) => {
                                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                        })}
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan={columns.length} className="text-center">
                                                    Aucune donnée de disponible
                                                </td>            
                                            </tr>)
                                    }
                                </tbody>
                            </table>
                            <div className="text-center mb-3">
                                <div className="filter-pagination  mt-3">
                                    <button className="previous-button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                        <i className='fa-solid fa-angle-left' />
                                    </button>
                                    <button className="previous-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
                                        Précédent
                                    </button>
                                    <button className="next-button" onClick={() => nextPage()} disabled={!canNextPage}>
                                        Suivant
                                    </button>
                                    <button className="next-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                        <i className='fa-solid fa-angle-right' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hospitalisation;