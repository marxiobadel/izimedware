// import { SVGICON } from "../../constant/theme";

export const MenuList = [
    {   
        title:'Tableau de bord',
        iconStyle: <i className="flaticon-381-networking" />,
        to: 'dashboard',
    },
    {
        title: 'Patients',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Liste',
                to: 'patients',                
            },
        ],
    },     
    {
        title:'Personnel médical',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'doctors',
            },
            {
                title:'Compétences',
                to: 'skills',
            }
        ]
    },
    {
        title:'Consultations',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'consultations',
            },
        ]
    },
    {
        title:'Prescriptions',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'prescriptions',
            },
        ]
    },
    {
        title:'Actes médicaux',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'medical_procedures',
            },
        ]
    },
    {
        title:'Médicaments',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'medicines',
            },
            {
                title:'Stocks',
                to: 'stocks',
            },
            {
                title:'Catégories',
                to: 'categories',
            },
            {
                title:'Formes',
                to: 'formes',
            }
        ]
    },
    {
        title:'Facturation',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'invoices',
            }
        ]
    },
    {
        title:'Départements',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'departments',
            }
        ]
    },
    {
        title:'Paramètres',
        classsChange: 'mm-collapse',
        iconStyle:<i className="flaticon-381-network" />,
        content : [
            {
                title:'Profile',
                to: 'edit-profile',
            },
            {
                title:'Général',
                to: 'general',
            },
        ]
    } 
]