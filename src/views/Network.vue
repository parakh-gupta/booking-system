<template>
  <v-container fluid>
    <v-snackbar
      v-model="alert"
      timeout="7000"
      color="success"
      right
    >
      Item deleted
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="alert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-card>
      <v-card-title>
        Devices
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="devices"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>  <v-dialog
          v-model="newDeviceDialog"
          max-width="500px"
          v-if="userRole === 'admin'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2 ml-6"
              v-bind="attrs"
              v-on="on"
            >
            <v-icon left>
              mdi-plus
            </v-icon>
               Add New Device
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="newItem.deviceName"
                      label="Device name"
                      :rules=deviceNameRules
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    md="6"
                  ><v-select
                      v-model="newItem.type"
                      label="Device Type"
                      :items="deviceTypeList"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="newItem.ipaddress"
                      label="IP Address"
                      :rules=ipRules
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    md="6"
                  >
                    <v-select
                      v-model="newItem.team"
                      label="Team"
                      :items="teamsList"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
                :disabled=disableSaveNew
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="editDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Device</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.deviceName"
                      label="Device name"
                      :rules=deviceNameRules
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="editedItem.type"
                      label="Device Type"
                      :items="deviceTypeList"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.ipaddress"
                      label="IP Address"
                      :rules=ipRules
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="editedItem.team"
                      label="Team"
                      :items="teamsList"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeEdit"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveEdit"
                :disabled=disableSaveEdit
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> 
          <v-dialog v-model="dialogDelete" max-width="300px">
            <v-card>
              <v-card-title class="text-h5">Alert</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                Are you sure you want to delete this item?
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue darken-1" @click="closeDelete">Cancel</v-btn>
                <v-btn text color="blue darken-1" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog  v-model="showBookDevice" max-width="700px">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row class="ma-1">
                    <v-col cols="12">
                      Select Date
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                    <v-date-picker
                      v-model="dates"
                      range
                      :allowed-dates="disablePastDates"
                    ></v-date-picker>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                    <v-text-field
                      v-model="dateRangeText"
                      label="Date range"
                      prepend-icon="mdi-calendar"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
                </v-container>
                </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue darken-1" @click="cancelBooking">Cancel</v-btn>
                <v-btn text color="blue darken-1" @click="book">Book</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.sno="{ index }">
          <span>{{index+1}}</span>
        </template>
        <template v-slot:item.actions="{ item }" >
          <v-icon
            small
            class="mr-2"
            color="primary"
            @click="editItem(item)"
            v-if="userRole === 'admin'"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            color="primary"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.booking="{ item }">
            <v-btn
            small text
            color="primary"
            block
            outlined
            v-if="item.availability==true"
            @click="bookDeviceForm(item)"
          >
            Book Now
          </v-btn>
          <span class="red--text text-center" v-else>ALREADY BOOKED</span>
        </template>
        <template v-slot:item.date="{ item }">
          <span
            v-if="item.availability==true"
          >
            -
          </span>
          <span  v-else>{{item.date}}</span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { deleteDevice, getDevice, addDevice, updateDevice, bookDevice, sendMail, getDeviceFromID} from "../utils/api";
import { mapState } from 'vuex';
import { validateIpv4 } from "./../utils/helpers";

  export default {
    data: () => ({
      dialogDelete: false,
      headers: [
          {
            text: 'SNo',
            align: 'start',
            value: 'sno'
          },
          { text: 'Device Name', value: 'deviceName' },
          { text: 'Device Type', value: 'type' },
          { text: 'IP address', value: 'ipaddress' },
          { text: 'Owner', value: 'user' },
          { text: 'Team', value: 'team' },
          { text: 'Booking', value: 'booking' },
          { text: 'Till Date', value: 'date' },
        ],
      alert:false,
      deleteObj:null,
      devices:[],
      newDeviceDialog: false,
      editedItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        team: ''
      },
      newItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        team:''
      },
      newEditedItem: {},
      defaultItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        team:''
      },
      search:'',
      formTitle:'New Device',
      editDialog: false,
      showBookDevice: false,
      bookDeviceId: null,
      // dates: ['2021-11-26', '2021-11-27'],
      ipRules: [
        v => !!v || 'IP address is required',
        v => validateIpv4(v) || 'IP address is invalid'
      ],
      deviceNameRules: [
        v => !!v || 'Device name is required',
      ],
      deviceTypeRules: [
        v => !!v || 'Device type is required',
      ],
      teamRules: [
        v => !!v || 'Team is required',
      ],
      ownerRules: [
        v => !!v || 'Owner is required',
      ],
      dates: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      deviceTypeList:["Server","VM","Device"],
      teamsList:["HiOS","HiSecOS","HiLCOS","Provize","Wireless","Grtcomm"]
    }),
    created () {
      if(this.userRole=="admin"){this.headers.push({ text: 'Actions', value: 'actions' })}
      this.initialize()
    },
    computed: {
      dateRangeText() {
        return this.dates.join(' ~ ')
      },
      ...mapState('user', ['userId', 'emailId', 'userRole']),
      disableSaveNew() {
        if (
          this.newItem.deviceName === null ||
          this.newItem.deviceName === "" ||
          this.newItem.type === null ||
          this.newItem.type === "" ||
          this.newItem.ipaddress === null ||
          this.newItem.ipaddress === "" ||
          this.newItem.team === null ||
          this.newItem.team === "" ||
          !validateIpv4(this.newItem.ipaddress)
        ) {
          return true;
        } else {
          return false;
        }
      },
      disableSaveEdit() {
        if (
          this.editedItem.deviceName === null ||
          this.editedItem.deviceName === "" ||
          this.editedItem.type === null ||
          this.editedItem.type === "" ||
          this.editedItem.ipaddress === null ||
          this.editedItem.ipaddress === "" ||
          this.editedItem.team === null ||
          this.editedItem.team === "" ||
          this.editedItem.user === null ||
          this.editedItem.user === "" ||
          !validateIpv4(this.newItem.ipaddress)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      async initialize () {
        this.devices = await getDevice()
      },
      editItem (item){
        this.editDialog = true
        this.newEditedItem = this.editedItem;
        this.newEditedItem.id = item.id;
      },
      saveEdit(){
        updateDevice(this.newEditedItem)
        this.editDialog = false
      },
      closeEdit(){
        this.editDialog = false
      },
      deleteItem (item) {
        this.dialogDelete = true
        this.deleteObj=item
      },
      deleteItemConfirm () {
        this.alert = true
        deleteDevice(this.deleteObj.id)
        this.dialogDelete = false
        const pos = this.devices.indexOf(this.deleteObj);
        this.devices.splice(pos, 1)
      },
      closeDelete () {
        this.dialogDelete = false
      },
      async save(){
        let currItem = {};
        await addDevice(this.newItem).then(res => {
          currItem = res.data.data;
          this.devices.push(currItem)
          this.newItem = this.defaultItem
          this.newDeviceDialog = false
        })
      },
      close(){
        this.newItem = this.defaultItem
        this.newDeviceDialog =false
      },
      bookDeviceForm(item){
        this.bookDevice = item
        this.showBookDevice = true
      },
      async book(){
        await bookDevice({
          deviceId: this.bookDevice.id,
          emailId: this.$store.state.user.emailId,
          dates: this.dates
        }).then(async (res) => {
          await this.sendEmailExistingOwner(res.data, this.$store.state.user.emailId);
          await this.sendEmailNewOwner(res.data, this.$store.state.user.emailId);
        })
        this.initialize()
        const updatedDevice = await getDeviceFromID(this.bookDevice.id)
        this.devices.forEach((device)=>{
          if(device.id == updatedDevice.id){
            device=updatedDevice
          }
        })
        this.showBookDevice = false
        this.bookDeviceId = null
      },
      cancelBooking(){
        this.showBookDevice = false
        this.bookDeviceId = null
      },
      async sendEmailExistingOwner(deviceData, newUser) {
        const data = {
          mailBody: `<p>Hello, your device ${deviceData.deviceName} with IP address ${deviceData.ipaddress} has been booked by ${newUser}.<p/>`,
          subject: `Update on your booked device`,
          email: deviceData.user
        }
        await sendMail(data);
      },
      async sendEmailNewOwner(deviceData, newUser) {
        const data = {
          mailBody: `<p>Hello, you have booked the device ${deviceData.deviceName} with IP address ${deviceData.ipaddress}. The existing user ${deviceData.user} has been notified.<p/>`,
          subject: `Update on your newly booked device`,
          email: newUser
        }
        await sendMail(data);
      },
      disablePastDates(val) {
        return val >= new Date().toISOString().substr(0, 10)
      }
    },
  }
</script>