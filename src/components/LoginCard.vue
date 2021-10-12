<template>
  <v-app>
    <v-card :loading="loading" class="mx-auto my-auto" width="500">
      <v-card-title center>
          Sign In
      </v-card-title>
      <v-form>
        <v-container>
          <v-row>
            <v-col class="pb-0 mx-3">
              <v-text-field
                v-model="username"
                label="Username"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0 mx-3">
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-btn color="primary" @click="checkAuth">
                 Login
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 mx-3 mb-0">
              <v-alert
                dense
                text
                type="success"
                v-if="triedLogin && authenticated"
                >User Authenticated</v-alert
              >
              <v-alert
                dense
                text
                type="error"
                v-if="triedLogin && !authenticated"
                >Invalid Credentials</v-alert
              >
            </v-col>
          </v-row>
          <template slot="progress">
            <v-progress-linear
              color="#004990"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>
        </v-container>
      </v-form>
    </v-card>
  </v-app>
</template>

<script>
import { login } from "../utils/api";
import { ACCESS_TOKEN } from "../utils/constants";

export default {
  name: "LoginCard",
  data() {
    return {
       dummyCredentials: {
         username: "admin",
         password: "private",
       },
      username: "",
      password: "",
      keepLoggedIn: "",
      showPassword: false,
      triedLogin: false,
      authenticated: false,
      loading: false,
    };
  },
  methods: {
    checkAuth() {
      const loginRequest = {
        email: this.username,
        password: this.password,
      };

      this.loading = true;
      login(loginRequest)
        .then((res) => {
          console.log(res)
          this.triedLogin = true;
          this.authenticated = true;
          setTimeout(() => {
            this.loading = false;
            localStorage.setItem(ACCESS_TOKEN, res.accessToken);
            this.$router.replace({ path: "/home" });
          }, 2000);
        })
        .catch((error) => {
          if (error.status === 401) {
            this.triedLogin = true;
            this.authenticated = false;
            this.loading = false;
          }
        });

      if (
        this.dummyCredentials.username === this.username &&
        this.dummyCredentials.password === this.password
      ) {
        this.authenticated = true;
        this.loading = true;
        this.triedLogin = true;
        console.log(login())
        setTimeout(() => {
          this.loading = false;
          this.$router.replace({ path: "/home" });
        }, 2000);
      } else {
        this.triedLogin = true;
        this.authenticated = false;
        this.loading = false;
      }
    },
  },
};
</script>
