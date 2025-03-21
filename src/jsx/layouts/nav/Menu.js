import { isCassier, isMedecin, isPharmacist, isSuperAdmin } from "../../constant/theme";

export const MenuList = [
    {   
        id: 'dashboard',
        title:'Tableau de bord',
        iconStyle: <i className="flaticon-381-networking" />,
        to: 'dashboard',
        content: []
    },
    {
        id: 'patients',
        title: 'Patients',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Liste',
                to: 'patients',                 
            },
            {
                title: "Dossiers",
                to: 'dossiers',
            },
            {
                title: "Contrat d'assurance",
                to: 'contracts',
            },
            {
                title:'Assurances',
                to: 'insurances',
            },
        ],
    },  
    {
        id: 'antecedents',
        title: 'Antécédents médicaux',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Liste',
                to: 'antecedents',                 
            },
            {
                title:'Type',
                to: 'types/antecedent',
            },
        ],
    },    
    {
        id: 'doctors',
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
            },
            {
                title:'Créneaux horaires',
                to: 'slots',
            },
            {
                title:'Rendez-vous',
                to: 'appointments',
            },
            {
                title:'Planning',
                to: 'plannings',
            },
        ]
    },
    {
        id: 'consultations',
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
        id: 'examens',
        title:'Examens',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'examinations',
            },
            {
                title:'Type',
                to: 'types/exam',
            },
        ]
    },
    {
        id: 'admissions',
        title:'Hospitalisations',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'admissions',
            },
        ]
    },
    {
        id: 'prescriptions',
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
        id: "medical_procedures",
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
        id: "soins",
        title:'Soins médicaux',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'soins',
            },
            {
                title:'Type',
                to: 'types/soin',
            },
        ]
    },
    {
        id: 'medicines',
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
        id: 'invoices',
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
        id: 'rooms',
        title:'Chambres',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'rooms',
            },
            {
                title:'Type',
                to: 'types/room',
            },
        ]
    },
    {
        id: 'beds',
        title:'Lits',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'beds',
            },
        ]
    },
    {
        id: 'equipements',
        title:'Equipements',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'equipements',
            },
            {
                title:'Type',
                to: 'types/equipement',
            },
        ]
    },
    {
        id: 'departments',
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
        id: 'leaves',
        title:'Congés',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Liste',
                to: 'leaves',
            },
            {
                title:'Type',
                to: 'types/leave',
            },
        ]
    },
    {
        id: 'report',
        title:'Rapport',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Voir',
                to: 'reports',
            }
        ]
    },
    {
        id: 'config',
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
];

export const getFilteringMenuList = (roles) => {
    if (isMedecin(roles)) {
        return MenuList.filter(menu => menu.id !== 'doctors' && menu.id !== 'invoices' 
                            && menu.id !== 'medical_procedures' && menu.id !== 'departments'
                            && menu.id !== 'medicines')
                        .map(menu => ({
                            ...menu, 
                            content: menu.content.some(subMenu => subMenu.to === 'edit-profile') ? 
                                    menu.content.filter(subMenu => subMenu.to === 'edit-profile') : menu.content
                        }));
    }

    if (isCassier(roles)) {
        return MenuList.filter(menu => menu.id === 'dashboard' || menu.id === 'invoices' || menu.id === 'config')
                    .map(menu => ({
                        ...menu, 
                        content: menu.content.some(subMenu => subMenu.to === 'edit-profile') ? 
                                menu.content.filter(subMenu => subMenu.to === 'edit-profile') : menu.content
                    }));
    }

    if (isPharmacist(roles)) {
        return MenuList.filter(menu => menu.id === 'dashboard' || menu.id === 'medicines' || menu.id === 'config')
                    .map(menu => ({
                        ...menu, 
                        content: menu.content.some(subMenu => subMenu.to === 'edit-profile') ? 
                                menu.content.filter(subMenu => subMenu.to === 'edit-profile') : menu.content
                    }));
    }

    if (isSuperAdmin(roles)) {
        return MenuList;
    }

    return MenuList.filter(menu => menu.id === 'dashboard' || menu.id === 'config')
                    .map(menu => ({
                        ...menu, 
                        content: menu.content.some(subMenu => subMenu.to === 'edit-profile') ? 
                                menu.content.filter(subMenu => subMenu.to === 'edit-profile') : menu.content
                    }));
}