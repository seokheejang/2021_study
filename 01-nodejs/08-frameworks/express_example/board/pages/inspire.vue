<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <small> {{apiCheck}} </small>
      <v-btn @click="api_post"> API POST </v-btn>
      <v-btn @click="api_get"> API GET </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      apiCheck: ''
    }
  },
  methods: {
    async api_post () {
      console.log('vue post api')
      try {
        const rs = await this.$axios.post('/api/')
        console.log('Response :', rs)
        this.apiCheck = rs
      } catch (err) {
        console.log('Error :', err)
        this.apiCheck = err
      }
    },
    async api_get () {
      console.log('vue get api')
      try {
        const rs = await this.$axios.get('/api/')
        console.log('Response :', rs)
        this.apiCheck = rs
      } catch (err) {
        console.log('Error :', err)
        this.apiCheck = err
      }
    }
  }
}
</script>
