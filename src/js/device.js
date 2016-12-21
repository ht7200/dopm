/**
 * Created with PhpStorm.
 * Desc: device
 * Author: limengjun
 * Date: 2016/7/12
 * Time: 9:57
 */
(function(){
    var device = $.extend(OJS.device, {
        onlineStatus: null, //null代表并未获取到在线状态
        bindPushData: function(dataObj){
            OJS._eventManager.bind(dataObj);
        },

        getSensorData: function(sensorName){
            var dataList;
            if($.isArray(sensorName)){ //返回多个传感器数据
                dataList = {};
                for(var i = 0; i <= sensorName.length; i++){
                    var sensorItemName = sensorName[i];
                    dataList[sensorItemName] = dataManager.getData(sensorItemName);
                }
                return dataList;
            }else{ //返回一个传感器数据
                return dataManager.getData(sensorName);
            }
        },

        sendNotify: function(message, sendCallBack, responseCallBack){
            return notifyManager.sendNotify(message, sendCallBack, responseCallBack);
        }
    });

    //保存并处理传感器数据
    var dataManager = {
        getData: function(sensorName){
            if(sensorName){
                return this._sensorDataList[sensorName];
            }else{
                return this._sensorDataList;
            }

        },
        setData: function(sensorName, data){
            this._sensorDataList[sensorName] = data;
        },
        _sensorDataList: {}

    };

    var notifyManager = {
        sendNotify: function(message, sendCallBack, responseCallBack){
            var stomp = device.realtime._stomp;
            if(stomp && stomp.connected){
                var msgId = this._appendNotify(sendCallBack, responseCallBack);
                stomp.send("/request/cmd", {}, JSON.stringify({
                    msg_id: msgId,
                    body: message
                }));
                return true;
            }else{
                return false;
            }
        },
        notifySended: function(data){ //TODO 错误处理
            var msgId = data.msg_id;
            var uuid = data.uuid;
            var notifyItem = this._notifyList[msgId] || {};
            notifyItem.sendCallBack && notifyItem.sendCallBack();
            notifyItem.responseCallBack && notifyItem.responseCallBack();
            //把msgId索引替换为uuid索引。1、为了释放msgId空间。2.为了notifyResponsed的时候方便寻找notifyItem，因为sdk对命令接受成功的相应里不含msgId，只有uuid
            this._notifyList[uuid] = notifyItem;
            this._notifyList[msgId] = null;
        },
        notifyResponsed: function(data){
            var uuid = data.uuid;
            var notifyItem = this._notifyList[uuid] || {};
            notifyItem.responseCallBack && notifyItem.responseCallBack();
            this._notifyList[uuid] = null;
        },
        _appendNotify: function(sendCallBack, responseCallBack){
            var notifyId = this._generateNotifyId();
            this._notifyList[notifyId] = {
                sendCallBack: sendCallBack,
                responseCallBack: responseCallBack
            };
            return notifyId;
        },
        _generateNotifyId: function(){
            var tempId = '_' + ~~(Math.random() * 100);
            if(this._notifyList[tempId]){ //已存在，重新生成
                return this._generateNotifyId();
            }else{
                return tempId;
            }
        },
        _notifyList: {}
    };

    var realtime = {
        _stomp: null,
        // connet暂未处理失败情形 connet完成三个步骤；1.login登录获取cookie，2.创立链接到服务端的socket实例，3.订阅所有设备改变
        _login: function(){
            var url = 'http://' + OJS.CONF.host;
            var _this = this;
            $.ajax({
                type: 'POST',
                url: url + '/login',
                data: {
                    did: device.id,
                    subsc_token:device.token
                },
                success: function () {
                    _this._connect();
                },
                error: function(){
                    setTimeout(function(){
                        _this._login();
                    }, 3000);
                }
            });
        },
        _connect: function(){
            var socket = new WebSocket('ws://' + OJS.CONF.host + '/realtime');
            var stomp = Stomp.over(socket);
            var _this = this;
            stomp.connect('','', function(){
                stomp.subscribe('/message/queue/online', function (message) {
                    OJS._readyManager.ready('webSocket', 'onlineStatus');
                    _this._receive(message);
                });
                stomp.subscribe('/message/queue/sensor_data', function (message) {
                    OJS._readyManager.ready('webSocket', 'sensorData');
                    _this._receive(message);
                });
                stomp.subscribe('/message/response', function (message) {
                    //订阅下发命令后的返回
                    _this._receive(message);
                });
            }, function(){ //TODO error callback
                _this._login();
            });
            this._stomp = stomp;
        },
        //接收并处理websocket数据
        _receive: function(message){
            if(!message.body){
                OJS.console.error('received a empty message！');
            }else{
                var body = $.parseJSON(message.body);
                switch(body.type){
                    //错误、响应
                    case 0:
                        break;
                    //在线状态变更
                    case 1:
                        this._onlineStatusChanged(body.data);
                        break;
                    //传感器数据
                    case 2:
                        this._sensorDataReceived(body.data.body);
                        break;
                    //事件
                    case 3:
                        break;
                    case 4: //硬件的sdk收到了命令
                        notifyManager.notifyResponsed(body.data);
                        break;
                    case 5: //硬件的客户程序发回了反馈
                        break;
                    //命令下发成功
                    case 6:
                        notifyManager.notifySended(body.data);
                        break;
                }
            }
        },
        _onlineStatusChanged: function(data){
            OJS._eventManager.trigger(OJS.EVENTS.netWorkStatusChange, data);
            if(data.online == true){
                OJS.device.onlineStatus = 1;
                OJS.console.log('Device is online!');
            }else{
                OJS.device.onlineStatus = 0;
                OJS.console.log('Device is offline!');
            }
        },
        _sensorDataReceived: function(data){
            OJS._eventManager.trigger(OJS.EVENTS.deviceStatusChange, data);
            for(var sensorName in data){
                dataManager.setData(sensorName, data[sensorName]);
            }
        }
    };
    if(OJS._readyManager.isReady('app')){ //app已经准备好，deviceid和token已经获取到
        realtime._login();
    }else{
        var event = {};
        event[OJS.EVENTS.readyManager.app] = function(){
            realtime._login();
        };
        OJS._eventManager.bind(event);
    }
    device.realtime = realtime;
    OJS.device = device;
})();