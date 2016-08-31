(function() {
	'use strict';

	angular
		.module('rest-notificatons',[])
		.config(config);

	/** @ngInject */
	function config($httpProvider) {
		$httpProvider.interceptors.push(function($rootScope, $q, $timeout) {

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
					if (response.config.method === 'PUT'
							|| response.config.method === 'POST'
							&& response.stutus === 200) {
						$rootScope.$broadcast("success",
								"Operação realizada com sucesso");
					}
					return response;
				}
			};
		});
	}

})();