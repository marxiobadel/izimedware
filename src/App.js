import { lazy, Suspense, useEffect } from 'react';

import Index from "./jsx";
import { connect, useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { checkAutoLogin } from './services/AuthService';

import { isAuthenticated } from './store/selectors/AuthSelectors';

import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import '../node_modules/filepond/dist/filepond.min.css';
import '../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import "./css/style.css";

const Login = lazy(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
    });
});

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

function App(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        checkAutoLogin(dispatch, navigate);
    }, []);

    let routeblog = (
        <Routes>
            <Route path='/login' element={<Login title="Connexion" />} />
        </Routes>
    );
    if (props.isAuthenticated) {
        return (
            <>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    <Index />
                </Suspense>
            </>
        );
    } else {
        return (
            <div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    {routeblog}
                </Suspense>
            </div>
        );
    }
};


const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));

