import React, { useMemo } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { ColumnFilter } from '../../constant/theme';
import { createPortal } from 'react-dom';

const Soin = ({ soins, show, onHide }) => {
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
            accessor: 'format_date_time',
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
    ], []);


    const tableInstance = useTable({
        columns,
        data: soins ?? [],
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
                    <h5 className="modal-title">Liste des soins médicaux</h5>
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
        </Modal>, document.body
    );
};

export default Soin;