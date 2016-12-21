/**
 * Created with PhpStorm.
 * Desc:
 * Author: limengjun
 * Date: 2016/7/12
 * Time: 9:57
 */
(function(){
    var $offLineMask = $('<div class="not-network" style="top:0"><div class="network"><h1>该设备已断开网络</h1><p>请将设备连上您的网络，您可以尝试以下操作：</p><ul><li>检查智能设备的电源是否插好。</li><li>检查家里的路由器是否成功连网，或尝试重启路由器。</li></ul></div></div>');
    OJS.ui = {
        navigationConfig: function(){},
        back: function(){
            history.back();
        },
        showOfflineMask: function(){
            $('body').append($offLineMask);
        },
        hideOfflineMask: function(){
            $offLineMask.remove();
        }
    };
})();