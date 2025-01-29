import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
   return (
      <div className="authincation h-100">
         <div className="container">
               <div className="row justify-content-center h-100 align-items-center">                  
                  <div className="col-md-7">
                     <div className="form-input-content text-center error-page">
                        <h1 className="error-text font-weight-bold">404</h1>
                        <h4><i className="fa fa-exclamation-triangle text-warning"></i> The page you were looking for is not found!</h4>
                        <p>You may have mistyped the address or the page may have moved.</p>
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

export default Error404;
