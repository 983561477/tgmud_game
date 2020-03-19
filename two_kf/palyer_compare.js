// 位置：玩家按钮

// -----------------分隔符------------------

// 关键字：player_compare
// 参数：name, ident, feedback_name, feedback_ident
// 描述：切磋
// 值：见下方

// -----------------分隔符------------------

// name 		询问者的姓名
// ident 		询问者的ident
// feedback_name 	反馈者(被询问者)的姓名
// feedback_ident  反馈者(被询问者)的ident

// 给对手发送切磋邀请 
// status == 0  询问失败
// status == 1  询问成功

// 判断反馈者(被询问者)是否在战斗中
if(CombatCMD.isCombat(feedback_ident)) {
	// 反馈者(被询问者)在战斗中，发给自己(询问者)
	SystemCMD.send("{\"inquiry\":{\"category\": \"combat_compare\", \"status\": \"0\", \"feedback_name\":\""+feedback_name+"\"}}");
}
else{
	// 反馈者(被询问者)不在战斗中，发给反馈者(被询问者)
	SystemCMD.send("{\"inquiry\":{\"category\": \"combat_compare\", \"status\": \"1\", \"questioner_name\":\""+name+"\", \"questioner_ident\":\""+ident+"\"}}", feedback_ident)
}
