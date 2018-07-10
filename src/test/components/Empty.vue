<template>
  <div class="empty-container">
    {{componentPage}}
  </div>
</template>

<script>
  export default {
    name: 'empty',
    data: function () {
      return {
        componentPage: 'empty component test',
      }
    },
    props: {
      emptyData: String
    },
    mounted () {
      console.log('mounted');
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped src="./style.scss">
</style>
