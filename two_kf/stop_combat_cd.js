// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：stop_combat_cd
// 参数：不填
// 描述：停止自己的战斗cd
// 值：见下方

// -----------------分隔符------------------

// 获取自身的member
var member = CombatCMD.getCombatMember();
// 停止调用战斗CD
member.stopTimer("CD");