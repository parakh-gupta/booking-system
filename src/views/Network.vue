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
        Protocol
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
        :items="protocols"
        sort-by="protocol"
        class="elevation-1"
      >
        <template v-slot:top>   
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
                @click="deleteItem(item)"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>
          <span>Delete</span>
          </v-tooltip>
        </template>
        
        <template v-slot:no-data>
          <v-btn
            color="primary"
            @click="initialize"
          >
            Reset
          </v-btn>
        </template>
      </v-data-table>
     
    </v-card>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dialogDelete: false,
      headers: [
          {
            text: 'Protocol',
            align: 'start',
            sortable: false,
            value: 'protocol',
          },
          { text: 'Port', value: 'port' },
          { text: 'Timeout (ms)', value: 'timeout' },
          { text: 'Polling Interval (s)', value: 'polling' },
          { text: 'Attempts', value: 'attempts' },
          { text: 'Action', value: 'actions' },
        ],
      editedIndex: -1,
      alert:false,
    }),
    watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        
      },
      deleteItem (item) {
        this.dialogDelete = true
        console.log(item)
      },
      deleteItemConfirm () {
        //this.protocols.splice(this.editedIndex, 1)
        this.alert = !this.alert
        this.closeDelete()
      }, 
      closeDelete () {
        this.dialogDelete = false
      },
    },
  }
</script>