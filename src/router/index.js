import VueRouter from 'vue-router'
import Login from "@/views/Login.vue";

import MainPage from "@/views/MainPage.vue";
import ItemInformationMaintenance from "@/views/inboundAndOutboundManagement/ItemInformationMaintenance.vue";
import InboundManagement from "@/views/inboundAndOutboundManagement/InboundManagement.vue";
import OutboundManagement from "@/views/inboundAndOutboundManagement/OutboundManagement.vue";
import CheckOutManagement from "@/views/inboundAndOutboundManagement/CheckOutManagement.vue";
import StatementManagement from "@/views/inboundAndOutboundManagement/StatementManagement.vue";
import SupplierInformationMaintenance from "@/views/inboundAndOutboundManagement/SupplierInformationMaintenance.vue";
import ManufacturerInformationMaintenance
    from "@/views/inboundAndOutboundManagement/ManufacturerInformationMaintenance.vue";
import CustomerInformationAndPurchaseRecordMaintenance
    from "@/views/salesManagement/CustomerInformationAndPurchaseRecordMaintenance.vue";



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
                    name: 'SupplierInformationMaintenance',
                    path: '/supplierInformationMaintenance',
                    component: SupplierInformationMaintenance,
                },
                {
                    name: 'ManufacturerInformationMaintenance',
                    path: '/manufacturerInformationMaintenance',
                    component: ManufacturerInformationMaintenance,
                },
                {
                    name: 'StatementManagement',
                    path: '/statementManagement',
                    component: StatementManagement,
                },

                {
                    name: 'CustomerInformationAndPurchaseRecordMaintenance',
                    path: '/customerInformationAndPurchaseRecordMaintenance',
                    component: CustomerInformationAndPurchaseRecordMaintenance,
                },


            ]

        },


    ]
})
