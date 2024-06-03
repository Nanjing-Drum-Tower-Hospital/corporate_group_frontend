import VueRouter from 'vue-router'
import Login from "@/views/Login.vue";

import MainPage from "@/views/MainPage.vue";
import ItemInformationMaintenance from "@/views/ItemInformationMaintenance.vue";
import InboundManagement from "@/views/InboundManagement.vue";
import OutboundManagement from "@/views/OutboundManagement.vue";
import InventoryManagement from "@/views/InventoryManagement.vue";
import SupplierInformationManagement from "@/views/SupplierInformationManagement.vue";
import ManufacturerInformationManagement from "@/views/ManufacturerInformationManagement.vue";



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
                    name: 'itemInformationMaintenance',
                    path: '/itemInformationMaintenance',
                    component: ItemInformationMaintenance,
                },
                {
                    name: 'inboundManagement',
                    path: '/inboundManagement',
                    component: InboundManagement,
                },
                {
                    name: 'outboundManagement',
                    path: '/outboundManagement',
                    component: OutboundManagement,
                },
                {
                    name: 'inventoryManagement',
                    path: '/inventoryManagement',
                    component: InventoryManagement,
                },
                {
                    name: 'supplierInformationManagement',
                    path: '/supplierInformationManagement',
                    component: SupplierInformationManagement,
                },
                {
                    name: 'manufacturerInformationManagement',
                    path: '/manufacturerInformationManagement',

                    component: ManufacturerInformationManagement,
                },



            ]

        },


    ]
})
