import Vue from 'vue'
import VueRouter from 'vue-router'
import LayOut from '@/components/LayOut.vue'
import Login from '@/components/Login.vue'
import DoctorList from '@/doctor/DoctorList.vue'
import DepartmentList from '@/department/DepartmentList.vue'
import PersonalInfo from '@/user/PersonalInfo.vue'
import DoctorLayOut from '@/doctor/DoctorLayOut.vue'
import VaccineMes from '@/vaccine/VaccineMes.vue'
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
                },
                {
                    path:'department',
                    name:'department',
                    component: DepartmentList
                },
                {
                    path:'personalInfo',
                    name:'personalInfo',
                    component: PersonalInfo
                },
            ]
        },
        {
            path:'/DoctorLayout',
            name:'doctorlayout',
            component:DoctorLayOut,
            children:[
                {
                    path:'doctorlist',
                    name:'doctorlist',
                    component: DoctorList
                },
                {
                    path:'department',
                    name:'department',
                    component: DepartmentList
                },
                {
                    path:'personalInfo',
                    name:'personalInfo',
                    component: PersonalInfo
                },
                {
                    path:'vaccineMes',
                    name:'vaccineMes',
                    component: VaccineMes
                },
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