//import {format} from 'date-fns';
import { ColumnFilter } from './ColumnFilter';



function dateFormat(value){
	let objectDate = new Date(value);
	let day = ("0" + (objectDate.getDate() + 1)).slice(-2);
	let month = ("0" + (objectDate.getMonth() + 1)).slice(-2);
	let year = objectDate.getFullYear();
	
	return  day + "/" + month + "/" + year;	 
	
}


export const COLUMNS = [
	{
		Header : 'ID',
		Footer : 'ID',
		accessor: 'id',
		Filter: ColumnFilter,
		//disableFilters: true,
	},
	{
		Header : 'Prénom',
		Footer : 'Prénom',
		accessor: 'first_name',
		Filter: ColumnFilter,
	},
	{
		Header : 'Nom de famille',
		Footer : 'Nom de famille',
		accessor: 'last_name',
		Filter: ColumnFilter,
	},
	{
		Header : 'E-mail',
		Footer : 'E-mail',
		accessor: 'email',
		Filter: ColumnFilter,
	},
	{
		Header : 'Date de naissance',
		Footer : 'Date de naissance',
		accessor: 'date_of_birth',
		Cell: ({ value }) => { return dateFormat(value) },
		Filter: ColumnFilter,
	},
	{
		Header : 'Pays',
		Footer : 'Pays',
		accessor: 'country',
		Filter: ColumnFilter,
	},
	{
		Header : 'Téléphone',
		Footer : 'Téléphone',
		accessor: 'phone',
		Filter: ColumnFilter,
	},
]

export const GROUPED_COLUMNS = [
	{
		Header : 'Id',
		Footer : 'Id',
		accessor: 'id'
	},
	{
		Header : 'Name',
		Footer : 'Name',
		columns: [
			{
				Header : 'First Name',
				Footer : 'First Name',
				accessor: 'first_name'
			},
			{
				Header : 'Last Name',
				Footer : 'Last Name',
				accessor: 'last_name'
			},
		]
	},
	{
		Header: 'Info',
		Footer: 'Info',
		columns: [
			{
				Header : 'Date of  Birth',
				Footer : 'Date of  Birth',
				accessor: 'date_of_birth'
			},
			{
				Header : 'Country',
				Footer : 'Country',
				accessor: 'country',
			},
			{
				Header : 'Phone',
				Footer : 'Phone',
				accessor: 'phone'
			},
		]
	},
]