// 位置：管理定时器->战斗相关

// -----------------分隔符------------------

// 关键字：CD
// 参数：{"combat_cd":1}
// 描述：战斗中定时消耗气
// 时长(毫秒)：1000
// 值：见下方

// -----------------分隔符------------------

// 获取自身的member
var member = CombatCMD.getCombatMember();

// print("combat_cd: " + combat_cd);
member.send("{\"combat_cd\":\""+combat_cd+"\"}");
// 如果气数小于10
if(combat_cd < 10){
	combat_cd++;
}