import React from 'react';

const Blog = ({data}) => {
    const widgetStyle = {
        border: '1px solid #80808054',
        borderRadius: '20px'
    };

    return (
        <>
            <div className="col-12 col-lg-4 col-sm-6">
                <div className="widget-stat" style={widgetStyle}>
                    <div className="card-body p-4">
                        <div className="media ai-icon">
                            <span className="me-3 bgl-warning text-warning">
                                <svg id="icon-revenue" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </span>
                            <div className="media-body">
                                <p className="mb-1">Total chiffre d'affaire</p>
                                <h4 className="mb-0">{data ? data.total_ca : '---'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-sm-6">
                <div className="widget-stat" style={widgetStyle}>
                    <div className="card-body p-4">
                        <div className="media ai-icon">
                            <span className="me-3 bgl-warning text-warning">
                                <svg id="icon-revenue" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </span>
                            <div className="media-body">
                                <p className="mb-1">Chiffre d'affaire médicaments</p>
                                <h4 className="mb-0">{data ? data.medicines_total_ca : '---'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-sm-6">
                <div className="widget-stat" style={widgetStyle}>
                    <div className="card-body p-4">
                        <div className="media ai-icon">
                            <span className="me-3 bgl-warning text-warning">
                                <svg id="icon-revenue" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </span>
                            <div className="media-body">
                                <p className="mb-1">Chiffre d'affaire actes médicaux</p>
                                <h4 className="mb-0">{data ? data.vproducts_total_ca : '---'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-sm-6">
                <div className="widget-stat" style={widgetStyle}>
                    <div className="card-body p-4">
                        <div className="media ai-icon">
                            <span className="me-3 bgl-warning text-warning">
                                <svg id="icon-revenue" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </span>
                            <div className="media-body">
                                <p className="mb-1">Ratio médicaments / actes médicaux</p>
                                <h4 className="mb-0">{data ? data.ratio : '---'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default Blog;