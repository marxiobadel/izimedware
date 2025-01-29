import React, { useState, useEffect, useMemo } from 'react';
import { Badge, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useTitle';
import axiosInstance from '../../../services/AxiosInstance';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { ColumnFilter, notifySuccess } from '../../constant/theme';
import SkillModal from './modal/SkillModal';

const Skill = () => {
    const [skills, setSkills] = useState([]);

    const columns = useMemo(() => [
        {
            Header : 'ID',
            Footer : 'ID',
            accessor: 'id',
            Filter: ColumnFilter,
        },
        {
            Header : 'Nom',
            Footer : 'Nom',
            accessor: 'name',
            Filter: ColumnFilter,
        },
        {
            Header : 'Staff médical',
            Footer : 'Staff médical',
            accessor: 'users_count',
            Cell: ({ value }) => (
                <div className="bootstrap-badge text-center">
					<Badge bg="" className='badge-rounded badge-outline-primary'>{value}</Badge>
				</div>
            ),
            Filter: ColumnFilter,
        },
        {
            Header : 'Ajoutée le',
            Footer : 'Ajoutée le',
            accessor: 'created_at',
            Filter: ColumnFilter,
        },
        {
            Header : 'Modifiée le',
            Footer : 'Modifiée le',
            accessor: 'updated_at',
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
    ], [skills]);

    const [editingSkill, setEditingSkill] = useState(null);

    const [openModal, setOpenModal] = useState(false);
   
    const [loading, setLoading] = useState(true);

	const tableInstance = useTable({
		columns,
		data: skills,	
		initialState: {pageIndex: 0}
	}, useFilters, useGlobalFilter, useSortBy, usePagination);

    const handleEdit = (skill) => {
        setEditingSkill(skill);
        setOpenModal(true);
    };

    const handleDelete = (skill) => {
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
                axiosInstance.delete(`skills/${skill.id}`)
                    .then(({data}) => {
                        setSkills((prevSkills) => prevSkills.filter((s) => s.id !== skill.id));

                        notifySuccess(data.message);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        })
    };

    const handleAdd = () => {
        setEditingSkill(null);
        setOpenModal(true); 
    }

    const handleAddOrEditSkill = (skill, type) => {
        if (type === 'edit') {
            setSkills((prevSkills) =>
                prevSkills.map((s) => (s.id === skill.id ? {...s, ...skill} : s))
            );
        } else {
            setSkills((prevSkills) => [skill, ...prevSkills]);
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

    useDocumentTitle('Compétence');

    useEffect(() => {
        (() => {
            axiosInstance.get('skills')
                .then(function({data}) {
                    setSkills([...data.skills]);
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                }).finally(function() {
                    setLoading(false);
                });     
        })();
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
                    <h2 className="text-black font-w600">Compétences</h2>
                    <p className="mb-0">Liste des compétences du staff médical</p>
                </div>
                <div>
                    <Link to={"#"} className="btn btn-primary me-3" onClick={handleAdd}>+ Nouvelle compétence</Link>
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
            <SkillModal 
                show={openModal}
                onHide={() => setOpenModal(false)}
                onSave={handleAddOrEditSkill}
                skill={editingSkill}
            />
        </>
    );
};

export default Skill;