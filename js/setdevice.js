(function(win,factory){
    window.allenCanvas=factory;
}(window,function(open){//open参数 true表示开启推送开关 false表示关闭推送开关 后面的参数表示用户的推送时间设置
    var args=arguments;
    //初始的开关情况
    var ini_open=args[0];
    //初始的时间段设置
    var ini_set=[];
    (function (){
        var len=args.length;
        var i=1;
        for(;i<len;i++){
            ini_set.push(args[i]);
        }
    }());

    
}));