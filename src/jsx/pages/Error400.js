import React from "react";
import { Link } from "react-router-dom";

const Error400 = () => {
   return (
      <div className="authincation h-100">
         <div className="container ">
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-6">                  
                  <div className="form-input-content text-center error-page">
                     <h1 className="error-text font-weight-bold">400</h1>
                     <h4><i className="fa fa-thumbs-down text-danger"/> Bad Request</h4>
                     <p>Your Request resulted in an error</p>
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

export default Error400;
