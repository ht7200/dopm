$(function() {
	var $item1 = $('.mui-content .first-grid');
	var $item2 = $('.wrapBox .item:nth-child(2)');
	var $btn = $('.wrapBox .sendBtn');

	OJS.bindAppReady(function() {
		console.log('bindAppReady');
		notNetwork();
		//接收数据
		OJS.bindReady(function() {
			OJS.device.bindPushData({
				'deviceStatusChange': function(data) {

					//alert(JSON.stringify(data));

					var mode = function(data) {
						var tmode = '手动模式';
						if(data.ModeSelection == 1) {
							tmode = '家庭模式';
						}
						if(data.ModeSelection == 2) {
							tmode = '办公模式';
						}
						if(data.ModeSelection == 3) {
							tmode = '全自动模式';
						}
						if(data.ModeSelection == 4) {
							tmode = '自定义模式';
						}
						return tmode;
					}

					//OJS.app.toast(mode);

					//$item1.find('.status-mode').text(data.ModeSelection);
					$item1.find('.number-temp').text(data.CurrentTemperature);
					$item1.find('.tds').text('PH :' + data.TdsValue);
					$item1.find('.ph').text('TDS:' + data.PhValue + 'ppm');
				}
			});
		})
	})

	//下发函数
	function WLedSW_open() {
		if(OJS.device.onlineStatus == 1) {
			var o = {
					'WledOnOff': 1,
					'BledOnOff': 200,
					'ModeSelection': 200,
					'CustomizeSetWledPwm': 200,
					'CustomizeSetBledPwm': 200,
					'CustomizeStartTime': 200,
					'CustomizeStopTime': 200,
					'FamilyLightStart': 200,
					'OfficeLightStart': 200
				}
				//OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	function WLedSW_close() {
		if(OJS.device.onlineStatus == 1) {
			var o = {
					'WledOnOff': 0,
					'BledOnOff': 200,
					'ModeSelection': 200,
					'CustomizeSetWledPwm': 200,
					'CustomizeSetBledPwm': 200,
					'CustomizeStartTime': 200,
					'CustomizeStopTime': 200,
					'FamilyLightStart': 200,
					'OfficeLightStart': 200
				}
				////OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	function BLedSW_open() {
		if(OJS.device.onlineStatus == 1) {
			var o = {
					'WledOnOff': 200,
					'BledOnOff': 1,
					'ModeSelection': 200,
					'CustomizeSetWledPwm': 200,
					'CustomizeSetBledPwm': 200,
					'CustomizeStartTime': 200,
					'CustomizeStopTime': 200,
					'FamilyLightStart': 200,
					'OfficeLightStart': 200
				}
				//OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	function BLedSW_close() {
		if(OJS.device.onlineStatus == 1) {
			var o = {
					'WledOnOff': 200,
					'BledOnOff': 0,
					'ModeSelection': 200,
					'CustomizeSetWledPwm': 200,
					'CustomizeSetBledPwm': 200,
					'CustomizeStartTime': 200,
					'CustomizeStopTime': 200,
					'FamilyLightStart': 200,
					'OfficeLightStart': 200
				}
				////OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	function fnsetLed(cus, val) {

		if(cus == 'CustomizeSetWledPwm') {
			var o = {
				'WledOnOff': 200,
				'BledOnOff': 200,
				'ModeSelection': 200,
				'CustomizeSetWledPwm': val,
				'CustomizeSetBledPwm': 200,
				'CustomizeStartTime': 200,
				'CustomizeStopTime': 200,
				'FamilyLightStart': 200,
				'OfficeLightStart': 200
			}
		} else {
			var o = {
				'WledOnOff': 200,
				'BledOnOff': 200,
				'ModeSelection': 200,
				'CustomizeSetWledPwm': 200,
				'CustomizeSetBledPwm': val,
				'CustomizeStartTime': 200,
				'CustomizeStopTime': 200,
				'FamilyLightStart': 200,
				'OfficeLightStart': 200
			}
		}

		if(OJS.device.onlineStatus == 1) {
			//OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	function sendMode(ret) {
		if(OJS.device.onlineStatus == 1) {
			var o = {
					'WledOnOff': 200,
					'BledOnOff': 200,
					'ModeSelection': ret,
					'CustomizeSetWledPwm': 200,
					'CustomizeSetBledPwm': 200,
					'CustomizeStartTime': 200,
					'CustomizeStopTime': 200,
					'FamilyLightStart': 200,
					'OfficeLightStart': 200
				}
				//OJS.app.toast(o)
			var result = OJS.device.sendNotify(o, function() {
				//OJS.app.toast("命令已下发!")
			}, function() {
				//OJS.app.toast("设备收到命令!")
			});
			if(!result) {
				//OJS.app.toast("命令发送失败, 无法连接到服务器!")
			}
		} else {
			//OJS.app.toast("设备不在线，无法下发命令!")
			return false
		}
	}

	//网络监测
	function notNetwork() {
		setInterval(function() {
			OJS.app.hasNetWork(function(data) {
				if(data) {
					OJS.ui.hideOfflineMask();
					 //OJS.app.toast(data+'有网络');
				} else {
					OJS.ui.showOfflineMask();
					//OJS.app.toast(data+'无网络');
				}
			})
		}, 5000)
	}

	//监听input事件，获取range的value值，也可以直接element.value获取该range的值
	var rangeList = document.querySelectorAll('input[type="range"]');
	for(var i = 0, len = rangeList.length; i < len; i++) {
		rangeList[i].addEventListener('change', function() {
			if(this.id.indexOf('field') >= 0) {
				//不执行
				document.getElementById(this.id + '-input').value = this.value;
			} else {
				document.getElementById(this.id + '-val').innerHTML = '亮度:' + this.value + '%';
				fnsetLed(this.id, this.value); //设置某个进度条的亮度
				//alert(this.title + ', ' + this.value)
			}
		});
	}

	//主缸灯
	document.getElementById("main-light-switch").addEventListener("toggle", function(event) {
		//开关关闭时亮度不可调节且变灰
		if(event.detail.isActive) {
			document.getElementById("main-light").removeAttribute('disabled');
			document.getElementById("main-light-range").setAttribute('class', 'range');
		} else {
			document.getElementById("main-light").setAttribute('disabled', 'disabled');
			document.getElementById("main-light-range").setAttribute('class', 'range gray');
		}
		//数据处理
		if(event.detail.isActive) {
			WLedSW_open();
		} else {
			WLedSW_close();
		}
	});

	//蓝藻灯
	document.getElementById("sub-light-switch").addEventListener("toggle", function(event) {
		//开关关闭时亮度不可调节且变灰
		if(event.detail.isActive) {
			document.getElementById("sub-light").removeAttribute('disabled');
			document.getElementById("sub-light-range").setAttribute('class', 'range');
		} else {
			document.getElementById("sub-light").setAttribute('disabled', 'disabled');
			document.getElementById("sub-light-range").setAttribute('class', 'range gray');
		}
		//数据处理
		if(event.detail.isActive) {
			BLedSW_open();
		} else {
			BLedSW_close();
		}
	});

	//工作模式处理
	mui('.mui-input-group').on('change', 'input', function() {
		var mode_name = this.parentNode.getElementsByTagName('label')[0].innerText;
		document.getElementById('mode').innerHTML = mode_name;
		sendMode(this.title)
	});

});