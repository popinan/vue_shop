import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import TreeTable from 'vue-table-with-tree-grid'
import { formatDate } from "common/utils.js";

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


import 'assets/css/global.css'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('showDate', function (value) {
  let date = new Date(value * 1000);
  return formatDate(date, "yyyy-MM-dd hh:mm");
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
