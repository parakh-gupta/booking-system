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
                v-model="email"
                label="E-mail"
                :rules="emailRules"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0 mx-3">
              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-btn color="primary" @click="checkAuth" :disabled=disableLogin>
                 Login
              </v-btn>
            </v-col>
            <v-col
              ><v-btn color="primary" @click="signup">
                 Signup
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
import { validateEmail, getCookie } from "../utils/helpers";
import { mapState, mapActions } from 'vuex';

export default {
  name: "LoginCard",
  data() {
    return {
      email: "",
      password: "",
      keepLoggedIn: "",
      showPassword: false,
      triedLogin: false,
      authenticated: false,
      loading: false,
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => validateEmail(v) || 'E-mail must be valid',
      ],
    };
  },
  computed: {
    ...mapState('user', ['userId', 'emailId', 'userRole']),
    disableLogin() {
      if (this.email === null || this.email === "" || this.password === null || this.password === "" || !validateEmail(this.email)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions('user' ,['updateUserId', 'updateEmailId', 'updateUserRole']),
    checkAuth() {
      const loginRequest = {
        email: this.email,
        password: this.password,
      };

      this.loading = true;
      login(loginRequest)
        .then((res) => {
          if (res.status === 200) {
            this.triedLogin = true;
            this.authenticated = true;
            const token = getCookie("accessToken");
            this.updateUserId(res.data.userId);
            this.updateEmailId(res.data.emailId);
            this.updateUserRole(res.data.userRole);
            setTimeout(() => {
              this.loading = false;
              if (token) localStorage.setItem(ACCESS_TOKEN, token);
              this.$router.replace({ path: "/home" });
            }, 2000);
          }
          else {
            setTimeout(() => {
              this.triedLogin = true;
              this.authenticated = false;
              this.loading = false;
            }, 2000)
          }
        })
    },
    signup() {
      this.$router.push({ path: "/signup" });
    }
  },
};
</script>
