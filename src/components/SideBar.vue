<template>
  <v-app dark>
    <v-app-bar
        app
        clipped-left
      >
        <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>

        <v-spacer></v-spacer>
      
        <v-switch 
          @change = "toggleDarkTheme()"
          class = 'pt-5 pr-5'
          label="Toggle theme"
        >
        </v-switch>

        <v-btn 
          color="primary" 
          @click="logout()"
        >
        Log out 
        </v-btn>

    </v-app-bar>
    <v-navigation-drawer
      app
      absolute 
      v-model="drawer"
      :mini-variant.sync="mini"
      :style="{ top: $vuetify.application.top + 'px'}"
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          color="primary"
          router :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>

</template>


<script>

export default {
  name: 'Home',

 data () {
      return {
        drawer: true,
        items: [
          { title: 'Devices', icon: 'mdi-server-network', route:'/home' },
          { title: 'Users', icon: 'mdi-account-group-outline', route:'/user' },
        ],
        mini: true, 
      }
 },
 methods:{
   toggleDarkTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      //console.log(this.$vuetify.theme.dark);
    },
    logout(){
      this.$router.push({ path: "/logout" });
    }
 }
};
</script>
