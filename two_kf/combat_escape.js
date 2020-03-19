// 位置：战斗函数

// -----------------分隔符------------------

// 关键字：combat_escape
// 参数：不填
// 描述：自己战斗逃跑
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

// 战斗是否结束
// combat_status == 0 战斗结束
// combat_status == 1 战斗继续
var combat_status;
// 友队
var friend_army;
// 敌队
var enemy_army;
// 战斗平台编号
var combat_no;
// 自身战斗所在队伍编号
var self_army_no;
// 战斗数据
var combat_info;
// 自身的姓名
var self_name;

// 判断自己是否处于战斗中
if(CombatCMD.isCombat()) {
	// 获取战斗成员自己本身
	var self_member = CombatCMD.getCombatMember();
	// 获取自身的name
	self_name = self_member.getAttr("name");
	// 获取自身的战斗平台
	var combat = CombatCMD.getCombat();
	// 获取自身所在的战斗平台编号
	combat_no = CombatCMD.getCombatNO();
	// 获取自身所在的战斗队伍编号
	self_army_no = CombatCMD.getArmyNO();
	// 获得自己所在的队伍
	var self_army = CombatCMD.getCombatArmy()
	// 获取自身的ident
	var self_ident = self_member.getAttr("ident")
	// 默认直接逃跑成功 - 自己退出战斗 (后续作者自行修改 是否逃跑成功) 
	self_army.removeMember(self_ident);
	// 给自己发送战斗结束信息
	SystemCMD.send("{\"combat_feedback\":\"-4\"}");
	// 获取当前战斗平台所有战斗队伍
	var armys = combat.getArmys();
	// 遍历战斗中的所有队伍
	for(var i = 0; i < armys.length; i++){
		// 遍历到的当前队伍
		var army = armys[i];
		// 获取当前队伍的编号
		var army_no = army.getArmyNO();
		// 判断是否是友队编号 是友队
		if(self_army_no == army_no){
			// 当前队伍为友队
			friend_army = army;
			// 获取友队的全部成员
			var friend_members = friend_army.getMembers();
			// 判断友队队伍人数 友队人数为空
			if(friend_members.length == 0){
				// 战斗结束
				combat_status = 0;
			}
			else{
				// 战斗继续
				combat_status = 1;
			}
		}
		else{
			// 当前队伍为敌队
			enemy_army = army;
		}
	}
	// 如果战斗继续
	if(combat_status == 1){
		// 获取友队的所有成员的ident
		// var friend_idents = friend_army.getMemberKeys();
		// 获取友队的全部成员
		//var friend_members = friend_army.getMembers();
		// 遍历友队发送信息
		for(var i = 0; i < friend_members.length; i++){
			// 遍历到的当前友队成员
			var friend_member = friend_members[i];
			// 获取该队友成员的ident
			var friend_ident = friend_member.getAttr("ident");
			// 如果不是自己
			if(friend_ident != ident){
				// 信息
				var message = "<p style='color:#2894FF'>友队：" + self_name + "退出战斗<br></p>";
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
			var message = "<p style='color:#FF5151'>敌对：" + self_name + "退出战斗<br></p>";
			// 给队友发送最新的战斗数据
			enemy_member.send("{\"combat_condition\":\""+message+"\"}");
		}
		// 给战斗成员发送最新的战斗数据
		CombatCMD.pushCombatMembers(combat_no, "combat_members");
	}
	// 战斗结束
	else{
		// 获取敌队的全部成员
		var enemy_members = enemy_army.getMembers();
		// 遍历敌对发送信息
		for(var i = 0; i < enemy_members.length; i++){
			// 遍历到的当前敌队成员
			var enemy_member = enemy_members[i];
			// 给敌队成员发送战斗结束的信息
			enemy_member.send("{\"combat_feedback\":\"4\"}");
		}
		// 结束当前战斗平台
		CombatCMD.finishCombat(combat_no);
	}
}
// 如果自己不在战斗中
else{
	// 自己不在战斗中 类型为 0-自己不处于战斗中
	SystemCMD.send("{\"combat_feedback\":\"0\"}");
}