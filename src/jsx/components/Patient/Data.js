const Data = ({ latestDossier }) => {
    return (
        <div className="row align-items-center">
            <div className="col-xl-12 col-xxl-6 col-sm-6">
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#FF6E5A" />
                        </svg>{" "}
                        TA
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.blood_pressure : '---'}
                    </div>
                </div>
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#FFD439" />
                        </svg>{" "}
                        FC
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.heart_rate_label : '---'}
                    </div>
                </div>
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#5F74BF" />
                        </svg>{" "}
                        Glycémie
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.blood_sugar_level_label : '---'}
                    </div>
                </div>
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#5FBF91" />
                        </svg>{" "}
                        Température
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.temperature_label : '---'}
                    </div>
                </div>
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#5F8F91" />
                        </svg>{" "}
                        SpO₂
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.oxygen_saturation_label : '---'}
                    </div>
                </div>
                <div className="d-flex mb-3 align-items-center">
                    <span className="fs-12 col-6 p-0 text-black">
                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="19" height="19" fill="#5F0C91" />
                        </svg>{" "}
                        IMC
                    </span>
                    <div className="rounded-0 col-6 p-0 text-end">
                        {latestDossier ? latestDossier.imc : '---'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Data;