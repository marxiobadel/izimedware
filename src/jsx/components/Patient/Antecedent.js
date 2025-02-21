import { useMemo } from "react";
import { Badge } from "react-bootstrap";
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

const Antecedent = ({ antecedents }) => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Type',
            Footer: 'Type',
            accessor: 'type.name',
        },
        {
            Header: 'Date de diagnostic',
            Footer: 'Date de diagnostic',
            accessor: 'format_date',
        },
        {
            Header: 'Statut',
            Footer: 'Statut',
            accessor: 'status_label',
            Cell: ({ value, row }) => (
                <div className="bootstrap-badge text-center">
                    <Badge bg="" className={`badge-rounded badge-outline-${row.original.status_color}`}>{value}</Badge>
                </div>
            ),
        },
        {
            Header: 'Description',
            Footer: 'Description',
            accessor: 'description',
        },
    ], []);

    const tableInstance = useTable({
        columns,
        data: antecedents,
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

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="fs-20 text-black mb-0">Antécédents médicaux</h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table {...getTableProps()} className="table dataTable display">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="align-top">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
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
    );
}

export default Antecedent;