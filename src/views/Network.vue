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
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
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
                      v-model="editedItem.name"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.calories"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.fat"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

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
                <v-btn color="blue darken-1" outlined @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" outlined @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }"> 
              <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>
          <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { deleteDevice, getDevice } from "../utils/api";

  export default {
    data: () => ({
      dialogDelete: false,
      headers: [
          {
            text: 'SNo',
            align: 'start',
          },
          { text: 'deviceName', value: 'deviceName' },
          { text: 'type', value: 'type' },
          { text: 'user', value: 'user' },
          { text: 'ipaddress', value: 'ipaddress' },
          { text: 'availability', value: 'availability' },
          { text: 'actions', value: 'actions' },
        ],
      editedIndex: -1,
      alert:false,
      deleteI:null,
      devices:[],
      
      dialog: false,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      search:'',
      formTitle:'New Device'
    }),
    created () {
      this.initialize()
    },
    methods: {
      async initialize () {
        this.devices= await getDevice()
      },
      deleteItem (item) {
        this.dialogDelete = true
        this.deleteI=item
      },
      deleteItemConfirm () {
        this.alert = true
        deleteDevice(this.deleteI.id)
      }, 
      closeDelete () {
        this.dialogDelete = false
      },
      save(){

      },
      close(){

      }
    },
  }
</script>