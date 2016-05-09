export function isWeixin () {
    return /micromessenger/i.test(window.navigator.userAgent);
}

export function isIOS () {
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
}

export function isAndroid () {
    return /android/i.test(window.navigator.userAgent);
}

export function resizeQiniuURL (params) {
    var query = '?imageView2/';

    query += params.cut ? '1/' : '2/';

    if (params.width) {
        query += 'w/' + parseInt(params.width) + '/';
    }

    if (params.height) {
        query += 'h/' + parseInt(params.height) + '/';
    }

    return params.url + query;
}

export function setWeixinShareConfig (config) {
    window.wx.ready(function () {
        [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ].forEach(function (api) {
            window.wx[api](config);
        });
    });
}

export function loginToWeixin () {
    window.location.href = 'http://party.wanmei.cn/api/session/weixin?callback=' + encodeURIComponent(window.location.href);
}

export function weixinUserSessionErrorHandler (err) {
    if (isNeedLoginError(err)) {
        loginToWeixin();
    } else {
        throw err;
    }
}

export function isNeedLoginError (err) {
    return !!(err && err.code === -330004);
}