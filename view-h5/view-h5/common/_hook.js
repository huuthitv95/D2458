import _action from './_action';
import i18n from './i18n';

export default {
	/** tabBar路由钩子 */
	routeTabBarHook(){
		i18n.updateBars();
		_action.routeTool();
		_action.setStatusTips();
	},
	/** 除了tabBar页面的路由钩子 */
	routeSonHook(){
		i18n.updateBars();
		_action.routeTool();
	},
}
