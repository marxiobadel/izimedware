import React, { useMemo } from 'react';
import { Col, Dropdown, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { ColumnFilter } from '../../constant/theme';
import { createPortal } from 'react-dom';

const Examen = ({ examens, show, onHide }) => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'reference',
            Filter: ColumnFilter,
        },
        {
            Header: 'Date',
            Footer: 'Date',
            accessor: 'format_date',
            Filter: ColumnFilter,
        },
        {
            Header: 'Type',
            Footer: 'Type',
            accessor: 'type.name',
            Filter: ColumnFilter,
        },
        {
            Header: 'Patient',
            Footer: 'Patient',
            accessor: 'patient_name',
            Filter: ColumnFilter,
        },
        {
            Header: 'Responsable',
            Footer: 'Responsable',
            accessor: 'doctor_name',
            Filter: ColumnFilter,
        },
        {
            Header: 'Actions',
            Footer: 'Actions',
            accessor: 'actions',
            disableFilters: true,
            disableSortBy: true,
            Cell: ({ row }) => (
                <Dropdown className="ms-auto c-pointer text-end">
                    <Dropdown.Toggle className="btn-link i-false" as="div">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                        <Dropdown.Item as={Link} to={`/examinations/${row.original.id}`}>Détail</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        }
    ], []);

    const tableInstance = useTable({
        columns,
        data: examens ?? [],
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

    return createPortal(
        <Modal className="modal fade" backdrop={true} dialogClassName="modal-xl" show={show} onHide={onHide} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Liste des examens médicaux</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body py-0">
                    <Row>
                        <Col lg="12">
                            <div className="card mb-0">
                                <div className="card-body p-0">
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
                                            <tbody {...getTableBodyProps()}>
                                                {page.length > 0 ?
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
                                                    :
                                                    <tr>
                                                        <td colSpan={columns.length} className="text-center">
                                                            Aucune donnée de disponible
                                                        </td>            
                                                    </tr>
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
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>, document.body);
};

export default Examen;