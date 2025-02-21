import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useDocumentTitle } from '../../hooks/useTitle';
import Unity from './Unity';
import Invoice from './Invoice';
import Patient from './Patient';
import Doctor from './Doctor';

const General = () => {
    const title = 'Paramètres généraux';

    useDocumentTitle(title);

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Général</h2>
                    <p className="mb-0">{title}</p>
                </div>
            </div>
            <ToastContainer />
            <div className="row">
                <div className="col-xl-4 col-lg-6">
                    <div className="row">
                        <div className="col-sm-12"><Unity /></div>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-6">
                    <div className="row">
                        <div className="col-sm-12"><Invoice /></div>
                        <div className="col-sm-12"><Patient /></div>
                        <div className="col-sm-12"><Doctor /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default General;