// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：get_skill_style
// 参数：combat_skill_id
// 描述：获取对应技能的招式
// 值：见下方

// -----------------分隔符------------------


// 战斗是否结束
// combat_status == 0 战斗结束
// combat_status == 1 战斗继续
var combat_status;
// 友队
var friend_army;
// 敌队
var enemy_army;
// 被选中的敌人ident
var selected_enemy_ident;
// 被选中的敌人name
var selected_enemy_name;

// 推送至前端的战斗技能招式
// var combat_skill_style = new Array();
// 战斗数据
var combat_info;
// 选定的战斗技能招式
var combat_skill_style;
// 选定的战斗技能招式描述
var combat_skill_style_introduce;
// 选定的战斗技能招式描述
var combat_skill_style_coefficient;
// 技能招式的伤害
var combat_skill_style_harm;
// 是否破防
var is_break_defense;
// 对敌人造成的伤害
var selected_enemy_harmed;
// 是否死亡
var is_death;


// 获取战斗成员自己本身
var self_member = CombatCMD.getCombatMember();
// 获取自身所在的战斗平台编号
var combat_no = CombatCMD.getCombatNO();
//print("combat_no: " + combat_no);
// 获取自身所在的战斗队伍编号
var self_army_no = CombatCMD.getArmyNO();
// print("self_army_no: " + self_army_no);
// 获取自身的ident
var self_ident = self_member.getAttr("ident");
// print("self_ident: " + self_ident);
// 获取自身的name
var self_name = self_member.getAttr("name");
// print("self_name: " + self_name);
// 获取对应技能的随机排序招式
var combat_skill_styles = self_member.getRandomCombatSkills(combat_skill_id);
// 判断技能招式长度
// print("combat_skill_styles.length : " + combat_skill_styles.length);
if(combat_skill_styles.length >= 1){
	// 选取第一个技能招式
	combat_skill_style = combat_skill_styles[0];
	// 获取第一个技能招式的描述
	combat_skill_style_introduce = combat_skill_style.getAttr("introduce");
	// print("combat_skill_style_introduce: " + combat_skill_style_introduce);
	// 获取第一个技能招式的系数
	combat_skill_style_coefficient = combat_skill_style.getAttr("coefficient");
	// print("combat_skill_style_coefficient: " + combat_skill_style_coefficient);
	// 获取自身的攻击力
	var self_member_attack = self_member.getAttr("attack");
	// print("self_member_attack: " + self_member_attack);
	// 计算该招式的伤害
	combat_skill_style_harm = self_member_attack * combat_skill_style_coefficient;
	// print("combat_skill_style_harm: " + combat_skill_style_harm);
}

// 获取自身的战斗平台
var combat = CombatCMD.getCombat();
// 获取当前战斗平台的所有队伍
var armys = combat.getArmys();
// 遍历战斗队伍
for(var i = 0; i < armys.length; i++){
	// 赋值遍历到的当前队伍
	var army = armys[i];
	// 获取当前队伍的编号
	var army_no = army.getArmyNO();
	// 判断是否是友队编号 是 即该队为友队
	if(self_army_no == army_no){
		// 当前队伍为友队
		friend_army = army;
	}
	// 敌对
	else{
		// 当前队伍为敌对
		enemy_army = army;
		// 获取随机排序的敌对成员
		var enemy_members = enemy_army.getRandomMembers();
		// 选择第一个
		var selected_enemy_member = enemy_members[0];
		// 获取被选中敌人的ident
		selected_enemy_ident = selected_enemy_member.getAttr("ident");
		// print("selected_enemy_ident: " + selected_enemy_ident);
		// 获取被选中敌人的name
		selected_enemy_name = selected_enemy_member.getAttr("name");
		// print("selected_enemy_name: " + selected_enemy_name);
		// 获取该敌对成员的当前血量
		var enemy_member_now_hp = selected_enemy_member.getAttr("now_hp");
		// print("enemy_member_now_hp: " + enemy_member_now_hp);
		// 获取该敌对成员的防御力
		var enemy_member_defense = selected_enemy_member.getAttr("defense");
		// print("enemy_member_defense: " + enemy_member_defense);
		// 判断防御力是否大于伤害值
		if(enemy_member_defense >= combat_skill_style_harm){
			// 战斗继续
			combat_status = 1;
			// print("combat_status: " + combat_status);
			// 未打破防御
			is_break_defense = 0;
			// print("is_break_defense: " + is_break_defense);
		}
		else{
			// 打破防御
			is_break_defense = 1;
			// print("is_break_defense: " + is_break_defense);
			// 计算伤害
			selected_enemy_harmed = combat_skill_style_harm - enemy_member_defense;
			// print("selected_enemy_harmed: " + selected_enemy_harmed);
			// 判断是否死亡
			if(selected_enemy_harmed >= enemy_member_now_hp){
				// 被选中的敌人死亡
				is_death = 1;
				// print("is_death: " + is_death);
				// 被选中的敌人退出游戏
				enemy_army.removeMember(selected_enemy_ident);
				// 给自己发送战斗失败
				selected_enemy_member.send("{\"combat_feedback\":\"-4\"}");
				// 获取敌对成员的个数
				var enemy_members = enemy_army.getMembers();
				// print("enemy_members.length: " + enemy_members);
				// 如果人数为0
				if(enemy_members.length == 0){
					// 战斗结束
					combat_status = 0;
					// print("combat_status: " + combat_status);
				}
				else{
					// 战斗继续
					combat_status = 1;
					// print("combat_status: " + combat_status);
				}
			}
			else{
				// 被选中的敌人未死亡
				is_death = 0;
				// 战斗继续
				combat_status = 1;
				// print("is_death: " + is_death);
				// 减少该敌对成员的血量 后的剩余血量
				var enemy_member_residue_hp = enemy_member_now_hp - selected_enemy_harmed;
				// 修改该成员的血量
				selected_enemy_member.setAttr("now_hp", enemy_member_residue_hp);
				// var now_hp = selected_enemy_member.getAttr("now_hp");
				// print("now_hp: " + now_hp);
			}
		}
	}
}

// 给友队发送信息
// 获取友队的全部成员
var friend_members = friend_army.getMembers();
// 如果战斗继续
if(combat_status == 1){
	// 遍历友队发送信息
	for(var i = 0; i < friend_members.length; i++){
	// 遍历到的当前友队成员
	var friend_member = friend_members[i];
		// 获取该队友成员的ident
		var friend_ident = friend_member.getAttr("ident");
		// 如果不是自己
		if(friend_ident != self_ident){
			// 被选中的敌人被破防了
			if(is_break_defense == 1){
				// 被选中的敌人死亡
				if(is_death == 1){
					var message = "<p style='color:#2894FF'>友队--" + self_name + "对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害" + "<br>" + selected_enemy_name + "死亡<br></p>";
				}
				// 未死亡
				else{
					var message = "<p style='color:#2894FF'>友队--" + self_name + "对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害<br></p>";
				}
				// 发送消息 战斗状况
				friend_member.send("{\"combat_condition\":\""+message+"\"}");
			}
			// 未破防
			else{
				var message = "<p style='color:#2894FF'>友队--" + self_name + "对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>但未破防<br></p>";
				// 发送消息 战斗状况
				friend_member.send("{\"combat_condition\":\""+message+"\"}");
			}
		}
		// 成员是自己
		else{
			// 破防了
			if(is_break_defense == 1){
				// 被选中的敌人死亡
				if(is_death == 1){
					var message = "<p style='color:#2894FF'>你对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害" + "<br>" + selected_enemy_name + "死亡<br></p>";
				}
				// 未死亡
				else{
					var message = "<p style='color:#2894FF'>你对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害<br></p>";
				}
				// 发送消息 战斗状况
				friend_member.send("{\"combat_condition\":\""+message+"\"}");
			}
			// 未破防
			else{
				var message = "<p style='color:#2894FF'>你对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>但未破防<br></p>";
				// 发送消息 战斗状况
				friend_member.send("{\"combat_condition\":\""+message+"\"}");
			}
		}
	}
}
// 战斗结束
else{
	// 遍历友队发送信息
	for(var i = 0; i < friend_members.length; i++){
		// 遍历到的当前友队成员
		var friend_member = friend_members[i];
		// 战斗结束 胜利
		friend_member.send("{\"combat_feedback\":\"4\"}");
	}
	// 结束当前战斗平台
	CombatCMD.finishCombat(combat_no);
}

// 如果战斗继续
if(combat_status == 1){
	// 给敌队发送信息
	// 获取敌队的全部成员
	var enemy_members = enemy_army.getMembers();

	// 遍历敌队发送信息
	for(var i = 0; i < enemy_members.length; i++){
		// 遍历到的当前敌队成员
		var enemy_member = enemy_members[i];
		// 获取该敌队成员的ident
		var enemy_ident = enemy_member.getAttr("ident");;
		// 如果不是被选中的敌人
		if(enemy_ident != selected_enemy_ident){
			// 被选中的敌人被破防了
			if(is_break_defense == 1){
				// 被选中的敌人死亡
				if(is_death == 1){
					var message = "<p style='color:#FF5151'>敌队" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害" + "<br>" + selected_enemy_name + "死亡<br></p>";
				}
				// 未死亡
				else{
					var message = "<p style='color:#FF5151'>敌队" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害<br></p>";
				}
				// 发送消息 战斗状况
				enemy_member.send("{\"combat_condition\":\""+message+"\"}");
			}
			// 未破防
			else{
				var message = "<p style='color:#FF5151'>敌队--" + self_name + "对" + selected_enemy_name + "使用了" + combat_skill_style_introduce + "<br>但未破防<br></p>";
				// 发送消息 战斗状况
				enemy_member.send("{\"combat_condition\":\""+message+"\"}");
			}
		}
		// 被选中的敌人是 该成员
		else{
			// 破防了
			if(is_break_defense == 1){
				var message = "<p style='color:#FF5151'>敌队--" + self_name + "对你使用了" + combat_skill_style_introduce + "<br>造成了" + selected_enemy_harmed + "点伤害<br></p>";
				// 发送消息 战斗状况
				enemy_member.send("{\"combat_condition\":\""+message+"\"}");
			}
			// 未破防
			else{
				var message = "<p style='color:#FF5151'>敌队--" + self_name + "对你使用了" + combat_skill_style_introduce + "<br>但未破防<br></p>";
				// 发送消息 战斗状况
				enemy_member.send("{\"combat_condition\":\""+message+"\"}");
			}
		}
	}
	// 给战斗成员发送最新的战斗数据
	CombatCMD.pushCombatMembers(combat_no, "combat_members");
}