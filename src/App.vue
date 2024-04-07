<template>
  <v-app>
    <v-main>
      <router-view ></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
}
</script>

<style>
.container {
  border-radius: 5px;
  background-color: white;
}

.shadow {
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}
</style>