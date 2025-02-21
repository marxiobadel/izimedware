const Coordonate = ({ patient }) => {
    return (
        <>
            <div className="col-lg-6">
                <div className="row">
                    <div className="col-lg-12 col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="media align-items-center">
                                    <i className="las la-map-marker text-primary fs-34 me-3"></i>
                                    <div className="media-body">
                                        <span className="d-block mb-1">Adresse</span>
                                        <p className="fs-18 mb-0 text-black">{patient.address_label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="media align-items-center">
                                    <i className="las la-calendar-check fs-30 text-primary me-3" />
                                    <div className="media-body">
                                        <span className="d-block mb-1">Date de naissance</span>
                                        <p className="fs-18 mb-0 text-black">{patient.date_of_birth}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-lg-12 col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="media align-items-center">
                                    <i className="las la-phone fs-30 text-primary me-3" />
                                    <div className="media-body">
                                        <span className="d-block mb-1">Téléphone</span>
                                        <p className="fs-18 mb-0 text-black">{patient.phone_label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="media align-items-center">
                                    <i className="las la-envelope-open fs-30 text-primary me-3" />
                                    <div className="media-body">
                                        <span className="d-block mb-1">E-mail</span>
                                        <p className="fs-18 mb-0 text-black">{patient.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Coordonate;