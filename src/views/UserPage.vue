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
          <v-expansion-panels flat>
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
import {devicesBookedForUser, releaseDevice} from "../utils/api";
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
        releaseDialog: false
      }
    },
    computed:{
      ...mapState('user', ['userId', 'emailId', 'userRole', 'name']),
    },
    created(){
      this.getDevices();
    },
    methods: {
      reset(){
        this.$refs.form.reset()
      },
      async getDevices(){
        const res= await devicesBookedForUser({email: this.emailId})
        this.devices = res.data
        console.log(this.devices)
      },
      releaseItem(item){
        console.log("pppppppppppppp")
        this.releaseObj = item
        this.releaseDialog = true
        console.log("pppppppppppppp", this.releaseDialog)
      },
      release(){
        releaseDevice({deviceId:this.releaseObj.id})
        const pos = this.devices.indexOf(this.releaseObj);
        this.devices.splice(pos, 1)
        this.releaseDialog = false
      },
      close(){
        this.releaseDialog = false
      }
    },
  }
</script>