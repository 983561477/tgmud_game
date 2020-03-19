// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：consume_combat_cd
// 参数：combat_skill_consume_cd
// 描述：技能消耗战斗cd
// 值：见下方

// -----------------分隔符------------------

// 当前战斗cd
var now_combat_cd;
// 消耗技能cd后剩余的战斗cd
var residue_combat_cd;

// 获取自身的member
var member = CombatCMD.getCombatMember();
// 获取当前的战斗cd
now_combat_cd = member.getTimerValue("CD", "combat_cd");
// 判断当前战斗cd是否大于需要消耗的cd
if(now_combat_cd >= combat_skill_consume_cd){
	// 计算剩余战斗cd
	residue_combat_cd = now_combat_cd - combat_skill_consume_cd;
	print("residue_combat_cd: " + residue_combat_cd);
}
// 战斗cd不足
else{
	member.send("{\"提示\":\"气力不足！\"}");
}

// 赋值消耗后的战斗cd
member.setTimerValue("CD", "combat_cd", residue_combat_cd);