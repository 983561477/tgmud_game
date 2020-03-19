// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：get_combat_skills
// 参数：不填
// 描述：获取战斗技能
// 值：见下方

// -----------------分隔符------------------


// 获取战斗成员自己本身
var member = CombatCMD.getCombatMember();
// 获取所有技能
// var skills = member.getCombatSkills();
// 获得所有技能的随机技能排序
var skills = member.getRandomCombatSkills();
// 推送至前端的战斗技能
var combat_skills = new Array();
// 准备技能数目
var skill_prepare_num = 0;
// 清除原先战斗技能
// member.clearSkill();

// 遍历获取战斗技能
for(var i = 0; i < skills.length; i++){
	var skill = skills[i];
	// 获取技能是否准备
	var value = skill.getAttr("is_prepare");
	// 如果准备了
	if(value == 1 && skill_prepare_num < 6){
		// 填充准备技能
		combat_skills[skill_prepare_num] = skill;
		// 技能准备数目加1
		skill_prepare_num++;
	}
}

// 推送技能到前端
member.pushSkill("combat_skills", combat_skills);