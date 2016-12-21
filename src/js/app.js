/**
 * Created with PhpStorm.
 * Desc:
 * Author: limengjun
 * Date: 2016/8/1
 * Time: 9:57
 */
(function(){
    OJS.app = {
        hasNetWork: function(callback){
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'isNetworkOk',
                data: {}
            }, function responseCallback(responseData) {
                if(responseData.data.status){
                    callback(true);
                }else{
                    callback(false);
                }
            });
        },
        loadPage: function(url){
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'loadPage',
                data: {
                    url: url
                }
            });

        },
        alert: function(title, message, button){
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'alert',
                data: {
                    title: title,
                    message: message,
                    button: button
                }
            });
        },
        toast: function(message){
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'toast',
                data: {
                    message: message
                }
            });
        }
    };
})();