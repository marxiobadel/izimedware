import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import axiosInstance from "../../services/AxiosInstance";

const AutocompleteField = ({ initialName = "", onSelect, onAddNew }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userTyping, setUserTyping] = useState(false); 

    useEffect(() => {
        if (initialName) {
            setQuery(initialName);
        }
    }, [initialName]);

    const fetchResults = async (searchTerm) => {
        if (!searchTerm) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.get(`dashboard/search-patient?query=${searchTerm}`);
            setResults(response.data);
            setShowDropdown(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        setLoading(false);
    };

    const debouncedFetchResults = debounce(fetchResults, 600);

    useEffect(() => {
        if (userTyping) {
            debouncedFetchResults(query);
        }
        return () => debouncedFetchResults.cancel();
    }, [query, userTyping]);

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control"
                placeholder="Rechercher un patient..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setUserTyping(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 500)}
            />
            {showDropdown && (
                <ul className="list-group position-absolute w-100 mt-1 shadow bg-white" style={{ zIndex: 1051 }}>
                    {loading ? (
                        <li className="list-group-item text-muted small py-2 px-3">Chargement...</li>
                    ) : (
                    results.length > 0 ? (
                        results.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item list-group-item-action small py-2 px-3 text-dark"
                                onMouseDown={() => {
                                    setQuery(item.fullname);
                                    setShowDropdown(false);
                                    setUserTyping(false); 
                                    onSelect(item.id);
                                }}
                                style={{cursor: 'pointer'}}
                            >
                                {item.fullname}
                            </li>
                     ))
                    ) : (
                        <>
                        <li className="list-group-item small py-2 px-3 text-muted">Aucun résultat trouvé</li>
                        {query.trim() !== "" && onAddNew && (
                            <li
                                className="list-group-item list-group-item-action small py-2 px-3 text-primary"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onAddNew(query.trim());
                                    setShowDropdown(false);
                                    setUserTyping(false);
                                    setResults([]);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                ➕ Ajouter un nouveau patient : <strong>{query.trim()}</strong>
                            </li>
                        )}
                        </>
                    )
                )}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteField;
