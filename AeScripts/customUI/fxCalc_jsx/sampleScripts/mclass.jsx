function foo(v)
{
	//内部メンバ変数
	var a = v;		

	//公開される変数
	this.b = v;	

	//内部メンバ関数
	function disp_a1()
	{
		alert("disp_a1: " + a);
	}
	//公開される関数
	this.disp_a = function()
	{
		disp_a1();
	}
	this.disp_b = function()
	{
		alert("this.disp_b: " + this.b);
	}
	
}

var fooObj = new foo(2);

fooObj.disp_a();//初期値の２が表示される


fooObj.b = 20;	//内部変数へアクセス
fooObj.disp_b();//それを表示

//fooObj.disp_a1();	//これはエラーになる
//alert(fooObj.a);	//これは、undefinedが表示される

//fooObj.a = 100;	//無理やり内部メンバにアクセスしてもエラーにはならないが、
//fooObj.disp_a();	//アクセス出来ないので100と表示されない
