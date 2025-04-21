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
        id: 'agenda',
        title:'Agenda',
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Calendrier',
                to: 'agenda',                 
            },
            {
                title: "Créneaux horaires",
                to: 'slots',
            },
            {
                title: "Prise de rendez-vous",
                to: 'prisederendezvous',
            }
        ],
    },
    {
        id: 'patients',
        title: 'Patients',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Patients',
                to: 'patients',                 
            },
            {
                title: "Dossiers médicaux",
                to: 'dossiers',
            }
        ],
    },   
    {   
        id: 'consultations',
        title:'Consultations',
        iconStyle: <i className="flaticon-381-notepad" />,
        to: 'consultations',
        content: []
    },
    {   
        id: 'prescriptions',
        title:'Prescriptions',
        iconStyle: <i className="flaticon-381-notepad" />,
        to: 'prescriptions',
        content: []
    },
    {
        id: "medical_procedures",
        title:'Actes médicaux',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Examens',
                to: 'examinations',
            },
            {
                title:'Soins',
                to: 'soins',
            }
        ]
    },
    {
        id: "pharmacie",
        title:'Pharmacie',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Médicaments',
                to: 'medicines',
            },
            {
                title:'Stocks',
                to: 'stocks',
            },
            {
                title:'Catégorie',
                to: 'categories',
            },
            {
                title:'Formes',
                to: 'formes',
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
                title:'Hospitalisations',
                to: 'admissions',
            },
            {
                title:'Chambres',
                to: 'rooms',
            },
            {
                title:'Lits',
                to: 'beds',
            },
        ]
    },
    {
        id: 'administration',
        title:'Administration',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        content : [
            {
                title:'Personnel médical',
                to: 'doctors',
            },
            {
                title:'Départements',
                to: 'departments',
            },
            {
                title:'Congés',
                to: 'leaves',
            },
            {
                title:'Equipements',
                to: 'equipements',
            },
        ]
    },
    {
        id: 'config',
        title:'Paramètres',
        classsChange: 'mm-collapse',
        iconStyle:<i className="flaticon-381-network" />,
        to: 'general',
        content : []
    }, 
    {
        id: 'report',
        title:'Rapports',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-notepad" />,
        to: 'reports',
        content : []
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