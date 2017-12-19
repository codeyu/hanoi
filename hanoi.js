/**
			思路:
				将所有的位置变化存储到一个数组，算法执行速度很快，最后在执行动画
		**/
		var Hnt = (function(){
			var Hnt = {};
			
			//存储动画的数组
			var movie = new Array();
			//动画的顺序
			var order = 0;
			
			//前台的日志输出
			var $txt = undefined;
			var $detaillog = undefined;
			
			//3个底座的数组
			Hnt.A = new Array();
			Hnt.B = new Array();
			Hnt.C = new Array();
			//3个底座的名字
			Hnt.A.name = 'A';
			Hnt.B.name = 'B';
			Hnt.C.name = 'C';
			//三个底座的顺序号
			Hnt.A.val = 1;
			Hnt.B.val = 2;
			Hnt.C.val = 3;
			//底座的top值
			Hnt.defTop = 0;
			//盘子的高度
			Hnt.height = 0;
			
			//已经开始动画
			Hnt.isStart = false;
			//动画完成
			Hnt.complete = false;
			
			//日志对象赋值
			Hnt.setText = function(elem1,elem2){
				$txt = $(elem1);
				$detaillog = $(elem2);
			}
			//显示日志
			Hnt.showText = function(targ,str){
				if(targ!=undefined){
					targ.text(targ.text()+'\n'+str);
					targ.scrollTop(targ[0].scrollHeight);
				}
			}
			//清空日志
			Hnt.clearText = function(targ){
				if(targ!=undefined){
					targ.text('');
				}
			}
			
			//获取数组的下一个位置的top
			Hnt.getArrNextTop = function(arr){
				var length = arr.length;
				return Hnt.defTop - (length+1)*Hnt.height;
			}
			
			//获取数组的当前的top
			Hnt.getArrCurrTop = function(arr){
				var length = arr.length;
				if(length == 0){
					return Hnt.defTop;
				}
				else{
					return Hnt.defTop - (length)*Hnt.height;
				}
			}
			
			//默认属性
			Hnt.options = {
				speed:500,     //移动速度
				highlight:true,//移动过程是否变色
				color:'red',   //移动过程中变色
				xjg:250 	   //横向间隔 250px
			};
			
			/**
			 * _from  :从哪个位置 A,B,C
			 * _to    :到哪个位置 A,B,C
			 * options:参数
			 **/
			Hnt.movie = function(_from,_to,options){
				//获取当前对象的属性 - 判断盘子先上还是下，上下高度是多少...不遮挡
				if(_from.length==0){
					//没有可以移动的盘子
					console.err(_from.name+'中不存在可移动的盘子');
					return;
				}
				
				var opt = $.extend(Hnt.options,options);
				
				//获取当前的高度
				var _ftop = Hnt.getArrCurrTop(_from);
				//取出要移动的盘子
				var _felem = _from.pop();
				
				//获取目标位置高度
				var _ttop = Hnt.getArrNextTop(_to);
				//上面获取高度后，就可以将对象_felem放进去了
				_to.push(_felem);
				
				//计算两者间距
				var _jg = Math.abs(_from.val - _to.val);
				//通过_fx来表示方向
				var _fx = (_from.val - _to.val)>0?-1:1;
				//间距1为相邻，间距2为隔一个..隔一个的时候，需要考虑中间的高度，中间的必然是Hnt.B
				if(_jg == 1){
					//直接比较两者高度..
					if(_ftop == _ttop){
						//横着移动过去就OK
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg},
							options:opt
						});
					}
					else if(_ftop<_ttop){
						//横移
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg},
							options:opt,
							log:false
						});
						//下落
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{top:_ttop},
							options:opt
						});
					}
					else{
						//向上移动
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{top:_ttop},
							options:opt,
							log:false
						});
						//横移
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg},
							options:opt
						});
					}
				}
				else{
					//next - 因为要从B上面经过...
					var _btop = Hnt.getArrNextTop(Hnt.B);
					//获取最高值
					var _min = Math.min.call({},_btop,_ftop,_ttop);
					if(_min == _btop){
						if(_min<_ftop){
							//向上移动
							movie.push({
								elem:_felem,
								from:_from.name,
								to:_to.name,
								end:{top:_min},
								options:opt,
								log:false
							});
						}
						//横移
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg*2},
							options:opt
						});
						if(_min<_ttop){
							//下落
							movie.push({
								elem:_felem,
								from:_from.name,
								to:_to.name,
								end:{top:_ttop},
								options:opt,
								log:false
							});
						}
					}
					else if(_min == _ftop){
						//横移
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg*2},
							options:opt
						});
						if(_min<_ttop){
							//下落
							movie.push({
								elem:_felem,
								from:_from.name,
								to:_to.name,
								end:{top:_ttop},
								options:opt,
								log:false
							});
						}
					}
					else if(_min == _ttop){
						if(_min<_ftop){
							//向上移动
							movie.push({
								elem:_felem,
								from:_from.name,
								to:_to.name,
								end:{top:_min},
								options:opt,
								log:false
							});
						}
						//横移
						movie.push({
							elem:_felem,
							from:_from.name,
							to:_to.name,
							end:{left:_fx*opt.xjg*2},
							options:opt
						});
					}
				}
			}
			
			//该方法用于前台获取该数组，测试使用 - 实际代码中没有用到
			Hnt.getMovie = function(){
				return movie;
			}
			
			//播放动画
			function play(){
				if(!Hnt.isStart){
					alert('终止运行');
					return;
				}
				if(order<movie.length){
					var time = movie[order].options.speed;
					Hnt.movie.move(movie[order],order);
					order++;
					setTimeout(play,time<300?300:time);
				}
				else{
					setTimeout(function(){
						Hnt.complete = true;
						Hnt.showText($txt,'移动完成');
						Hnt.showText($txt,'结束时间:'+new Date().toLocaleTimeString());
						alert('移动完成!');
					},1000);
				}
			}
			
			//执行播放动画
			Hnt.movie.play = function(){
				if(movie.length>0&&order==0){
					//执行动画
					Hnt.showText($txt,'开始时间:'+new Date().toLocaleTimeString());
					play();
				}
			}
			
			//移动对象 - 动画
			Hnt.movie.move = function(param,order){
				if("top" in param.end){
					$(param.elem).animate({top:param.end.top},param.options.speed,function(){
						if('log' in param){
						
						}
						else{
							Hnt.showText($txt,param.from+' - > '+param.to);
						}
						Hnt.showText($detaillog,'order:'+order+'    elem:'+param.elem+' --\> top:'+param.end.top);
					});
				}
				else{
					$(param.elem).animate({left:'+='+param.end.left+'px'},param.options.speed,function(){
						if('log' in param){
						
						}
						else{
							Hnt.showText($txt,param.from+' - > '+param.to);
						}
						Hnt.showText($detaillog,'order:'+order+'    elem:'+param.elem+' --\> left:'+param.end.left);
					});
				}
			}
			
			//初始化
			//num : 盘子数量
			Hnt.initBlock = function(num){
				//清空原有内容
				$('#block').empty();
				//清空数组
				Hnt.A.length = 0;
				Hnt.B.length = 0;
				Hnt.C.length = 0;
				
				movie.length = 0;
				
				order = 0;
				
				Hnt.clearText($txt);
				Hnt.clearText($detaillog);
				Hnt.isStart = false;
				var opt = {
					maxWidth:180,
					minWidth:50,
					height:160,
					minHeight:5
				},	
				//起始坐标
				start = {top:180,left:60},
				_height,_width,_wstep;
				
				_height = opt.height/num;
				
				Hnt.defTop = start.top;
				Hnt.height = _height+1;
				
				if(start.top-num*(_height+1)<0){
					alert("输入的数量太大，以至于块的高度超出范围,请重试!");
					return;
				}
				
				_wstep = (opt.maxWidth - opt.minWidth)/(2*num);
				
				if(_wstep == 0){
					alert("输入的数量太大,以至于每个块的宽度差小于2px,请重试!");
					return;
				}
				
				//开始创建 - 数字小的在最上面
				for(var i = 0;i<num;i++){
					Hnt.createBlock(
					{
						order:(num-i),
						top:start.top-((i+1)*(_height+1)),
						left:(start.left+_wstep*i),
						height:_height,
						width:opt.maxWidth - i*2*_wstep
					});
				}			
			}
			
			//创建盘子
			Hnt.createBlock = function(position){
				$('<div>').addClass('block')
					  .addClass('bl'+position.order)
					  .css({
						top:position.top,
						left:position.left,
						height:position.height,
						width:position.width
						})
					  .appendTo($('#block'));

				Hnt.A.push('.bl'+position.order);
			}
			//开始
			Hnt.start = function(n){
				Hnt.move(n,Hnt.A,Hnt.B,Hnt.C);
			};
			
			//汉诺塔移动算法
			Hnt.move = function(n,a,b,c){
				if(n>=1){
					Hnt.move(n-1,a,c,b);
					Hnt.movie(a,c,{});
					Hnt.move(n-1,b,a,c);
				}
			}
			
			//返回该对象
			return Hnt;
		})();
		

		$(function(){
			//设置日志对象
			Hnt.setText('#txtlog','#detaillog');
			//开始
			$('#start').click(function(){
				if(!Hnt.isStart){
					Hnt.isStart = true;
					Hnt.start($('#num').val());		
					Hnt.movie.play();
				}
			});
			//初始化
			$('#init').click(function(){
				Hnt.initBlock($('#num').val());		
			});

			//数字正则
			var regx = /[1-9]+[0-9]*/g
			//改变时间
			$('#speed').change(function(){
				if(regx.test(this.value)){
					if(this.value>=100&&this.value<=10000){
						//ok
						Hnt.options.speed = this.value;
					}
					else{
						alert('请输入100到10000之间的整数');
						return;	
					}
				}
				else{
					alert('请输入100到10000之间的整数');
					return;
				}
			});
		});