import React, { useContext } from "react";

/// React router dom
import { Routes, Route, Outlet } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";

/// Dashboard
import Home from "./components/Dashboard/Home";
import Patient from "./components/Patient/Patient";
import PatientDetails from "./components/Patient/PatientDetails";
import Doctor from "./components/doctor/Doctor";
import DoctorDetails from "./components/doctor/DoctorDetails";
import Reviews from "./components/Dashboard/Reviews";
//Apps

import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import EditProfile from "./components/AppsMenu/AppProfile/EditProfile";
import PostDetails from "./components/AppsMenu/AppProfile/PostDetails";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Inbox from "./components/AppsMenu/Email/Inbox/Inbox";
import Read from "./components/AppsMenu/Email/Read/Read";
import Calendar from "./components/AppsMenu/Calendar/Calendar";

/// Product List
import ProductGrid from "./components/AppsMenu/Shop/ProductGrid/ProductGrid";
import ProductList from "./components/AppsMenu/Shop/ProductList/ProductList";
import ProductDetail from "./components/AppsMenu/Shop/ProductGrid/ProductDetail";
import ProductOrder from "./components/AppsMenu/Shop/ProductOrder";
import Checkout from "./components/AppsMenu/Shop/Checkout/Checkout";
import Customers from "./components/AppsMenu/Shop/Customers/Customers";

/// Charts
import SparklineChart from "./components/charts/Sparkline";
import ChartJs from "./components/charts/Chartjs";
import RechartJs from "./components/charts/rechart";
import ApexChart from "./components/charts/apexcharts";

/// Bootstrap
import UiAccordion from "./components/bootstrap/Accordion";
import UiAlert from "./components/bootstrap/Alert";
import UiBadge from "./components/bootstrap/Badge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiListGroup from "./components/bootstrap/ListGroup";
import MediaObject from "./components/bootstrap/MediaObject";
import UiCards from "./components/bootstrap/Cards";
import UiCarousel from "./components/bootstrap/Carousel";
import UiDropDown from "./components/bootstrap/DropDown";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiTab from "./components/bootstrap/Tab";
import UiPagination from "./components/bootstrap/Pagination";
import UiGrid from "./components/bootstrap/Grid";
import UiTypography from "./components/bootstrap/Typography";

/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
import MainSweetAlert from "./components/PluginsMenu/SweetAlert/SweetAlert";
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import JqvMap from "./components/PluginsMenu/JqvMap/JqvMap";
import Lightgallery from "./components/PluginsMenu/Lightgallery/Lightgallery";
// Widget
import Widget from "./pages/Widget";
// Svg Icon
import SvgIcon from "./pages/SvgIcon";
/// Table
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";
import BootstrapTable from "./components/table/BootstrapTable";
/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
import CkEditor from "./components/Forms/CkEditor/CkEditor";
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";
/// Pages
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";

import { ThemeContext } from "../context/ThemeContext";
import Category from "./components/Medicine/Category";
import Forme from "./components/Medicine/Forme";
import Medicine from "./components/Medicine/Medicine";
import Skill from "./components/doctor/Skill";
import General from "./components/setting/General";
import Stock from "./components/Medicine/Stock";
import Consultation from "./components/consultation/Consultation";
import Prescription from "./components/prescription/Prescription";
import CreatePrescription from "./components/prescription/CreatePrescription";
import MedicalProcedure from "./components/MedicalProcedure/MedicalProcedure";
import Invoice from "./components/Invoice/Invoice";
import CreateInvoice from "./components/Invoice/CreateInvoice";
import EditInvoice from "./components/Invoice/EditInvoice";
import Service from "./components/Service/Service";
import ShowInvoice from "./components/Invoice/ShowInvoice";
import EditPrescription from "./components/prescription/EditPrescription";
import Type from "./components/Morph/Type";
import Examen from "./components/Examen/Examen";
import ShowExamen from "./components/Examen/ShowExamen";
import Room from "./components/Room/Room";
import Bed from "./components/Bed/Bed";
import Admission from "./components/Admission/Admission";
import Soin from "./components/Soin/Soin";
import Leave from "./components/Leave/Leave";
import Slot from "./components/Slot/Slot";
import Appointment from "./components/Appointment/Appointment";
import Report from "./components/Report/Report";
import Planning from "./components/Planning/Planning";
import ShowPrescription from "./components/prescription/ShowPrescription";
import Insurance from "./components/Insurance/Insurance";
import Contract from "./components/Insurance/Contract";
import Antecedent from "./components/Antecedent/Antecedent";
import ShowDossier from "./components/Patient/ShowDossier";

const Markup = () => {
    const allroutes = [
        // Dashboard
        { url: "", component: <Home title='Tableau de bord' /> },
        { url: "dashboard", component: <Home title='Tableau de bord' /> },
        { url: "patients", component: <Patient /> },
        { url: "antecedents", component: <Antecedent /> },
        { url: "insurances", component: <Insurance /> },
        { url: "contracts", component: <Contract /> },
        { url: "patient-details/:id", component: <PatientDetails /> },
        { url: "dossiers/:id", component: <ShowDossier /> },
        { url: "medical_procedures", component: <MedicalProcedure /> },
        { url: "medicines", component: <Medicine /> },
        { url: "invoices", component: <Invoice /> },
        { url: "invoices/:id/edit", component: <EditInvoice /> },
        { url: "invoices/:id", component: <ShowInvoice /> },
        { url: "invoices/create", component: <CreateInvoice /> },
        { url: "skills", component: <Skill /> },
        { url: "categories", component: <Category /> },
        { url: "formes", component: <Forme /> },
        { url: "stocks", component: <Stock /> },
        { url: "doctor-details/:id", component: <DoctorDetails /> },
        { url: "reviews", component: <Reviews /> },
        { url: "doctors", component: <Doctor /> },
        { url: "general", component: <General /> },
        { url: "consultations", component: <Consultation /> },
        { url: "departments", component: <Service /> },
        { url: "prescriptions", component: <Prescription /> },
        { url: "prescriptions/create", component: <CreatePrescription /> },
        { url: "prescriptions/:id/edit", component: <EditPrescription /> },
        { url: "prescriptions/:id", component: <ShowPrescription /> },
        { url: "examinations", component: <Examen /> },
        { url: "examinations/:id", component: <ShowExamen /> },
        { url: "admissions", component: <Admission /> },
        { url: "soins", component: <Soin /> },
        { url: "rooms", component: <Room /> },
        { url: "slots", component: <Slot /> },
        { url: "beds", component: <Bed /> },
        { url: "leaves", component: <Leave /> },
        { url: "appointments", component: <Appointment /> },
        { url: "plannings", component: <Planning /> },
        { url: "reports", component: <Report /> },
        { url: "types/:status", component: <Type /> },

        //Apps
        { url: "app-profile", component: <AppProfile /> },
        { url: "edit-profile", component: <EditProfile /> },
    ];

    function NotFound() {
        const url = allroutes.map((route) => route.url);
        let path = window.location.pathname
        path = path.split('/')
        path = path[path.length - 1]
    
        if (url.indexOf(path) <= 0) {
            return <Error404 />
        }
    }

    return (
        <>
            <Routes>
                <Route path='/page-lock-screen' element={<LockScreen />} />
                <Route path='/page-error-400' element={<Error400 />} />
                <Route path='/page-error-403' element={<Error403 />} />
                <Route path='/page-error-404' element={<Error404 />} />
                <Route path='/page-error-500' element={<Error500 />} />
                <Route path='/page-error-503' element={<Error503 />} />
                <Route element={<MainLayout />} >
                    {allroutes.map((data, i) => (
                        <Route
                            key={i}
                            exact
                            path={`${data.url}`}
                            element={data.component}
                        />
                    ))}
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
            <ScrollToTop />
        </>
    );
};

function MainLayout() {
    const { menuToggle, sidebariconHover } = useContext(ThemeContext);
    return (
        <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${menuToggle ? "menu-toggle" : ""}`}>
            <Nav />
            <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>
                <div className="container-fluid">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
};
export default Markup;