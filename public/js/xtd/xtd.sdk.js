try {
	window.XTD || (function(window) {
		var apply = Function.prototype.apply;

        function bindContext(fn, thisArg) {
            return function _sdkBound() {
                return apply.call(fn, thisArg, arguments);
            };
        }
        var global = {
            __type: 'JS_SDK_SANDBOX',
            window: window,
            document: window.document,
			method: {
				GET: 'GET',
				POST: 'POST',
				POSTFILE: 'POSTFILE',
				PUT: 'PUT',
				DELETE: 'DELETE',
			}
        };
        var sandboxWhitelist = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
        for (var i = 0; i < sandboxWhitelist.length; i++) {
            global[sandboxWhitelist[i]] = bindContext(window[sandboxWhitelist[i]], window);
        }
		return (function() {
            var self = window;
            var __DEV__ = 0;
            var undefined;
			var appCode = null;
			var glossaries = null;
			var apiUrl = BASE_URL+'/api';
			var config = {
				appId: '',
				version: '1.0',
				secret: ''
			};

			$.ajax({
				url: BASE_URL+"/js/static-glossaries",
				async: false
			}).done(function (data) {
				glossaries = data;
			});
			
            function emptyFunction() {};
			
			this.init = function (o) {
				config = o
				var ac = this.getCookie('appCode');
				if (ac != '') {
					appCode = ac;
				}
			};
			
			this.api = function (p, m, o, cb) {
				if (typeof o === 'function') {
					cb = o;
					o = null;
				}
				if (typeof m === 'function') {
					cb = m;
					m = global.method.GET;
				}
				if (!m)
				{
					m = global.method.GET;
				}
				var processData = true;
				var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
				if (m == global.method.POSTFILE) {
					processData = false;
					contentType = false;
					m = global.method.POST;
				}
				var req = $.ajax({
					url: apiUrl+p,
					type: m,
					processData: processData,
					contentType: contentType,
					data: o,
					beforeSend: function(xhr){
						xhr.setRequestHeader('X-XTD-APP-ID', config.appId);
						xhr.setRequestHeader('X-XTD-APP-VERSION', config.version);
						xhr.setRequestHeader('X-XTD-APP-SECRET', config.secret);
						xhr.setRequestHeader('X-XTD-AUTH-HEADER', appCode);
					},
				});
				req.done(function (ro) {
					if (typeof cb === 'function') {
						try {
							if (typeof ro === 'string' || myVar instanceof String) {
								ro = JSON.parse(ro);
							}
						} catch (e) { console.log(ro); console.log(e); }
						if (window.location.href.indexOf(URL_SIGNIN) < 0) {
							if ((ro.response) && (ro.response.code.toString().indexOf('403') >= 0 || ro.response.code.toString() == '0010001')) {
								//if ((ro.response) && (ro.response.code.toString().indexOf('403') >= 0)) {
								//this.logout();
								//location.href = URL_SIGNIN;
							}
						}
						cb(ro);
					}
				});
				req.fail(function (xhr, s) {
					alert(s);
				});
			};
			
			this.syncApi = function (p, m, o, cb) {
				if (typeof o === 'function') {
					cb = o;
					if (typeof o === 'object') {
						o = m;
						m = global.method.GET;
					} else if (typeof o === 'string') {
						o = null;
					}
				}
				if (typeof m === 'function') {
					cb = m;
					m = global.method.GET;
				}
				if (!m)
				{
					m = global.method.GET;
				}
				var req = $.ajax({
					url: apiUrl+p,
					type: m,
					data: o,
					async: false,
					beforeSend: function(xhr){
						xhr.setRequestHeader('X-XTD-APP-ID', config.appId);
						xhr.setRequestHeader('X-XTD-APP-VERSION', config.version);
						xhr.setRequestHeader('X-XTD-APP-SECRET', config.secret);
						xhr.setRequestHeader('X-XTD-AUTH-HEADER', appCode);
					},
				});
				req.done(function (ro) {
					if (typeof cb === 'function') {
						try {
							if (typeof ro === 'string' || myVar instanceof String) {
								ro = JSON.parse(ro);
							}
						} catch (e) { console.log(ro); console.log(e); }
						if ((ro.response) && ro.response.code.toString().indexOf('403') >= 0) {
							location.href = URL_SIGNIN;
						}
						cb(ro);
					}
				});
				req.fail(function (xhr, s) {
					alert(s);
				});
			};
			
			this.getLoginStatus = function (cb) {
				this.__checkAuthResponse(cb);
			};
			
			this.login = function (o, cb) {
				$this = this;
				this.api('/me/login', global.method.POST, o, function (r) {
					if (r.result){
						appCode = r.result;
						r.result = true;
						$this.setCookie('appCode', appCode, 7);
					}
					if (cb) {
						if (typeof cb === 'function') {
							cb(r);
						};
					}
				});
			};
			
			this.logout = function (cb) {
				$this = this;
				this.api('/me/logout', global.method.POST, null, function (r) {
					$this.setCookie('me.profile', '', -7);
					$this.setCookie('folders', '', -7);
					$this.setCookie('groups', '', -7);
					$this.setCookie('appCode', '', -7);
					$this.clearStore();
					
					if (cb) {
						if (typeof cb === 'function') {
							cb();
						};
					}
				});
			};
			
			this.__checkAuthResponse = function (cb) {
				this.api('/me/getLoginStatus', global.method.POST, null, function (r) {
					if (cb) {
						if (typeof cb === 'function') {
							cb(r);
						};
					}
				});
			};
			
			this.clearStore = function() {
				localStorage.clear();
			}
			
			this.setStore = function(cname, cvalue) {
				localStorage.setItem(cname, cvalue);
			}
			
			this.getStore = function(cname) {
				return localStorage.getItem(cname);
			}
			
			this.setCookie = function (cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
			}

			this.getCookie = function (cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			}
			
			this.__ = function(content_key, group) {
				//console.log(content_key, group);
				//console.log(glossaries);
				if (glossaries) {
					if (group) {
						if (glossaries[group][content_key]) {
							//console.log('a'+glossaries[group][content_key]);
							return glossaries[group][content_key];
						}
					} else if (glossaries[content_key]) {
						//console.log('b'+glossaries[content_key]);
						return glossaries[content_key];
					}
				}
				return content_key;
			};
			
			this.translate = function(content) {
				$this = this;
				var elements = content.find(".multi-lang");
				elements.each (function (index, element) {
					var group = $(element).data('lang-group');
					$(element).html($this.__($(element).html().trim()));
					if ($(element).attr('placeholder')) {
						$(element).attr('placeholder', $this.__($(element).attr('placeholder').trim()));
					}
				});
			};
			
			this.is = function(type, obj) {
				var clas = Object.prototype.toString.call(obj).slice(8, -1);
				console.log($.type(obj));
				//console.log(typeof obj);
				//console.log(obj instanceof XTD.controls.EditableSingleline);
				return obj !== undefined && obj !== null && clas === type;
			}

			window.XTD = this;
			
        }).call(global);
    })(window.inDapIF ? parent.window : window);
} catch (e) {
    console.log(e);
}

