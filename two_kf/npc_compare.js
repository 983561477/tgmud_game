// 位置：NPC按钮

// -----------------分隔符------------------

// 关键字：npc_compare
// 参数：ident, challenged_ident
// 描述：切磋
// 值：见下方

// -----------------分隔符------------------

// combat_feedback == -1  战斗结束
// combat_feedback == 0   自己处于非战斗中
// combat_feedback == 1   自己处于战斗中
// combat_feedback == 2   开始新的战斗
// combat_feedback == 3   自己中途成功加入友队的队伍
// combat_feedback == -3  自己需要加入的战斗队伍人数已满
// combat_feedback == 4   战斗胜利
// combat_feedback == -4  战斗失败

// join_status == 0 加入战斗失败
// join_status == 1 加入战斗成功
var join_status;
// 友队
var friend_army;
// 敌队
var enemy_army;
// 战斗平台编号
var combat_no;
// 友队编号
var friend_army_no;
// 成员是否自动战斗
var is_auto_combat;
// 自身
var self_member;
// 自身的姓名
var self_name;

// 判断自己是否处于战斗中
if(CombatCMD.isCombat()){
	// 自己在战斗中 类型为 1-自己处于战斗中
	SystemCMD.send("{\"combat_feedback\":\"1\"}");
}
// 自己不在战斗中
else{
	// 判断对手是否在战斗中
	if(CombatCMD.isCombat(challenged_ident)){
		// 获取对方的战斗平台
		var combat = CombatCMD.getCombat(challenged_ident);
		// 获取战斗平台编号
		combat_no = combat.getCombatNO();
		// print("combat_no: " + combat_no);
		// 如果战斗不为空
		if(combat != null){
			// 获取当前战斗平台所有战斗队伍（目前为A队和B队-目前页面只支持两队战斗）
			var armys = combat.getArmys();
			// 遍历战斗队伍
			for(var i = 0; i < armys.length; i++){
				// 赋值遍历到的当前队伍
				var army = armys[i];
				// 如果当前队伍没有对手存在 即该队为友队
				if(army.getMember(challenged_ident) == null){
					// 当前队伍为友队
					friend_army = army;
					// 获取友队的全部成员
					var friend_members = friend_army.getMembers();
					// 如果友队成员数目少于4人
					if(friend_members.length < 4){
						// 创建自己的战斗角色
						self_member = CombatCMD.createMember();
						// 加入友队
						friend_army.addMember(self_member);
						// 给自己发送开始战斗信息 类型为 2-开始新的战斗
						self_member.send("{\"combat_feedback\":\"2\"}");
						// 开启战斗cd
						self_member.startTimer("CD");
						// 判断成员是否自动战斗
						is_auto_combat = self_member.getAttr("is_auto_combat");
						if(is_auto_combat == 1){
							// 开启自动战斗模式
							self_member.startTimer("auto_combat_cd");
						}
						// 加入战斗成功
						join_status = 1;
					}
					else{
						// 友队人数已有4人 加入失败 类型为 4-自己需要加入的战斗队伍人数已满
						SystemCMD.send("{\"combat_feedback\":\"-3\"}");
						// 加入战斗失败
						join_status = 0;
					}
				}
				// 敌对
				else{
					// 当前队伍为敌对
					enemy_army = army;
				}
			}
			// 判断自己是否加入战斗成功
			if(join_status == 1){
				// 获取自身的name
				self_name = self_member.getAttr("name");
				// print("self_name: " + self_name);
				// 获取友队的全部成员
				var friend_members = friend_army.getMembers();
				// 遍历友队发送信息
				for(var i = 0; i < friend_members.length; i++){
					// 遍历到的当前友队成员
					var friend_member = friend_members[i];
					// 获取该队友成员的ident
					var friend_ident = friend_member.getAttr("ident");
					// 如果不是自己
					if(friend_ident != ident){
						// 信息
						var message = "<p style='color:#2894FF'>友队：" + self_name + "加入战斗<br></p>";
						// 给队友发送最新的战斗数据
						friend_member.send("{\"combat_condition\":\""+message+"\"}");
					}
				}

				// 获取敌队的全部成员
				var enemy_members = enemy_army.getMembers();
				// 遍历敌对发送信息
				for(var i = 0; i < enemy_members.length; i++){
					// 遍历到的当前敌队成员
					var enemy_member = enemy_members[i];
					// 信息
					var message = "<p style='color:#FF5151'>敌队：" + self_name + "加入战斗<br></p>";
					// 给队友发送最新的战斗数据
					enemy_member.send("{\"combat_condition\":\""+message+"\"}");
				}
				
				// 给战斗成员发送最新的战斗数据
				CombatCMD.pushCombatMembers(combat_no, "combat_members");
			}
		}
	}
	// 对手不在战斗中
	else{
		// 创建战斗平台
		var combat = CombatCMD.createCombat();
		
		// 创建双方队伍
		// 友队
		var army_a = combat.createArmy();
		// 敌对
		var army_b = combat.createArmy();
		
		// 创建战斗角色
		// 创建自身角色
		var member_a = CombatCMD.createMember();
		// 创建对手角色
		var member_b = CombatCMD.createMember(challenged_ident);
		
		// 战斗双方加入队伍
		// 自己加入友队
		army_a.addMember(member_a);
		// 对手加入敌对
		army_b.addMember(member_b);

		// 给自己发送开始战斗信息 类型为 2-开始新的战斗
		member_a.send("{\"combat_feedback\":\"2\"}");
		// 开启战斗cd
		member_a.startTimer("CD");
		// 判断成员是否自动战斗
		is_auto_combat = member_a.getAttr("is_auto_combat");
		if(is_auto_combat == 1){
			// 开启自动战斗模式
			member_a.startTimer("auto_combat_cd");
		}

		// 给对手发送开始战斗信息 类型为 2-开始新的战斗
		member_b.send("{\"combat_feedback\":\"2\"}");
		// 判断成员是否自动战斗
		is_auto_combat = member_b.getAttr("is_auto_combat");
		// 开启战斗cd
		member_b.startTimer("CD");
		if(is_auto_combat == 1){
			// 开启自动战斗模式
			member_b.startTimer("auto_combat_cd");
		}
	}
}