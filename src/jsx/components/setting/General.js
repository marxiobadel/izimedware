import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useDocumentTitle } from '../../hooks/useTitle';
import Unity from './Unity';
import Invoice from './Invoice';

const General = () => {
    useDocumentTitle('Général');

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Général</h2>
                    <p className="mb-0">Paramètres générales</p>
                </div>
            </div>
            <ToastContainer />
            <div className="row">
                <div className="col-xl-4 col-lg-6">
                    <Unity />
                </div>
                <div className="col-xl-8 col-lg-6">
                    <Invoice />
                </div>
            </div>
        </>
    )
}

export default General;