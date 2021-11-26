<template>
  
  <v-card height="80vh">
    <v-card-title class="text-center justify-center py-6">
      <h3 class="font-weight-bold ">
        User Profile
      </h3>
    </v-card-title>

    <v-tabs
      v-model="tab"
      background-color="transparent"
      grow
    >
      <v-tab
        v-for="item in items"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
       <v-card class="pa-10">
        <v-form
          ref="form"
        >
          <v-text-field
            v-model="name"
            label="Name"
            readonly
          ></v-text-field>

          <v-text-field
            v-model="emailId"
            label="E-mail"
            readonly
          ></v-text-field>

          <v-text-field
            v-model="userRole"
            label="Role"
            readonly
          ></v-text-field>
        </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="pa-10" >
          <v-form
          ref="ResetPasswordForm"
          >
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            required
          ></v-text-field>

          <v-text-field
            v-model="newPassword"
            label="New Password"
            required
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            required
          ></v-text-field>

          <v-btn
            color="primary"
          >
            Reset Password
          </v-btn>

          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>

</template>

<script>
import { mapState } from 'vuex';
   export default {
    data () {
      return {
        tab: null,
        items: [
          'Update user Info','Reset Password'
        ],
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    computed:{
      ...mapState('user', ['userId', 'emailId', 'userRole']),
    },
    methods: {
      reset(){
        this.$refs.form.reset()
      }
    },
  }
</script>