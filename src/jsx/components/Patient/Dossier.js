import React, { useState, useEffect, useMemo } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import axiosInstance from '../../../services/AxiosInstance';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { ColumnFilter, handleSort, notifyError, notifySuccess } from '../../constant/theme';
import DossierModal from './modal/DossierModal';
import { Link } from 'react-router-dom';

const Dossier = ({patient_id, change, onChange}) => {
    const [dossiers, setDossiers] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const columns = useMemo(() => [
        {
            Header : 'ID',
            Footer : 'ID',
            accessor: 'reference',
            Filter: ColumnFilter,
        },
        {
            Header : 'Maladie',
            Footer : 'Maladie',
            accessor: 'desease_label',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'non définie' ? 'text-warning' : ''}>{value}</span>
            ),
        },
        {
            Header : 'Tension artérielle',
            Footer : 'Tension artérielle',
            accessor: 'blood_pressure',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'non définie' ? 'text-warning' : ''}>{value}</span>
            ),
        },
        {
            Header : 'Poids',
            Footer : 'Poids',
            accessor: 'weight_label',
            Filter: ColumnFilter,
            Cell: ({ value }) => (
                <span className={value === 'non défini' ? 'text-warning' : ''}>{value}</span>
            ),
        },
        {
            Header : 'Statut',
            Footer : 'Statut',
            accessor: 'status',
            disableFilters: true,
            disableSortBy: true,
            Cell: ({ value, row }) => (
                <div className="text-center">
                    <Button type="button" disabled={false}
                        onClick={() => handleChangeStatus(row.original)} className="btn-xs" 
                        variant={value ? "success btn-rounded" : "warning btn-rounded"}>
                        {value ? "ouvert" : "fermé"}
                    </Button>
                </div>
            ),
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
                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                        <Dropdown.Item onClick={() => handleEdit(row.original)}>Modifier</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(row.original)}>Supprimer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        }
    ], []);

    const [editingDossier, setEditingDossier] = useState(null);

    const [openModal, setOpenModal] = useState(false);
   
    const [loading, setLoading] = useState(true);

	const tableInstance = useTable({
		columns,
		data: dossiers,	
		initialState: {pageIndex: 0}
	}, useFilters, useGlobalFilter, useSortBy, usePagination);

    const handleEdit = (dossier) => {
        setEditingDossier(dossier);
        setOpenModal(true);
    };

    const handleChangeStatus = (dossier) => {
        axiosInstance.patch(`dossiers/${dossier.id}/status`)
            .then(({data}) => {
                const status = data.data.status;
                setDossiers((prevState) => prevState.map((state) => (state.id === dossier.id ? {...state, status} : state)));

                if (status) {
                    notifySuccess('Le dossier a été ouvert avec succès');
                } else {
                    notifySuccess('Le dossier a été fermé avec succès');
                }

                onChange(!change);
            })
            .catch(error => {
                console.log(error)
            })
    };

    const handleDelete = (dossier) => {
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
                axiosInstance.delete(`dossiers/${dossier.id}`)
                    .then(({data}) => {
                        setDossiers((prevState) => prevState.filter((state) => state.id !== dossier.id));

                        notifySuccess(data.message);
                        onChange(!change);
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

    const handleAdd = () => {
        setEditingDossier(null);
        setOpenModal(true); 
    }

    const handleAddOrEditDossier = (dossier, type) => {
        if (type === 'edit') {
            setDossiers((prevState) =>
                prevState.map(state => (state.id === dossier.id ? {...state, ...dossier} : state))
            );
        } else {
            setDossiers((prevState) => [dossier, ...prevState]);
        }

        setOpenModal(false);
        onChange(!change);
    };
 
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

    const {pageIndex} = state;

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`patients/${patient_id}/dossiers`, {signal: controller.signal})
                .then(function({data}) {
                    setDossiers([...data.dossiers]);
                    setDoctors([...data.doctors]);
                })
                .catch(function(error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                }).finally(function() {
                    setLoading(false);
                });     
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <Row>
				<Col lg="12">
                    <div className="card">
                        <div className="card-body">	
                            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                                <div className="me-auto">
                                    <h2 className="text-black font-w600">Dossiers</h2>
                                    <p className="mb-0">Liste des Dossiers</p>
                                </div>
                                <div>
                                    <Link to={"#"} className="btn btn-primary me-3" onClick={handleAdd}>+ Nouveau dossier</Link>
                                </div>
                            </div>
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
                                        {loading ?
                                            <tr style={{textAlign: 'center'}}>
                                                <td colSpan={columns.length}>En cours de chargement...</td>
                                            </tr> 
                                        :
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
                                <div className="d-flex justify-content-between">
                                    { pageOptions.length > 0 && 
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
                                            onChange = {e => { 
                                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0 
                                                gotoPage(pageNumber)
                                            } } 
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
            </Row>
            <DossierModal 
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAddOrEditDossier}
                dossier={editingDossier}
                patient_id={patient_id}
                doctors={doctors}
            />
        </>
    );
};

export default Dossier;