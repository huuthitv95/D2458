import Vue from 'vue';
import App from './App';
import _mixins from './common/_mixins';
import VueClipboard from 'vue-clipboard2'
import i18n from './common/i18n';
Vue.use(VueClipboard)

// 关闭生产提示
Vue.config.productionTip = false;
// 小程序页面组件和这个`App.vue`组件的写法和引入方式是一致的，为了区分两者，需要设置`mpType`值
App.mpType = 'app';

Vue.mixin(_mixins);
Vue.mixin({
	methods: {
		$t: i18n.t,
		$setLocale: i18n.setLocale,
		$locale: i18n.getLocale,
	},
	onShow() {
		i18n.updateBars();
		i18n.translatePage();
	},
	updated() {
		i18n.translatePage();
	},
});

const app = new Vue({
    ...App
});
app.$mount();
