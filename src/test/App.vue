<template>
  <section>
    <h2 class="test-header">{{header}}</h2>
    <Empty :emptyData="emptyTest" />
  </section>
</template>
<script>
  import Empty from './components/Empty.vue';
  export default {
      name: 'tags-page',
      components: {
        Empty
      },
      data() {
          return {
              header: 'vue test header',
              emptyTest: 'This is vue generator test page!'
          };
      },
      mounted() {
        this.initData();
      },
      methods: {
        initData () {
          console.log('initData method');
        }
      },
  };

</script>
<style lang="scss" scoped="" src="./style.scss"/>
