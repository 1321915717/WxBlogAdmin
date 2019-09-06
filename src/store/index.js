import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({//全局变量定义
    state: {
        forcedLogin: false,//是否需要强制登录
        hasLogin: false,
        nickName: '',
        session_key:'',
        token:'',
		avatarUrl:''
       
    },
    mutations: {
        login(state, user) {
            state.nickName = user.nickName || '';
            state.hasLogin = true;
            state.token = user.token || '';
            state.session_key = user.session_key || '';
			state.avatarUrl = user.avatarUrl || '';
        },
        logout(state) {
           state.nickName = "";
           state.hasLogin = false;
           state.session_key = '';
           state.token = '';
			state.avatarUrl ='';
          
        }
    }
})
