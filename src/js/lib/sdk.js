/**
 * Created with PhpStorm.
 * Desc:
 * Author: limengjun
 * Date: 2016/7/12
 * Time: 9:57
 */


!function(){

    var readyManager = {
        //设置某个项目ready状态为true并检查是否所有item均已ready，如果是，则触发ready事件
        ready: function(seriesName, itemName){
            this._readySeries[seriesName][itemName] = true;
            this.checkSeriesReady(seriesName);
        },
        //检查某个seriesName是否所有item均已ready
        isReady: function(seriesName){
            for(var item in this._readySeries[seriesName]){
                if(!this._readySeries[seriesName][item]){
                    return false;
                }
            }
            return true;
        },
        checkSeriesReady: function(seriesName){
            if(this.isReady(seriesName)){
                OJS._eventManager.trigger(OJS.EVENTS.readyManager[seriesName]);
                OJS._eventManager.unbind(OJS.EVENTS.readyManager[seriesName]);
            }
        },
        //所有需要ready的项目，全部为true后才算ready
        _readySeries: {
            app: {
                deviceId: false,
                token: false
            },
            webSocket: {
                onlineStatus: false,
                sensorData: false
            }
        }
    };

    //一个简单的自定义事件对象
    var eventManager = {
        bind: function(dataObj){
            for(var eventName in dataObj){
                var eventFunction = dataObj[eventName];
                if(!this._eventFunctionPool[eventName]){ //初始化某个时间的函数容器
                    this._eventFunctionPool[eventName] = [];
                }
                var eventFunctionList = this._eventFunctionPool[eventName];
                eventFunctionList.push(eventFunction);
            }
        },
        unbind: function(eventName){
            if(this._eventFunctionPool[eventName]){
                this._eventFunctionPool[eventName].length = 0;
                this._eventFunctionPool[eventName] = null;
            }
        },
        trigger: function(eventName, data){
            var eventList = this._eventFunctionPool[eventName];
            if(eventList && eventList.length){
                for(var i = 0; i < eventList.length; i++){
                    var eventFunc = eventList[i];
                    eventFunc.call(window, data);
                }
            }
        },
        _eventFunctionPool: { //事件列表
        }
    };

    var OJS = {
        device: {
            id: window.__DEBUG_DEVICE_ID || '211994', //211994
            token: window.__DEBUG_DEVICE_TOKEN || '6mzVvtJ7lXg=' //6mzVvtJ7lXg=
        },
        console: {
            log: function(message){
                window.console && console.log(message);
            },
            error: function(message){
                window.console && console.error(message);
            }
        },

        bindReady: function(callback){ //当device的socket连接成功并获取到了在线状态和传感器数据后执行callback。在这之前无法获取在线状态和传感器数据。
            if(OJS._readyManager.isReady('app') && OJS._readyManager.isReady('webSocket')){ //绑定时已经ready，直接执行，忽略绑定。
                callback.call(window);
            }else{ //绑定时未ready，绑定，等待ready时执行。
                var event = {};
                event[OJS.EVENTS.readyManager.webSocket] = callback;
                OJS._eventManager.bind(event);
            }
        },
        bindAppReady: function(callback){ //当与app的bridge连接好可以使用app的api后触发
            if(OJS._readyManager.isReady('app')){
                callback.call(window);
            }else{ //绑定时未ready，绑定，等待ready时执行。
                var event = {};
                event[OJS.EVENTS.readyManager.app] = callback;
                OJS._eventManager.bind(event);
            }
        },
        EVENTS: { //设备的事件列表
            deviceStatusChange: 'deviceStatusChange',
            netWorkStatusChange: 'netWorkStatusChange',
            readyManager: {
                app: 'appReady',
                webSocket: 'webSocketReady'
            }
        },
        WEBVIEWBRIDGENAME: 'AppNativeHandler',
        _readyManager: readyManager,
        _eventManager: eventManager
    };

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

    if(window.__DEBUG_DEVICE_ID && window.__DEBUG_DEVICE_TOKEN){ //pc端调试只需要配置__DEBUG_DEVICE_ID和__DEBUG_DEVICE_TOKEN
        OJS.device.id = window.__DEBUG_DEVICE_ID;
        OJS.device.token = window.__DEBUG_DEVICE_TOKEN;
        OJS._readyManager.ready('app', 'deviceId');
        OJS._readyManager.ready('app', 'token');
    }else{
        setupWebViewJavascriptBridge(function(bridge) {
            OJS.webViewBridge = bridge;
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'deviceId',
                data: {}
            }, function responseCallback(responseData) {
                var deviceId = responseData.data.deviceId;
                if(deviceId){
                    window.debug && debug('获取到deviceId：' + deviceId);
                    OJS.device.id = deviceId;
                    OJS._readyManager.ready('app', 'deviceId');
                }else{
                    window.debug && debug('获取不到deviceId！');
                }
            });
            OJS.webViewBridge.callHandler(OJS.WEBVIEWBRIDGENAME, {
                action: 'subscribeToken',
                data: {}
            }, function responseCallback(responseData) {
                var token = responseData.data.token;
                if(token){
                    window.debug && debug('获取到token：' + token);
                    OJS.device.token = token;
                    OJS._readyManager.ready('app', 'token');
                }else{
                    window.debug && debug('获取不到token！');
                }
            });


        });
    }
    window.OJS = OJS;
}();