(function($){
	
 /**
  * 对于单个ajax请求的调用
  * 
  * 参数： 
  * url 为请求的地址，
  * data 为请求的参数,
  * type 为请求方式,
  * success 响应成功时的回调函数
  */
 $.ajaxquery=function(options){
	 var defaultOptions = {
	    		type:"POST",
	    		url:null,
	    		dataType:"json",
	    		data:null,
	    		isLoading:false,
	    		cache:false,
	    		async:true,
	    		success:null 
	    		
	    	};
	    	defaultOptions = $.extend(defaultOptions,options||{});
	    	 
	    	if(defaultOptions.isLoading)
	    		$.showProcessBar("请稍等","数据加载中，请稍等...");  //显示进度条
	    	if(options.data && options.data["data"]!=null){
	    		options.data["data"] =JSON.parse(options.data["data"]);
	    		delete_null_properties(options.data["data"]);
				options.data["data"]=strEnc(JSON.stringify(options.data["data"]),_des_key);
			}
	    	var timestamp=new Date().getTime();
	    	$.ajax({
	    		url:$.basePath()+"/formToken?_t=" + timestamp,
	    		success:function(formToken){
	    			$.ajax({
	    	    		type:defaultOptions.type,
	        			url:defaultOptions.url,
	        			dataType:defaultOptions.dataType,
	        			data:defaultOptions.data,
	        			cache:defaultOptions.cache,
	        			async:defaultOptions.async,
	        			headers:{formToken : formToken.token},
	        			success:function(msg){
	        				if(defaultOptions.isLoading){
	        					$.closeProcessBar();//关闭进度条
	        				} 
	        				//若description不为空且无传入success函数，则提示description的内容
	        				if(!isEmpty(msg) && !isEmpty(msg.description) && isEmpty(defaultOptions.success)){
	    						$.alert("提示", msg.description, "remind");
	        				}
	        				
	        				//下拉框、单选框、复选框在数据字典的取值
	        				if(!isEmpty(msg["rule"]) && !isEmpty(msg["rule"]["cdi"])){
	        					//下拉框在数据字典的取值
	        					setCombBox(msg["rule"]["cdi"]);
	        					//单选框、复选框在数据字典的取值
	        					setRadioCheckBox(msg["rule"]["cdi"]);
	        				}
	        				
	        				//显隐控制的处理
	        				if(!isEmpty(msg["rule"]) && !isEmpty(msg["rule"]["visit"])){
	        					setVisitMode(msg["rule"]["visit"]);
	        				}
	        				
	        				//数据赋值
	        				if(!isEmpty(msg["rule"]) && !isEmpty(msg["rule"]["data"])){
	        					setFieldValue(msg["rule"]["data"],msg["rule"]["cdgi"]);
	        				}
	        				
	        				//消息提示
	        				if(!isEmpty(msg["rule"]) && !isEmpty(msg["rule"]["message"])){
	        					setMessage(msg["rule"]["message"]);
	        				}
	        				
	        				//后台js脚本
	        				if(!isEmpty(msg["rule"]) && !isEmpty(msg["rule"]["script"])){
	        					handleScript(msg["rule"]["script"]);
	        				}
	        				
	        				
	        				if(defaultOptions.success!=null){
	        					defaultOptions.success(msg);
	        				}
	        				
	        			},
	        			error:function(XMLHttpRequest,text) {
	        				$.closeProcessBar();//关闭进度条
                            $.alert('出错了','请求后台出错.','failure');
	        			} 
	    	    		
	    	    	});
	    		}
	    	}) ;
	    	
		 };
		 $.ajaxSetup({
			    complete: function(xhr,status) {
			        var sessionStatus = xhr.status;
			        if(sessionStatus == 535 || sessionStatus == 0) {
			        	var top = window;
					     while(top != top.parent){
					    	 top = top.parent;
					     }
			             top.location.href = $.basePath() + '/login';           
			        }
			    }
			});
		 function delete_null_properties(dataStr){
				for (var i in dataStr) {
			        if (dataStr[i] === null||dataStr[i] === "") {
			            delete dataStr[i];
			        } else if (typeof dataStr[i] === 'object') {
			            delete_null_properties(dataStr[i]);
			        }
			    }
			};
})(jQuery);
