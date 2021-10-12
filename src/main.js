import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import axios from "axios";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
  created() {
    // Prevent blank screen in Electron builds
    this.$router.push("/");
  },
}).$mount("#app");
