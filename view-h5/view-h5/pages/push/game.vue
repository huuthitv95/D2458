<template>
	
	<view>
		
        <web-view :src="url"/>
		
	</view>
	
</template>

<script>
	
	import _hook from '../../common/_hook';
	
	export default {
		components: {
				
		},
		data() {
			return {
				url: 'https://baidu.com/',
			}
		},
		onShow(){
			_hook.routeTabBarHook();
		},
		onLoad() {
		
				setTimeout(() => {
					let currentWebview = this.$mp.page.$getAppWebview().children()[0]; //获取当前页面的webview对象);
					currentWebview.onloaded = () => {
						uni.setNavigationBarTitle({
						    title: ' '
						});
					}	
					currentWebview.onloading = () => {
						uni.setNavigationBarTitle({
						    title: ' '
						});
					}
				}, 1000);
	
		},
		computed: {
			
		},
		methods: {
			
		},
		onNavigationBarButtonTap(e) {
			
		
				let currentWebview = this.$mp.page.$getAppWebview().children()[0]; //获取当前页面的webview对象
				
			switch (e.index){
				case 0:
				
				
						currentWebview.reload();
		
					
				
						location.reload();
		
					
					break;
				case 1:
				
	
						currentWebview.back();
			
					

						history.back();
									
					break;
				case 2:
				
		
						currentWebview.forward();
	
					
		
						history.forward();

					
					break;
				case 3:
			
						currentWebview.loadURL(this.url);
			
					
		
						location.reload();
		
					
					break;
				default:
					break;
			}
		},
	}
</script>

<style>
	.tool_button {
		width: 20px;
		height: 20px;
	}
	.status_bar {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    background-color: #F8F8F8; 
	}  
	.top_view {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #F8F8F8;  
	    top: 0;  
	    z-index: 999;  
	}
	.tool_main {
		display: inline-block;
		width: 120upx;
		text-align: center;
	}
</style>
