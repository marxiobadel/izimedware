import React from 'react';

export const GlobalFilter = ({filter, setFilter}) =>{
	return(
		<div>
			Recherche : {' '}
			<input className="ml-2 input-search form-control"
				value={filter || ''}  onChange={e => setFilter(e.target.value || undefined)} style={{ width: "20%" }}
            />
		</div>
	)
} 