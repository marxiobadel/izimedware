import React, { Fragment, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { Link } from 'react-router-dom';

const GlobalSearch = () => {
    const containerRef = useRef(null);

    const [result, setResult] = useState({});

    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState('');

    useEffect(() => {
        if (query.length === 0) {
            setResult({});
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);

            try {
                const { data, status } = await axiosInstance.get(`dashboard/global-search?query=${query}`);
            
                if (status === 200) {
                    setResult({...data});
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }, 1000); 

        return () => clearTimeout(delayDebounceFn); 
    }, [query]);
  
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setQuery('');  
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dashboard_bar">
            <div className="input-group search-area d-lg-inline-flex d-none">
                <input type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="form-control" placeholder="Rechercher ici..." />
                <div className="input-group-append">
                    <span className="input-group-text"><Link to={"#"}><i className="flaticon-381-search-2" /></Link></span>
                </div>
            </div>
            <div
                ref={containerRef} 
                style={{backgroundColor: 'white'}} 
                className="position-absolute list-group shadow-lg">
                <div style={{width: '300px'}} className="list-group">
                    {loading ? <div className="fs-6 list-group-item active text-center">Chargement...</div> :
                    (query.length !== 0 && Object.entries(result).length === 0 ? 
                        <div className="fs-6 list-group-item active text-center">
                            Aucun résultat
                        </div> :
                        Object.entries(result).map(([key, data], index) => (
                            <Fragment key={index}>
                                <div key={index} className="fs-6 list-group-item active fw-bold">{key}</div>
                                {data.map((item, index) => (
                                    <Link key={index} to={item.url} className="fs-6 list-group-item list-group-item-action">
                                        {item.title}
                                    </Link> 
                                ))}
                            </Fragment>)
                    ))}
                </div>
            </div>
        </div>
    );
}
export default GlobalSearch;