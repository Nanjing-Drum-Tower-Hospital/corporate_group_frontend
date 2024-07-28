import VueRouter from 'vue-router'
import Login from "@/views/Login.vue";

import MainPage from "@/views/MainPage.vue";
import ItemInformationMaintenance from "@/views/ItemInformationMaintenance.vue";
import InboundManagement from "@/views/InboundManagement.vue";
import OutboundManagement from "@/views/OutboundManagement.vue";
import InventoryManagement from "@/views/InventoryManagement.vue";
import SupplierInformationManagement from "@/views/SupplierInformationManagement.vue";
import ManufacturerInformationManagement from "@/views/ManufacturerInformationManagement.vue";
import CheckOutManagement from "@/views/CheckOutManagement.vue";



export default new VueRouter({
    // mode: 'history',

    routes: [
        {
            name: 'login',
            path: '/login',
            // redirect: "/main",
            component: Login,

            children: [



            ]

        },
        {
            name: 'mainPage',
            path: '/',
            // redirect: "/main",
            component: MainPage,

            children: [
                {
                    name: 'ItemInformationMaintenance',
                    path: '/itemInformationMaintenance',
                    component: ItemInformationMaintenance,
                },
                {
                    name: 'InboundManagement',
                    path: '/inboundManagement',
                    component: InboundManagement,
                },
                {
                    name: 'OutboundManagement',
                    path: '/outboundManagement',
                    component: OutboundManagement,
                },
                {
                    name: 'CheckOutManagement',
                    path: '/checkOutManagement',
                    component: CheckOutManagement,
                },
                {
                    name: 'InventoryManagement',
                    path: '/inventoryManagement',
                    component: InventoryManagement,
                },
                {
                    name: 'SupplierInformationManagement',
                    path: '/supplierInformationManagement',
                    component: SupplierInformationManagement,
                },
                {
                    name: 'ManufacturerInformationManagement',
                    path: '/manufacturerInformationManagement',
                    component: ManufacturerInformationManagement,
                },



            ]

        },


    ]
})
