import { isCassier, isMedecin, isPatient, isSuperAdmin } from "../../constant/theme";

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
            }
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