function quesheng(){//缺省页面的展示函数 内容区的外壳得叫 transp_box
    if($(".transp_box").children().length<1){
        $(".transp_box").addClass("hidden");
        $("#default_page").removeClass("hidden");
    }
}
//如果没东西可以加载 提示用户已经到底啦！
function remove_ani(aaa){
    if(data.DataList.length>0){
        $('.load_animation').html('');
    }else{
        $('.load_animation').html("<div class='no_more'>已经到底啦！</div>");
    }
}
//解决IScrolld点击空白处输入框不失去焦点的问题
$(document).on("touchstart",function(){
    var input_e=$("input");
    var texta_e=$("textarea");
    input_e.blur();
    texta_e.blur();
});
//jquery插件群
//给JQ 的数组添加every方法
$.fn.every = function(callback) {
    var result = true;
    var self = this;
    this.each(function(index, element) {
        if(!callback(index, element, self)) {
            result = false;
            return false;
        }
    });
    return result;
};
//textarea自动高度
$.fn.autoHeight = function () {
    function autoHeight(elem) {
        elem.style.height = 'auto';
        elem.scrollTop = 0; //防抖动
        elem.style.height = elem.scrollHeight + 'px';
        myScroll.refresh();//重写myScroll的高度
    }

    this.each(function () {
        autoHeight(this);
        $(this).on('keyup', function () {
            autoHeight(this);
        });
    });
};

//requireAnimationFrame的引入
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    } 
}());
/*焦点图*/
function swiper(){
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        loop: true,
        autoplay: 4000,
        autoplayDisableOnInteraction : false
    });   
    return swiper;
}

// Iscroll使用
function isPassive() {
    var supportsPassiveOption = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true;
            }
        }));
    } catch(e) {}
    return supportsPassiveOption;
}
//IScroll初始化.........................................》》》
var myScroll;
myScroll = new IScroll('#wrapper', {//IScroll实例化与IScroll配置
	scrollbars: false,//隐藏滚动条
	mouseWheel: true,
	interactiveScrollbars: false,
	shrinkScrollbars: 'scale',
	fadeScrollbars: true,
    preventDefault:false,
	click:true,//可使用click
	probeType: 3,//可使用方法scrollto
});
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
	capture: false,
	passive: false
} : false);



// 解决Isrcoll的refresh问题
function help_refresh(){
    var a=myScroll.maxScrollY-document.getElementById("wrapper").offsetHeight;
    var b=-document.getElementById("scroller").offsetHeight;
    if(a!=b){
        myScroll.refresh();
    }
}
//回到顶部按钮 给带有导航的btnbox用
$("#totop").on("touchstart",function(){
    to_top();
});
function to_top(){//点击 回到顶部
    myScroll.scrollTo(0, 0, 1, IScroll.utils.ease.elastic);
    setTimeout(function(){
        myScroll.scrollTo(0, 0, 1, IScroll.utils.ease.elastic);
        $(".btn_box").css({"transform":"translateY(50px)"});
    },1);    
}
//回到顶部按钮2 给没有导航的btnbox用
$("#totop2").on("touchstart",function(){
    to_top_2();
});
function to_top_2(){//点击 回到顶部
    myScroll.scrollTo(0, 0, 1, IScroll.utils.ease.elastic);
    setTimeout(function(){
        myScroll.scrollTo(0, 0, 1, IScroll.utils.ease.elastic);
        $(".btn_box").css({"transform":"translateY(98px)"});
    },1);  
} 
function btnbox_nav(){//给带有导航的btnbox用 显示回到顶部按钮
    if(myScroll.y<-425){
        $(".btn_box").css({"transform":"translateY(0)"});
    }else{
        $(".btn_box").css({"transform":"translateY(50px)"});
    }
}
function btnbox(){//给没有导航的btnbox用 显示回到顶部按钮
    if(myScroll.y<-425){
        $(".btn_box").css({"transform":"translateY(50px)"});
    }else{
        $(".btn_box").css({"transform":"translateY(98px)"});
    }
}
/*领券首页*/
function searchScroll(){//搜索条变色
    if(myScroll.y<-150){
        $(".head_flexbox").addClass("white_search");
        $(".head_flexbox").removeClass("black_search");
        $(".inbox").addClass("noop");
        $(".inbox").removeClass("op");
        $(".to_sign").attr("src","img/sign_black.svg");
        $(".to_search").attr("src","img/search_black.svg");
    }else{
        $(".head_flexbox").addClass("black_search");
        $(".head_flexbox").removeClass("white_search");
        $(".inbox").addClass("op");
        $(".inbox").removeClass("noop");
        $(".to_sign").attr("src","img/sign_white.svg");
        $(".to_search").attr("src","img/search_white.svg");
    }
    
}

/*宝贝分类*/
function sort(){//展现 排序面板
    if($(".sort").attr("data-show")=="hide"){
        if($(".black_board").attr("data-show")=="hide"){
            $(".black_board").removeClass("hidden");
            $(".black_board").attr("data-show","show");
        }
        if($(".classfy_box").attr("data-show")=="show"){
            $(".classfy_box").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-168px)"});
        }
        $(".sort").removeClass("hidden").attr("data-show","show");
        $(".sort").animate({},0,function(){
            $(".sort").css({"transform":"translateY(-48px)"});
        });
    }else{
        $(".black_board").addClass("hidden").attr("data-show","hide");
        $(".sort").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-200px)"});
    }
}
function dife(){//展现 分类面板
    if($(".classfy_box").attr("data-show")=="hide"){
        if($(".black_board").attr("data-show")=="hide"){
            $(".black_board").removeClass("hidden");
            $(".black_board").attr("data-show","show");
        }
        if($(".sort").attr("data-show")=="show"){
            $(".sort").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-200px)"});
        }
        $(".classfy_box").removeClass("hidden").attr("data-show","show");
        $(".classfy_box").animate({},0,function(){
            $(".classfy_box").css({"transform":"translateY(-48px)"});
        });
    }else{
        $(".black_board").addClass("hidden").attr("data-show","hide");
        $(".classfy_box").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-168px)"});
    }
}
function close_board(){//点击黑色面板关闭 排序面板和分类面板
    $(".black_board").addClass("hidden");
    $(".black_board").attr("data-show","hide");
    if($(".classfy_box").attr("data-show")=="show"){
        $(".classfy_box").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-168px)"});
    }else{
        $(".sort").addClass("hidden").attr("data-show","hide").css({"transform":"translateY(-200px)"});
    }

}
/*点击客服，弹出客服二维码*/
function kefu(){
    $("#qrcode_bg").removeClass("hidden");
    $(".qrcode_box").removeClass("hidden");
    $(".qrcode_box").animate({},function(){
        $(".qrcode_box").css({"transform":"scale(1)","opacity":"1"});
    });
}
function close_qrcode(){
    $("#qrcode_bg").addClass("hidden");
    $(".qrcode_box").addClass("hidden");
    $(".qrcode_box").css({"transform":"scale(0.4)","opacity":"0"});
}
// $(".qrcode_box").click(close_qrcode);
// $(".qrcode_board").click(function(e){
//     e.stopPropagation();
// });
$(".qrcode_board .close_2").click(close_qrcode);
//星星 月亮 太阳等级显示
function levelPic(level){
    var lv=level;
    var pic1="<li><img src='img/level_star.svg'></li>";
    var pic2="<li><img src='img/level_moon.svg'></li>";
    var pic3="<li><img src='img/level_sun.svg'></li>";
    $(".lenum").html(lv);
    var lvs=parseInt(lv,10).toString(3).split("");
    if(lvs.length>2){
        $(".level").append(pic3);
    }else if(lvs.length==2){
        for(i=0;i<parseInt(lvs[0]);i++){
            $(".level").append(pic2);
        }
        for(y=0;y<parseInt(lvs[1]);y++){
            $(".level").append(pic1);
        }
    }else{
        for(y=0;y<parseInt(lvs[0]);y++){
            $(".level").append(pic1);
        }
    }   
}

/*各类面板插件*/

//简单提示面板
function eazy_tips(tips_string,time,fun){//参数 提示内容（字符串 必填） 提示持续时间（数字 选填） 提示结束后执行的函数（函数 选填）
    var arglen=arguments.length;
    $("#eazy_tips p").html(tips_string);
    $("#eazy_tips").removeClass("hidden");
    if(arglen==1){
        setTimeout(function(){
            $("#eazy_tips").addClass("hidden");
        },1500);
    }
    if(arglen>=2){
        setTimeout(function(){
            $("#eazy_tips").addClass("hidden");
        },time);
    }
    if(arglen>=3){
        $("#eazy_tips p").html(tips_string);
        setTimeout(function(){
            fun();
        },time+10);
    }
}

//加载动画面板封装函数
function loading_show(board1){//board1 提示内容（字符串 必填）
     $("#loading_animate p").html(board1);
     $("#loading_animate").removeClass("hidden");
}
function loading_hidden(){
     $("#loading_animate").addClass("hidden");
}
//打勾动画封装函数
function tick_show(board2,executor){//board2 提示内容（字符串 必填）；executor 动画执行后要执行的函数（函数 选填）
    $("#tick_animate p").html(board2);
    $("#tick_animate").removeClass("hidden");
    $("#tick_animate .tick_animate_flex img").attr("src","img/tick_animate.gif");
    var arglen=arguments.length;
    setTimeout(function(){
        $("#tick_animate").addClass("hidden");
        $("#tick_animate .tick_animate_flex img").attr("src","");
        /*回到地址管理页面*/
        if(arglen>1){
           executor(); 
        }
    },1100);
}
//提示面板封装函数
function tips_board(tips_string){//参数依次为：提示文本(字符串)
    $("#tips_board .btn").off("touchstart");
    $("#tips_board").removeClass("hidden");
    $("#tips_board .tips").html(tips_string);
    $("#tips_board .btn").on("touchstart",function(){
        $("#tips_board").addClass("hidden");
    });
}
//警告面板封装函数
function warn_board(tips_string,btn2_f,btn1_name,btn2_name){//参数依次为：提示文本(字符串 必填) 按钮2函数(函数 必填) 按钮1名字(字符串) 按钮2名字(字符串) 
    $("#warn_board .rl_box div").off("touchstart");
    $("#warn_board").removeClass("hidden");
    $("#warn_board .tips").html(tips_string);
    $("#warn_board .rl_box div").eq(0).on("touchstart",function(){
        $("#warn_board").addClass("hidden");
    });
    $("#warn_board .rl_box div").eq(1).on("touchstart",function(){
        $("#warn_board").addClass("hidden");
        btn2_f();
    });
    if(arguments.length<3)
    return;
    $("#warn_board .btn:eq(0)").html(btn1_name);
    if(arguments.length<4)
    return;
    $("#warn_board .btn:eq(1)").html(btn2_name);
}
//单选按钮插件//例子在AddExtension.html页面
function allen_radio(rad){//单选按钮插件 传入参数rad(点击对象的this赋值给rad)
    var ind=$(rad).index(".allen_form .allen_radio_label");
    $('.allen_radio').removeClass("allen_radio_current").eq(ind).addClass("allen_radio_current");
    return ind;
}
//简单的内容是否填写判断
function simple_input_tips(from){// from参数(提交哪个dom节点下的表单)  返回结果为true(内容都有填写) false(有部分内容没填写)
    var inputs=from.find("input");
    var textareas=from.find("textarea");
    var a,b;
    if(inputs.length){
        a=inputs.every(function(i,e){
            return !($(e).val().trim()=="");
        });
    }else{
        a=true;
    }
    if(textareas.length){
        b=inputs.every(function(i,e){
            return !($(e).val().trim()=="");
        });
    }else{
        b=true;
    }
    return a && b;
}