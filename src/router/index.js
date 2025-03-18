import Vue from 'vue'
import VueRouter from 'vue-router'
import LayOut from '@/components/LayOut.vue'
import Login from '@/components/Login.vue'
import DoctorList from '@/doctor/DoctorList.vue'
import DepartmentList from '@/department/DepartmentList.vue'
import PersonalInfo from '@/user/PersonalInfo.vue'
import DoctorPersonalInfo from '@/doctor/DoctorPersonalInfo.vue'
import ManagerPersonalInfo from '@/manager/ManagerPersonalInfo.vue'
import DoctorLayOut from '@/doctor/DoctorLayOut.vue'
import VaccineMes from '@/vaccine/VaccineMes.vue'
import VaccineType from '@/vaccine/VaccineType.vue'
import appVaccineList from '@/vaccine/appVaccineList.vue'
import ManagerLayOut from '@/manager/ManagerLayOut.vue'
import HospitalList from '@/hospital/HostList.vue'
import PostsList from '@/posts/PostsList.vue'
import RegistrationList from '@/registration/RegistrationList.vue'
import UserRegis from '@/user/UserRegis.vue'
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
                {
                    path:'UserRegis',
                    name:'UserRegis',
                    component: UserRegis
                },
                {
                    path:'vaccineMes',
                    name:'vaccineMes',
                    component: VaccineMes
                },
                {
                    path:'vaccineType',
                    name:'vaccineType',
                    component: VaccineType
                },
                {
                    path:'appVaccineList',
                    name:'appVaccineList',
                    component: appVaccineList
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
                    path:'DoctorPersonalInfo',
                    name:'DoctorPersonalInfo',
                    component: DoctorPersonalInfo
                },
                {
                    path:'vaccineMes',
                    name:'vaccineMes',
                    component: VaccineMes
                },
                {
                    path:'vaccineType',
                    name:'vaccineType',
                    component: VaccineType
                },
                {
                    path:'appVaccineList',
                    name:'appVaccineList',
                    component: appVaccineList
                },
                {
                    path:'hospitalList',
                    component: HospitalList
                },
                {
                    path:'postsList',
                    component:PostsList
                },
                {
                    path:'registrationList',
                    component:RegistrationList
                },
            ]
        },
        {
            path:'/ManagerLayout',
            name:'ManagerLayout',
            component:ManagerLayOut,
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
                    path:'vaccineMes',
                    name:'vaccineMes',
                    component: VaccineMes
                },
                {
                    path:'vaccineType',
                    name:'vaccineType',
                    component: VaccineType
                },
                {
                    path:'appVaccineList',
                    name:'appVaccineList',
                    component: appVaccineList
                },
                {
                    path:'ManagerPersonalInfo',
                    name:'ManagerPersonalInfo',
                    component: ManagerPersonalInfo
                },
                {
                    path:'hospitalList',
                    component: HospitalList
                },
                {
                    path:'postsList',
                    component:PostsList
                },
                {
                    path:'registrationList',
                    component:RegistrationList
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