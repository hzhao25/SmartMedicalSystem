import Vue from 'vue'
import VueRouter from 'vue-router'
import LayOut from '@/components/LayOut.vue'
import Login from '@/components/Login.vue'
import DoctorList from '@/doctor/DoctorList.vue'
Vue.use(VueRouter)

const router=new VueRouter({
    routes:[
        {
            path:'/Layout',//
            name:'layout',
            component:LayOut,
            children:[
                {
                    path:'doctorlist',
                    name:'doctorlist',
                    component: DoctorList
                }
            ]
        },
        {
            path:'/',
            name:'Login',
            component:Login
        },
    ]
})

export default router