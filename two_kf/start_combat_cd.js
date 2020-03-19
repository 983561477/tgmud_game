// 位置：管理定时器->战斗相关

// -----------------分隔符------------------

// 关键字：start_combat_cd
// 参数：不填
// 描述：开始调用战斗cd
// 值：见下方

// -----------------分隔符------------------

// 获取自身的member
var member = CombatCMD.getCombatMember();
// 开始调用战斗CD
member.startTimer("CD");