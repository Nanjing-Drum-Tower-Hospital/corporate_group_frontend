import VueRouter from 'vue-router'
import Login from "@/views/Login.vue";

import MainPage from "@/views/MainPage.vue";
import ItemInformationMaintenance from "@/views/ItemInformationMaintenance.vue";
import InboundManagement from "@/views/InboundManagement.vue";
import OutboundManagement from "@/views/OutboundManagement.vue";
import InventoryManagement from "@/views/InventoryManagement.vue";



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
                    // redirect: "/main",
                    component: ItemInformationMaintenance,
                },
                {
                    name: 'inboundManagement',
                    path: '/inboundManagement',
                    // redirect: "/main",
                    component: InboundManagement,
                },
                {
                    name: 'outboundManagement',
                    path: '/outboundManagement',
                    // redirect: "/main",
                    component: OutboundManagement,
                },
                {
                    name: 'inventoryManagement',
                    path: '/inventoryManagement',
                    // redirect: "/main",
                    component: InventoryManagement,
                },



            ]

        },


    ]
})
