﻿// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：open_auto_combat
// 参数：不填
// 描述：开启自动战斗
// 值：见下方

// -----------------分隔符------------------

// 获取自身的member
var member = CombatCMD.getCombatMember();
// 开启自动战斗模式
member.startTimer("auto_combat_cd");