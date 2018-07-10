import fastclick from 'fastclick';
import Vue from 'vue';
import App from './App.vue';

fastclick.attach(document.body);

new Vue({
  el: '#app',
  render: h => h(App)
});
