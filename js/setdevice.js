//需要预加载的图片
var imgsrc=[
    {id:"dial.png",src:"img/dial.png"},
    {id:"round",src:"img/round.png"}
];
var preload=new createjs.LoadQueue(false);
preload.loadManifest(imgsrc);


function allenbai(swi,times){
    //这两变量分别表示：masterSwitch是否开启推送开关，true表示开启；false表示关闭 timeSlot表示推送时间段，为一个对象，例：{0:true,1:true,2:true,3:true,4:true,5:true,6:true,7:true}
    var masterSwitch,timeSlot;
    if(swi===undefined){
        masterSwitch=true;
    }else{
        masterSwitch=swi;
    }
    timeSlot=times || {0:false,1:false,2:false,3:true,4:true,5:true,6:true,7:false};

    //图片加载完毕
    preload.on('complete',handfunc)

    function handfunc(){
        //公共变量区域
        var moneyRate=calculateRate();//该方法返回[rate,numTimes]...[黄金比例，时间段个数]
        var waveBo;//shape对象：波
        var fontRate;//shape对象:比例数字
        var shadeO;//shape对象：最外层控制canvas内的设置按钮是否可点击的遮罩层
        //搭设舞台
        var stage= new createjs.Stage("set_device");
        //绘制图形
        paint();
        //整合图层顺序，并画出图形
        function paint(){
            layer_greenActive();//画最底层的绿色渐变圆，并创建各个时间段的扇形按钮
            alpha_dial();//引入刻度、时间组成的的png图
            waveBo=wave();//绘制中心圆球里的波浪，并用Tween将波浪动起来
            fontRate=font(moneyRate[0]);//绘制圆球内的字体
            calculateBo();//计算奖金比例和用户设置的时间段个数，并更新波的高度和奖金比例的数字
            preventClickRound();//防止用户点击球中心部分时触发设置时间段事件
            shadeO=cantUse()//但推送关闭时，用户不可点击
            pushBtbn();//设置推送开关和其他非canvas对象的状态，并给开关按钮绑定事件

            createjs.Ticker.setFPS(30);
            createjs.Ticker.addEventListener("tick",function(){
                stage.update();
            })
            console.log("0100")
            $(window).bind('beforeunload',function(){
                postSet(masterSwitch,timeSlot);
            });
            /*window.onunload=function(){
                alert("close page");
            }*/
        }

        //推送开关按钮
        function pushBtbn(){
            var prompt=$("#wrapper .prompt");//提示推送时间越长，奖金比率越高
            var status=$(".switch_name span");//提示开关状态，已开启/已关闭
            var pushBtn=$(".push_switch .push_btn");//开关按钮容器 position:relative
            var btnImg=$(".push_switch .btn_img");//开关按钮（按钮图片）position:absolute;top:-3px;关闭在左边left:0;开启在右边left:30px;
            var tipsLabl=$(".tips_lable");
            /*if(masterSwitch){//这里暂时注释掉了，到时候记得改回来
                tipsLabl.show();
            }else{
                tipsLabl.hide();
            }*/

            //渲染开和关的各种状态
            function renderState(){
                //根据masterSwitch(主开关)的状态进行渲染
                if(masterSwitch){//主开关开启，开启推送
                    //console.log("aaaaaaaaaaa")
                    btnImg.css({"left":"30px"});
                    pushBtn.addClass("active");
                    status.text("已开启");
                    prompt.text("注：推送时间总时间越长，奖金比率越高");
                    shadeO.alpha=0;
                }else{//主开关关闭，关闭推送
                    btnImg.css({"left":"0"});
                    pushBtn.removeClass("active");
                    status.text("已关闭");
                    prompt.text("注：开启推送开关，可获得折扣商品信息和奖励金！");
                    shadeO.alpha=.6;
                }
            }
            renderState();
            $(".push_switch").on("click",function(){
                masterSwitch=!masterSwitch;
                renderState();
            });

        }

        //获得扇形按钮的蒙蔽，和点击区域
        function getHitArea(num){
            var rotateAngle=num*45;
            var bigRector=new createjs.Shape();
                bigRector.graphics
                .clear()
                .beginFill("rgba(47,47,56,1)")
                .moveTo(0,0)
                .lineTo(0,-47)
                .arc(0,0,141,Math.PI*3/2,Math.PI*7/4,false)
                .lineTo(0,0)
                .endFill();
            if(timeSlot[num]){
                bigRector.alpha=.01
            }else{
                bigRector.alpha=1
            }

            bigRector.x=188;
            bigRector.y=188;
            bigRector.rotation=rotateAngle;

            //绑定点击事件
            bigRector.addEventListener("click",function(){
                timeSlot[num]=!timeSlot[num];
                calculateBo();
                if(timeSlot[num]){
                    bigRector.alpha=.01
                }else{
                    bigRector.alpha=1
                }
            });
            return bigRector;
        }



        //图层1 绿色的active按钮  (注：图层index越小，越底部)
        function layer_greenActive(){
            var green_btn=new createjs.Container();
            stage.addChild(green_btn);
            var circle=new createjs.Shape();
            circle.graphics.beginLinearGradientFill(["#4fffb7","#36caca"],[0,1],-60,-120,60,120);
            circle.graphics.drawCircle(0,0,141);
            circle.x=188;
            circle.y=188;
            //circle.cache(0,0,141);
            //console.log(circle);
            //
            //下面是扇形按钮
            var sectorBtns=[]
            var temp;
            var i=0;
            for(;i<8;i++){
                temp=getHitArea(i)
                stage.addChild(temp);
                sectorBtns.push(temp);
            }

            green_btn.addChild(circle);
            
        }

        //仪表盘
        function alpha_dial(){
            var dialP=new createjs.Bitmap("img/dial.png");
            //dialP.setBounds(0,0,200,200);
            var bounds=dialP.getBounds();
            var scaleNX=375/bounds.width;
            var scaleNY=375/bounds.height;
            dialP.scaleX=scaleNX;
            dialP.scaleY=scaleNY;
            dialP.cache(0,0,bounds.width,bounds.height);
            stage.addChild(dialP);
        }

        /*
        //波浪 版本1
        function wave(){
            var circle=new createjs.Shape();
            var waveC=new createjs.Container;
            stage.addChild(waveC);
            circle.graphics
                .beginFill("#000000")
                .drawCircle(210,210,210)
                .endFill();
            circle.cache(-45,-45,586,586);
            //waveC.addChild(circle)

            var waveP=new createjs.Bitmap("img/bo.png");
            var bounds=waveP.getBounds();
            waveP.scaleX=.5;
            waveP.scaleY=.5;
            waveP.x=0;
            waveP.y=120;
            // console.log(bounds);
            // //dialP.cache(0,0,bounds.width,bounds.height);
            // waveP.filters=[
            //  new createjs.AlphaMaskFilter(circle.cacheCanvas)
            // ];

            waveP.cache(0,0,750,750);
            console.log(waveP)
            waveC.addChild(waveP);
        }
        */
        //计算波的高度，并改变波的高度
        function calculateBo(){
            moneyRate=calculateRate();
            var numTimes=moneyRate[1];

            //修改波的高度
            var boY=282-parseInt(numTimes*240/8);
            waveBo.y=boY;

            //修改“奖金比例”的数字
            fontRate.text=numTimes*12.5+"%";
            var bounds=fontRate.getBounds();
            fontRate.x=188-parseInt(bounds.width/2);
        }
        //计算奖金百分比
        function calculateRate(){
            var numTimes=0;//设置的时间段个数
            var rate=0;
            for(var i=0;i<8;i++){
                if(timeSlot[i]){
                    numTimes++;
                }
            }
            rate=numTimes*12.5;
            return [rate,numTimes]
        }
        //波浪 版本2
        function wave(){
            var boC=new createjs.Container();
            stage.addChild(boC);

            // //黑色的波为剪切蒙版
            // var bo=new createjs.Bitmap("img/bo2.png");
            // bo.scaleY=.5;
            // bo.scaleX=.5;
            // bo.x=0;
            // bo.y=150;//奖金0%时，为284;奖金为100%时，为66 ----- {66 ~ 284}
            // bo.cache(0,0,750,750);
            
            // var circle=new createjs.Shape();
            // circle.graphics
            //  .beginLinearGradientFill(["#f1940e","#ffde00"],[0,1],188,47,188,330)
            //  .drawCircle(188,188,105);
            // circle.filterss=[
            //  new createjs.AlphaMaskFilter(mybo.cacheCanvas)
            // ];
            // circle.cache(0,0,375,375);
            // stage.addChild(circle);
            
            
            //自己写波浪
            var mybo=new createjs.Shape();
            mybo.graphics
                .clear()
                .beginFill("rgba(0,0,0,.85)")
                .moveTo(0,20)
                // 偶数方案
                // .quadraticCurveTo(53,0,106,20)
                // .quadraticCurveTo(159,40,212,20)
                // .quadraticCurveTo(265,0,318,20)
                // .quadraticCurveTo(371,40,424,20)
                // .quadraticCurveTo(477,0,630,20)
                // 奇数方案
                .quadraticCurveTo(53,0,105,20)
                .quadraticCurveTo(158,40,210,20)
                .quadraticCurveTo(263,0,315,20)
                .quadraticCurveTo(368,40,420,20)
                .quadraticCurveTo(473,0,525,20)
                .lineTo(525,250)
                .lineTo(0,250)
                .lineTo(0,20)
                .endFill();
            mybo.x=-233;//{82...-233}
            mybo.y=160;//{ 282....42}%0到%100
            mybo.cache(0,0,525,250)//y{-200~40} x{0~315}
            //boC.addChild(mybo);
            var circle=new createjs.Bitmap("img/round.png");
            circle.x=82;
            circle.y=82;
            // circle.filters=[
            //  new createjs.AlphaMaskFilter(mybo.cacheCanvas)
            // ];
            //circle.cache(0,0,375,375);
            circle.mask=mybo;
            //boC.addChild(mybo);
            boC.addChild(circle);

            // var allen=new createjs.Shape();
            // allen.graphics
            //  .beginFill("red")
            //  .drawCircle(188,188,100);
            // stage.addChild(allen);
            
            //console.log(circle.mask);
            createjs.Tween.get(circle.mask,{loop:true})
                .to({x:-23},1400)
                .to({x:-233});

            return  mybo;
        }

        function font(num){
            var fontC=new createjs.Container();
            stage.addChild(fontC);
            var font1=new createjs.Text(num+"%","bold 44px Arial","#ffffff");
            var bounds1=font1.getBounds();
            font1.x=188-parseInt(bounds1.width/2);
            font1.y=160;
            font1.shadow=new createjs.Shadow("rgba(48, 40, 113, 0.71)",0,2,0);
            //console.log(font1)
            fontC.addChild(font1);

            var font2=new createjs.Text("奖金比例","20px Arial","#ffffff")
            var bounds2=font2.getBounds();
            font2.x=188-parseInt(bounds2.width/2);
            font2.y=220;
            fontC.addChild(font2);
            return font1;
        }

        //该圆是为了让点击表盘的点击面积减去该圆的面积
        function preventClickRound(){
            var round=new createjs.Shape();
            round.graphics
                .beginFill("rgba(255,255,255,.01)")
                .drawCircle(0,0,105);

            round.x=188;
            round.y=188;
            round.addEventListener("click",function(){
                //防止点击表盘中间部件，会触发旁边的设置按钮事件
            })

            stage.addChild(round);
        }

        function cantUse(){
            var round=new createjs.Shape();
            round.graphics
                .beginFill("rgba(26,26,26,1)")
                .drawCircle(188,188,141);
            round.alpha=0;  
            stage.addChild(round);
            round.addEventListener("click",function(){
                //阻止用户点击
            })
            return round;
        }

    }//dial.onload
}



//关闭前的ajax
function postSet(masterSwitch,timeSlot){
    $.ajax({
        type: "post",
        url: "",//小施请在这里写下地址
        data: { 
            masterSwitch: masterSwitch,
            timeSlot:timeSlot
        }
    });
}
/*
//这里的data大概是这个样子
{
   masterSwitch:true,//true表示打开推送开关
   timeSlot:{
        0:false,//0表示0点到凌晨3点的时间段，false表示关闭该时间段的推送
        1:false,//1表示3点到凌晨6点的时间段，false表示关闭该时间段的推送
        2:false,//2表示6点到9点的时间段，false表示关闭该时间段的推送
        3:true,//3表示9点到12点的时间段，true表示开启该时间段的推送  ....以下配置，以此类推
        4:true,
        5:true,
        6:true,
        7:false
   }
}
*/