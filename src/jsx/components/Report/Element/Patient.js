import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../../services/AxiosInstance';
import { ColumnFilter, handleSort } from '../../../constant/theme';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { Col, Row } from 'react-bootstrap';

const Patient = () => {
    const [medical, setMedical] = useState([]);

    const columns = useMemo(() => [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'patient_reference',
            Filter: ColumnFilter,
        },
        {
            Header: 'Nom du patient',
            Footer: 'Nom du patient',
            accessor: 'patient_shortname',
            Filter: ColumnFilter,
        },
        {
            Header: 'Dernier acte médical',
            Footer: 'Dernier acte médical',
            accessor: 'act_reference',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'aucun' ? 'text-warning' : ''}>{value}</span>
            ),
        },
        {
            Header: 'Date du dernier acte',
            Footer: 'Date du dernier acte',
            accessor: 'act_date',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'aucune' ? 'text-warning' : ''}>{value}</span>
            ),
        },
    ], []);

    const tableInstance = useTable({
        columns,
        data: medical,
        initialState: { pageIndex: 0 }
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        page,
        gotoPage,
        pageCount,
        pageOptions,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage
    } = tableInstance;

    const { pageIndex } = state;

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`reports/patients`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setMedical([...data.last_medical_act])
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
        <Row>
            <Col lg="12">
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table {...getTableProps()} className="table dataTable display">
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()} className="align-top">
                                                    <span onClick={() => handleSort(column)}
                                                        style={{ cursor: column.canSort ? 'pointer' : 'default' }}>
                                                        {column.render('Header')}
                                                        {column.canSort && (
                                                            <span className="ml-1">
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ?
                                                                        <i className="fa fa-arrow-down ms-2 fs-14" style={{ opacity: '0.7' }} />
                                                                        :
                                                                        <i className="fa fa-arrow-up ms-2 fs-14" style={{ opacity: '0.7' }} />
                                                                )
                                                                    :
                                                                    (<i className="fa fa-sort ms-2 fs-14" style={{ opacity: '0.3' }} />)
                                                                }
                                                            </span>
                                                        )}
                                                    </span>
                                                    {column.canFilter ? column.render('Filter') : null}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()} className="">
                                    {
                                        page.map((row) => {
                                            prepareRow(row)
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => {
                                                        return <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
                                                    })}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between">
                                {pageOptions.length > 0 &&
                                    <span>
                                        Page{' '}
                                        <strong>
                                            {pageIndex + 1} à {pageOptions.length}
                                        </strong>{''}
                                    </span>
                                }
                                <span className="table-index">
                                    Allez à la page : {' '}
                                    <input type="number"
                                        className="ml-2"
                                        defaultValue={pageIndex + 1}
                                        onChange={e => {
                                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                            gotoPage(pageNumber)
                                        }}
                                    />
                                </span>
                            </div>
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
            </Col>
        </Row>);
}

export default Patient;