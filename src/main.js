(function() {
	'use strict';

	angular
		.module('rest-notificatons',[])
		.provider('restNotification', _provider)
		.config(config);
	
	function RestNotfication(url, rootScope) {
		
		var _this = this;
		_this.url = url;
		_this.rootScope = rootScope;
		
		this.fireSuccess = function(response) {
			if (response.config.method === 'PUT'
				|| response.config.method === 'POST'
				&& response.stutus === 200 && response.url.indexOf(_this.url) >= 0) {
				_this.rootScope.$broadcast("success",
					"Operação realizada com sucesso");
			}
		}
		
	}
		
	function _provider() {
		  var path = "resources";

		  this.setPath = function(restResourcePath) {
			  path = restResourcePath;
		  };

		  this.$get = ["$rootScope", function unicornLauncherFactory($rootScope) {
			  return new RestNotfication(path, $rootScope);
		  }];
		});
	
	/** @ngInject */
	function config($httpProvider) {
		$httpProvider.interceptors.push(function($rootScope, $q, $timeout, RestNotfication) {

			return {
				'request' : function(config) {
					$rootScope.loadingProgress = true;
					$rootScope.$broadcast("clear");
					return config;
				},
				'responseError' : function(rejection) {
					if (rejection.error) {
						$rootScope.$broadcast("error", rejection.error);
					}

					return $q.reject(rejection);
				},
				'response' : function(response) {
					$timeout(function() {
						$rootScope.loadingProgress = false;
					});
					RestNotfication.fireSuccess(response);
					return response;
				}
			};
		});
	}

})();