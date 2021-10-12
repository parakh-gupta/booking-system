<template>
  <v-app>
    <v-card :loading="loading" class="mx-auto my-auto" width="500">
      <v-card-title center>
          Sign Up
      </v-card-title>
      <v-form v-model="valid">
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
            <v-col class="pb-0 mx-3">
              <v-text-field
                v-model="firstName"
                label="First Name"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col class="pb-0 mx-3">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-btn color="primary" @click="checkCredentials">
                 Sign Up
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 mx-3 mb-0">
              <v-alert
                dense
                text
                type="success"
                v-if="triedSignUp && authenticated"
                >User Created. Please login now.</v-alert
              >
              <v-alert
                dense
                text
                type="error"
                v-if="triedSignUp && !authenticated"
                >Invalid Data</v-alert
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
import { signup } from "../utils/api";
import { validateEmail } from "../utils/helpers";
export default {
  name: "SignupCard",
  data() {
    return {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      showPassword: false,
      triedSignUp: false,
      authenticated: false,
      loading: false,
      valid: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => validateEmail(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    checkCredentials() {
      const signUpRequest = {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        userRole: "user"
      }

      this.loading = true;

      signup(signUpRequest)
      .then(() => {
        this.triedSignUp = true;
        this.authenticated = true;
        setTimeout(() => {
          this.loading = false;
          this.$router.push({ path: "/login" });
        }, 2000)
      })
      .catch((error) => {
        if (error.status === 409 || error.status === 400) {
          this.triedSignUp = true;
          this.authenticated = false;
          this.loading = false;
        }
      })
    }
  }
}
</script>