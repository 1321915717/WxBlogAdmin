import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
import {store} from './store'



Vue.use(ElementUI)

Vue.config.productionTip = false
axios.defaults.withCredentials=true
window.bus = new Vue();

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if (window.localStorage.isLogin === '1') {
      next()
    } else if (to.path !== '/') {
      next({path: '/'})
      Vue.prototype.$message.warning('检测到您还未登录,请登录后操作！')
    }
  } else {
    next()
		
  }
});
new Vue({
  el: '#app',
  router,
	store,
  template: '<App/>',
  components: {App},

	
})

