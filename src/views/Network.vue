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
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="newItem.deviceName"
                      label="Device name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="newItem.type"
                      label="Device Type"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="newItem.ipaddress"
                      label="IP Address"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="newItem.user"
                      label="User"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="newItem.team"
                      label="Team"
                    ></v-text-field>
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
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.deviceName"
                      label="Device name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.type"
                      label="Device Type"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.ipaddress"
                      label="IP Address"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.user"
                      label="User"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.team"
                      label="Team"
                    ></v-text-field>
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
            Book
          </v-btn>
          <span class="red--text" v-else>ALREADY BOOKED</span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { deleteDevice, getDevice, addDevice, updateDevice,bookDevice} from "../utils/api";
import { mapState } from 'vuex';

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
        ],
      alert:false,
      deleteObj:null,
      devices:[],
      newDeviceDialog: false,
      editedItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        user: '',
        team: ''
      },
      newItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        user: '',
        team:''
      },
      defaultItem: {
        deviceName: '',
        type: '',
        ipaddress: '0.0.0.0',
        user: '',
        team:''
      },
      search:'',
      formTitle:'New Device',
      editDialog: false,
      showBookDevice: false,
      bookDeviceId: null,
      dates: ['2021-11-26', '2021-11-27'],

    }),
    created () {
      if(this.userRole=="admin"){this.headers.push({ text: 'Actions', value: 'actions' })}
      this.initialize()
    },
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    ...mapState('user', ['userId', 'emailId', 'userRole']),

    },
    methods: {
      async initialize () {
        this.devices = await getDevice()
      },
     editItem (item){
        this.editDialog = true
        this.editedItem = item
      },
      saveEdit(){
        updateDevice(this.editedItem)
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
        this.devices.pop(this.deleteObj)
      }, 
      closeDelete () {
        this.dialogDelete = false
      },
      save(){
        addDevice(this.newItem)
        this.devices.push(this.newItem)
        this.newItem = this.defaultItem
        this.newDeviceDialog = false
      },
      close(){
        this.newItem = this.defaultItem
        this.newDeviceDialog =false
      },
      bookDeviceForm(item){
        this.bookDeviceId = item.id
        this.showBookDevice = true
      },
      book(){
        bookDevice({
          deviceId: this.bookDeviceId,
          dates: this.dates
        })
        this.showBookDevice = false
        this.bookDeviceId = null
      },
      cancelBooking(){
        this.showBookDevice = false
        this.bookDeviceId = null
      }
    },
  }
</script>