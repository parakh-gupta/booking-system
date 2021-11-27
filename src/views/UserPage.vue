<template>
  
  <v-card height="80vh">
    <v-card-title class="text-center justify-center py-6">
      <h3 class="font-weight-bold ">
        User Profile
      </h3>
    </v-card-title>

    <v-tabs
      v-model="tab"
      background-color="blue lighten-5"
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
          <v-dialog v-model="releaseDialog" max-width="300px">
                <v-card>
                  <v-card-title class="text-h5">Alert</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    Are you sure you want to release this device?
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="blue darken-1" @click="close">Cancel</v-btn>
                    <v-btn text color="blue darken-1" @click="release">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Assigned Devices
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="devices"
                :items-per-page="5"
                class="elevation-1"
                v-if="devices.length>0"
              >
              <template v-slot:item.release="{ item }">
                  <v-btn
                  small text
                  color="error"
                  outlined
                  @click="releaseItem(item)"
                  v-if="item.availability==false"
                >
                  Release
                </v-btn>
                <span class="green--text text-center" v-else>FREE</span>
              </template>
              </v-data-table>
              <div v-else> NO DEVICES ASSIGNED</div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="pa-10" >
          <v-form
          ref="ChangePasswordForm"
          >
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            :rules=currentPasswordRules
            :append-icon="showPasswordCurrent ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswordCurrent ? 'text' : 'password'"
            @click:append="showPasswordCurrent = !showPasswordCurrent"
            required
          ></v-text-field>

          <v-text-field
            v-model="newPassword"
            label="New Password"
            :rules=newPasswordRules
            :append-icon="showPasswordNew ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswordNew ? 'text' : 'password'"
            @click:append="showPasswordNew = !showPasswordNew"
            required
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :rules=confirmPasswordRules
            :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswordConfirm ? 'text' : 'password'"
            @click:append="showPasswordConfirm = !showPasswordConfirm"
            class="mb-5"
            required
          ></v-text-field>
          <v-row>
            <v-col class="pt-0 mx-3 mb-0">
              <v-alert
                dense
                text
                type="success"
                v-if="triedPasswordChange && passwordChangeSuccessful"
                >Password change successful</v-alert
              >
              <v-alert
                dense
                text
                type="error"
                v-if="triedPasswordChange && !passwordChangeSuccessful"
                >Existing Password is incorrect</v-alert
              >
            </v-col>
          </v-row>
          <v-btn
            color="primary"
            @click="changePasswordBtn"
            :disabled=changePasswordDisable
          >
            Change Password
          </v-btn>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { devicesBookedForUser, releaseDevice, sendMail, changeUserPassword } from "../utils/api";
import { DEFAULT_ADMIN } from "../utils/constants";
import { mapState } from 'vuex';
   export default {
    data () {
      return {
        tab: null,
        items: [
          'Update user Info','Change Password'
        ],
        showPasswordCurrent: false,
        showPasswordNew: false,
        showPasswordConfirm: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        devices: '',
        headers: [
          {
            text: 'Device Name',
            align: 'start',
            sortable: false,
            value: 'deviceName',
          },
          { text: 'Device Type', value: 'type' },
          { text: 'IP Address', value: 'ipaddress' },
          { text: 'Release Device', value: 'release' },
        ],
        releaseObj:'',
        releaseDialog: false,
        confirmPasswordRules: [
          v => v === this.newPassword || "Passwords don't match",
          v => !!v || "Please confirm the password",
        ],
        newPasswordRules: [
          v => !!v || "Please enter the password",
        ],
        currentPasswordRules: [
          v => !!v || "Please enter the password",
        ],
        triedPasswordChange: false,
        passwordChangeSuccessful: false
      }
    },
    computed:{
      ...mapState('user', ['userId', 'emailId', 'userRole', 'name']),
      changePasswordDisable() {
        if(
          this.newPassword !== this.confirmPassword ||
          this.newPassword === "" ||
          this.newPassword === null ||
          this.confirmPassword === "" ||
          this.confirmPassword === null ||
          this.currentPassword === "" ||
          this.currentPassword === null
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    created(){
      this.getDevices();
    },
    methods: {
      async changePasswordBtn() {
        const data = {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
          email: this.$store.state.user.emailId
        }
        await changeUserPassword(data).then(res => {
          if (!res || res === undefined || res.status === undefined || res.status == null || !res.status) {
            this.triedPasswordChange = true;
            this.passwordChangeSuccessful = false;
          }
          else if (res.status === 200) {
            this.triedPasswordChange = true;
            this.passwordChangeSuccessful = true;
          }
        }).catch(e => e)
      },
      async getDevices(){
        const res= await devicesBookedForUser({email: this.emailId})
        this.devices = res.data
      },
      releaseItem(item){
        this.releaseObj = item
        this.releaseDialog = true
      },
      release(){
        releaseDevice({deviceId:this.releaseObj.id}).then(async res => {
          await this.sendEmailReleaseExistingOwner(res.data, DEFAULT_ADMIN);
          await this.sendEmailReleaseNewOwner(res.data, DEFAULT_ADMIN);
        })
        const pos = this.devices.indexOf(this.releaseObj);
        this.devices.splice(pos, 1)
        this.releaseDialog = false
      },
      close(){
        this.releaseDialog = false
      },
      async sendEmailReleaseExistingOwner(deviceData, newUser) {
        const data = {
          mailBody: `<p>Hello, you have released the device ${deviceData.deviceName} with IP address ${deviceData.ipaddress}. The admin ${newUser} has been notified.<p/>`,
          subject: `Update on your released device`,
          email: deviceData.user
        }
        await sendMail(data);
      },
      async sendEmailReleaseNewOwner(deviceData, newUser) {
        const data = {
          mailBody: `<p>Hello, the device ${deviceData.deviceName} with IP address ${deviceData.ipaddress}has been released by user ${deviceData.user}.<p/>`,
          subject: `Update on a released device`,
          email: newUser
        }
        await sendMail(data);
      },
    },
  }
</script>