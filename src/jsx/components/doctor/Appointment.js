import React, { useState, useMemo } from 'react';
import { Badge, Col, Dropdown, Row } from 'react-bootstrap';
import axiosInstance from '../../../services/AxiosInstance';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { ColumnFilter, handleSort, notifyError, notifySuccess } from '../../constant/theme';
import ValidateModal from '../Appointment/modal/ValidateModal';

const Appointment = ({appointments, setAppointments}) => {
    const columns = useMemo(() => [
        {
            Header : 'ID',
            Footer : 'ID',
            accessor: 'id',
            Filter: ColumnFilter,
        },
        {
            Header : 'Date',
            Footer : 'Date',
            accessor: 'format_datetime',
            Filter: ColumnFilter,
        },
        {
            Header : 'Patient',
            Footer : 'Patient',
            accessor: 'patient_name',
            Filter: ColumnFilter,
        },
        {
            Header : 'Statut',
            Footer : 'Statut',
            accessor: 'status_label',
            Filter: ColumnFilter,
            Cell: ({ value, row }) => (
                <div className="bootstrap-badge text-center">
					<Badge bg="" className={`badge-rounded badge-outline-${row.original.status_color}`}>{value}</Badge>
				</div>
            ),
        },
        {
            Header : 'Raison',
            Footer : 'Raison',
            accessor: 'reason1',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <div className="text-container">{value}</div>
            ),
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
                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                        <Dropdown.Item onClick={() => handleValidation(row.original)}>Valider</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(row.original)}>Supprimer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        }
    ], []);

    const [openModal, setOpenModal] = useState(false);
    const [appointment, setAppointment] = useState(null);

	const tableInstance = useTable({
		columns,
		data: appointments,	
		initialState: {pageIndex: 0}
	}, useFilters, useGlobalFilter, useSortBy, usePagination);

    const handleDelete = (appointment) => {
        Swal.fire({
            title:'Etes-vous sûr ?',
            text: "Après suppression, vous ne pourrez pas récupérer la donnée supprimée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dd6b55',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Ok, supprimé !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`appointments/${appointment.id}`)
                    .then(({data}) => {
                        setAppointments(prevState => prevState.filter(state => state.id !== appointment.id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            notifyError('Désolé ! Cette donnée ne peut être supprimée.');
                        } else {
                            console.log(error);
                        }
                    })
            }
        })
    };

    const handleValidate = (appointment) => {
        setAppointments((prevState) =>
            prevState.map(state => (state.id === appointment.id ? {...state, ...appointment} : state))
        );

        setOpenModal(false);
    }

    const handleValidation = (appointment) => {
        setAppointment(appointment);

        setOpenModal(true);
    }

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

    return (
        <>
            <ToastContainer />
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
                                                                            <i className="fa fa-arrow-down ms-2 fs-14"  style={{opacity: '0.7'}} />
                                                                                :  
                                                                            <i className="fa fa-arrow-up ms-2 fs-14" style={{opacity: '0.7'}} /> 
                                                                        ) 
                                                                            : 
                                                                        (<i className="fa fa-sort ms-2 fs-14"  style={{opacity: '0.3'}} />) 
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
                                                return(
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
                                <div className="text-center">	
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
            <ValidateModal
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleValidate}
                appointment={appointment}
            />
        </>
    );
};

export default Appointment;