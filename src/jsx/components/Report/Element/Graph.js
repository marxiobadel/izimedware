import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axiosInstance from "../../../../services/AxiosInstance";

const Graph = () => {
    const [roles, setRoles] = useState([]);
    const [colors, setColors] = useState([]);

    const options = {
        plugins: {
            legend: false,
            responsive: true,
        },
        maintainAspectRatio: false,
    };

    const data = {
        datasets: [
            {
                data: roles.map(role => role.total_users),
                borderWidth: 0,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            },
        ],
        labels: roles.map(role => role.display_name),
    };

    useEffect(() => {
        const controller = new AbortController();

        (() => {
            axiosInstance.get(`reports/users`,
                { signal: controller.signal })
                .then(function ({ data }) {
                    setRoles([...data.roles_with_user_count]);
                    setColors([...data.colors])
                    console.log(data);
                })
                .catch(function (error) {
                    if (error.name === 'CanceledError') {
                        console.log('requête annulée.');
                    } else {
                        console.log(error);
                    }
                });
        })();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <div className="row" style={{ paddingTop: '30px' }}>
            <div className="col-sm-6 col-md-4">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <h2 className="card-title">Groupe d'utilisateur</h2>
                    </div>
                    <div className="card-body pb-0">
                        <p>Récapitulatif mettant en exergue tous les utilisateurs de la plateforme.</p>
                        <ul className="list-group list-group-flush">
                            { 
                                roles.map((role, index) => (
                                    <li key={index} className="list-group-item d-flex px-0 justify-content-between">
                                        <strong>{role.display_name}</strong>
                                        <span className="mb-0">{role.total_users}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 col-md-8">
                <Pie data={data} height={200} options={options} />
            </div>
        </div>
    );
}

export default Graph;
