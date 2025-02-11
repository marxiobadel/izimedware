import React from "react";
import { Link } from "react-router-dom";

const Error403 = () => {
   return (
      <div className="authincation h-100">
         <div className="container">
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-6">
                  <div className="form-input-content text-center error-page">
                     <h1 className="error-text  font-weight-bold">403</h1>
                     <h4><i className="fa fa-times-circle text-danger"></i> Forbidden Error!</h4>
                     <p>You do not have permission to view this resource.</p>
                     <div>
                        <Link to={"/dashboard"} className="btn btn-primary">Back to Home</Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error403;
