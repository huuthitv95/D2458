import _action from './_action';
import i18n from './i18n';

export default {
	/** Hook route tabBar */
	routeTabBarHook(){
		i18n.updateBars();
		_action.routeTool();
		_action.setStatusTips();
	},
	/** Hook route cho các trang không phải tabBar */
	routeSonHook(){
		i18n.updateBars();
		_action.routeTool();
	},
}
