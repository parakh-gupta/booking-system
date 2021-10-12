import Vue from "vue";
import VueRouter from "vue-router";
import SideBar from "../components/SideBar.vue";
import LoginCard from "../components/LoginCard.vue"
import SignupCard from "../components/SignupCard.vue"
import Network from "../views/Network.vue"
import User from "../views/UserPage.vue"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "Login",
    },
  },
  {
    path: "/home",
    name: "Home",
    component: SideBar,
    children: [
      {
        path: "",
        name: "Network",
        component: Network
      },
      {
        path: "/user",
        name: "User",
        component: User,
      },
    ],
  }
  ,
  {
    path: "/login",
    name: "Login",
    component: LoginCard,
  },
  {
    path: "/logout",
    name: "Logout",
    component: LoginCard,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupCard,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
