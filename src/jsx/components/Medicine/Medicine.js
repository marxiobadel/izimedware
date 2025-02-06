import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { useDocumentTitle } from '../../hooks/useTitle';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ColumnFilter, IMAGES, notifyError, notifySuccess } from '../../constant/theme';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import MedicineModal from './modal/MedicineModal';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const Medicine = () => {
    const [medicines, setMedicines] = useState([]);
    const [formes, setFormes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unities, setUnities] = useState([]);
    
    const columns = useMemo(() => [
        {
            Header : 'ID',
            Footer : 'ID',
            accessor: 'reference',
            Filter: ColumnFilter,
        },
        {
            Header : 'Image',
            Footer : 'Image',
            disableSortBy: true,
            disableFilters: true,
            Cell: ({ row }) => ( 
                <img src={row.original.cover_url ?? IMAGES.Avatar} alt={row.original.name} width="43" height="43" style={{objectFit: 'cover'}}/>
            ),
        },
        {
            Header : 'Nom',
            Footer : 'Nom',
            accessor: 'name',
            Filter: ColumnFilter,
        },
        {
            Header : 'Prix',
            Footer : 'Prix',
            accessor: 'price_with_currency', 
            Filter: ColumnFilter,
        },
        {
            Header : 'Quantité',
            Footer : 'Quantité',
            accessor: 'quantity_with_unity',
            Filter: ColumnFilter,
            Cell: ({ value, row }) => ( 
                <span className={row.original.alert_stock >= row.original.quantity ? "text-warning" : ""}>{value}</span>
            ),
        },
        {
            Header : 'Stock',
            Footer : 'Stock',
            accessor: 'available_qty_with_unity',
            Filter: ColumnFilter,
            Cell: ({ value, row }) => ( 
                <span className={row.original.alert_stock >= row.original.available_qty ? "text-warning" : ""}>{value}</span>
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
                        <Dropdown.Item onClick={() => handleEdit(row.original)}>Modifier</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(row.original)}>Supprimer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        }
    ], [medicines]);

    const [editingMedicine, setEditingMedicine] = useState(null);
    
    const [openModal, setOpenModal] = useState(false);
       
    const [loading, setLoading] = useState(true);

    const tableInstance = useTable({
        columns,
        data: medicines,	
        initialState: {pageIndex: 0}
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const handleEdit = (medicine) => {
        setEditingMedicine(medicine);
        setOpenModal(true);
    };

    const handleDelete = (medicine) => {
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
                axiosInstance.delete(`medicines/${medicine.slug}`)
                    .then(({data}) => {
                        setMedicines((prevMedicines) => prevMedicines.filter((m) => m.id !== medicine.id));

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

    const handleAdd = () => {
        setEditingMedicine(null);
        setOpenModal(true); 
    }

    const handleAddOrEditMedicine = (medicine, type) => {
        if (type === 'edit') {
            setMedicines((prevMedicines) =>
                prevMedicines.map((m) => (m.id === medicine.id ? {...m, ...medicine} : m))
            );
        } else {
            setMedicines((prevMedicines) => [medicine, ...prevMedicines]);
        }

        setOpenModal(false);
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

    useDocumentTitle('Médicaments');

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get('medicines', {signal: controller.signal})
                .then(function({data}) {
                    setMedicines([...data.medicines]);
                    setFormes([...data.formes]);
                    setCategories([...data.categories]);
                    setUnities([...data.unities]);
                })
                .catch(function(error) {
                    if (axios.isCancel(error)) {
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

    const handleSort = (column) => {
        if (column.canSort) {
            if (column.isSortedDesc) {
                column.toggleSortBy(); 
            } else if (column.isSorted) {
                column.toggleSortBy(true); 
            } else {
                column.toggleSortBy(false); 
            }
        }
    };

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Médicaments</h2>
                    <p className="mb-0">Liste des Médicaments</p>
                </div>
                <div>
                    <Link to={"#"} className="btn btn-primary me-3" onClick={handleAdd}>+ Nouveau médicament</Link>
                </div>
            </div>
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
            <MedicineModal 
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAddOrEditMedicine}
                medicine={editingMedicine}
                formes={formes}
                categories={categories}
                unities={unities}
            />
        </>
    );
};

export default Medicine;