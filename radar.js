/**
 * 赫尔墨斯综合体 - 2D 战术俯视雷达引擎 (Hermes Radar System - P0)
 * 零依赖、纯原生 Canvas 2D 投影适配器
 * 架构：决策真相源仍为 GameState 与节点机，雷达作为视图 + 输入适配层。
 */

// ==========================================================================
// 1. 空间节点配置映射 (25 个剧情与结局节点)
// ==========================================================================
const RADAR_NODES_CONFIG = {
  // --- 0F 避难观测舱 ---
  start: {
    mapId: '0F_shelter',
    mapName: '0F 避难观测舱',
    spawn: { x: 200, y: 175 },
    facing: 270,
    hotspots: [
      {
        x: 105,
        y: 75,
        radius: 36,
        label: '打字机条例台',
        prompt: '查阅打字机条例与温度计',
        choiceIndex: 0
      },
      {
        x: 295,
        y: 75,
        radius: 36,
        label: '秦澈与苏澜',
        prompt: '检查队友体征与装备',
        choiceIndex: 1
      }
    ]
  },
  node_check_rules_desk: {
    mapId: '0F_shelter',
    mapName: '0F 避难观测舱 · 操作台前',
    spawn: { x: 110, y: 100 },
    facing: 270,
    hotspots: [
      {
        x: 65,
        y: 65,
        radius: 34,
        label: '红色液氮手柄',
        prompt: '拉下红色手柄降温',
        choiceIndex: 0
      },
      {
        x: 155,
        y: 65,
        radius: 34,
        label: '铝合金台面',
        prompt: '用手掌直接按压金属台面',
        choiceIndex: 1
      }
    ]
  },
  node_check_companions_start: {
    mapId: '0F_shelter',
    mapName: '0F 避难观测舱 · 队友待命区',
    spawn: { x: 290, y: 100 },
    facing: 270,
    hotspots: [
      {
        x: 155,
        y: 65,
        radius: 34,
        label: '铝合金台面',
        prompt: '伸手触碰操作台面检验',
        choiceIndex: 0
      },
      {
        x: 65,
        y: 65,
        radius: 34,
        label: '红色手柄',
        prompt: '扑向红色手柄',
        choiceIndex: 1
      }
    ]
  },
  node_touch_desk_truth: {
    mapId: '0F_shelter',
    mapName: '0F 避难观测舱 · 气闸门前',
    spawn: { x: 150, y: 100 },
    facing: 180,
    hotspots: [
      {
        x: 45,
        y: 120,
        radius: 36,
        label: '走廊内侧气闸门',
        prompt: '开启气闸门进入走廊',
        choiceIndex: 0
      }
    ]
  },

  // --- 0F 走廊岔路 ---
  node_microwave_corridor: {
    mapId: '0F_corridor',
    mapName: '0F 环形走廊岔路',
    spawn: { x: 200, y: 195 },
    facing: 270,
    hotspots: [
      {
        x: 95,
        y: 65,
        radius: 34,
        label: '干燥通道深处',
        prompt: '步入干燥走廊快速通过',
        choiceIndex: 0
      },
      {
        x: 175,
        y: 130,
        radius: 34,
        label: '罐头投掷警戒线',
        prompt: '掷出冻硬午餐肉罐头',
        choiceIndex: 1
      }
    ]
  },
  node_can_microwave_test: {
    mapId: '0F_corridor',
    mapName: '0F 走廊分歧点 · 凝霜入口',
    spawn: { x: 180, y: 140 },
    facing: 0,
    hotspots: [
      {
        x: 305,
        y: 70,
        radius: 36,
        label: '凝霜通道泄压阀',
        prompt: '进入凝霜通道迫降夹层',
        choiceIndex: 0
      }
    ]
  },

  // --- -0.5F 缆道检修夹层 ---
  node_enter_duct_p2: {
    mapId: '-0.5F_duct',
    mapName: '-0.5F 缆道检修夹层',
    spawn: { x: 70, y: 125 },
    facing: 0,
    hotspots: [
      {
        x: 310,
        y: 65,
        radius: 32,
        label: '协助处决秦澈',
        prompt: '协助苏澜控制并处决秦澈',
        choiceIndex: 0
      },
      {
        x: 230,
        y: 60,
        radius: 32,
        label: '夺取医用骨锯',
        prompt: '强行夺下苏澜手中的骨锯',
        choiceIndex: 1
      },
      {
        x: 200,
        y: 165,
        radius: 34,
        label: '泪液检测板',
        prompt: '采集两人泪液测定冰点',
        choiceIndex: 2
      }
    ]
  },
  node_tear_test_decision: {
    mapId: '-0.5F_duct',
    mapName: '-0.5F 夹层 · 检修台',
    spawn: { x: 200, y: 165 },
    facing: 0,
    hotspots: [
      {
        x: 310,
        y: 120,
        radius: 36,
        label: '垂危的秦澈',
        prompt: '听取机械师最后的自白',
        choiceIndex: 0
      }
    ]
  },
  node_qin_sacrifice: {
    mapId: '-0.5F_duct',
    mapName: '-0.5F 缆道深处 · 竖井前',
    spawn: { x: 300, y: 120 },
    facing: 90,
    hotspots: [
      {
        x: 330,
        y: 195,
        radius: 36,
        label: '冷库排风竖井',
        prompt: '背起苏澜探索夹层深处',
        choiceIndex: 0
      }
    ]
  },

  // --- -1F 废弃生物冷库 ---
  node_find_gu_corpse: {
    mapId: '-1F_cold_storage',
    mapName: '-1F 废弃生物冷库',
    spawn: { x: 90, y: 175 },
    facing: 270,
    hotspots: [
      {
        x: 200,
        y: 70,
        radius: 38,
        label: '垂直主排风道',
        prompt: '爬入排风道攀爬冲向地表',
        choiceIndex: 0
      }
    ]
  },

  // --- 0F 极地外部冰原与天线 ---
  node_surface_blizzard_p3: {
    mapId: '0F_surface',
    mapName: '0F 极地外部冰原',
    spawn: { x: 70, y: 175 },
    facing: 0,
    hotspots: [
      {
        x: 330,
        y: 175,
        radius: 34,
        label: '车库方向 (狂奔)',
        prompt: '大喊快跑并冲向车库',
        choiceIndex: 0
      },
      {
        x: 190,
        y: 80,
        radius: 34,
        label: '低温雪堆掩体',
        prompt: '含雪压低体温贴地潜行',
        choiceIndex: 1
      }
    ]
  },
  node_evade_strider_success: {
    mapId: '0F_surface',
    mapName: '0F 外部天线基座',
    spawn: { x: 190, y: 85 },
    facing: 0,
    hotspots: [
      {
        x: 325,
        y: 70,
        radius: 32,
        label: '天线塔顶红灯',
        prompt: '双眼死死盯住正前红灯',
        choiceIndex: 0
      },
      {
        x: 250,
        y: 160,
        radius: 34,
        label: '电池短路 / 拟音喉',
        prompt: '制造电弧并用手电照射拟音喉',
        choiceIndex: 1
      }
    ]
  },
  node_monsters_counter_kill: {
    mapId: '0F_surface',
    mapName: '0F 天线基座 · 盲区互噬',
    spawn: { x: 240, y: 160 },
    facing: 0,
    hotspots: [
      {
        x: 330,
        y: 75,
        radius: 38,
        label: '80米中央天线塔旋梯',
        prompt: '立刻冲上旋梯',
        choiceIndex: 0
      }
    ]
  },

  // --- 天线塔旋梯 ---
  node_antenna_climb: {
    mapId: 'antenna_tower',
    mapName: '中央天线塔旋梯',
    spawn: { x: 110, y: 190 },
    facing: 0,
    hotspots: [
      {
        x: 280,
        y: 70,
        radius: 38,
        label: '塔顶信号舱舱门',
        prompt: '推门进入信号舱',
        choiceIndex: 0
      }
    ]
  },

  // --- 天线塔顶信号舱 ---
  node_antenna_cabin_choice: {
    mapId: 'antenna_cabin',
    mapName: '天线塔顶信号舱',
    spawn: { x: 200, y: 185 },
    facing: 270,
    hotspots: [
      {
        x: 80,
        y: 75,
        radius: 34,
        label: '雪地车逃生通道',
        prompt: '下塔启动雪地车向南突围',
        choiceIndex: 0
      },
      {
        x: 320,
        y: 75,
        radius: 34,
        label: '第 82 级时空奇点',
        prompt: '纵身跃入第82级奇点',
        choiceIndex: 1
      }
    ]
  },

  // --- -4F 倒悬冰穹核心 ---
  node_enter_abyss_p4: {
    mapId: '-4F_core',
    mapName: '-4F 倒悬冰穹核心',
    spawn: { x: 90, y: 125 },
    facing: 0,
    hotspots: [
      {
        x: 300,
        y: 65,
        radius: 34,
        label: '高压氢储罐',
        prompt: '信号枪射击储罐引爆核爆',
        choiceIndex: 0
      },
      {
        x: 300,
        y: 175,
        radius: 34,
        label: '超导反应堆线圈',
        prompt: '注入血清将干尸推入线圈',
        choiceIndex: 1
      }
    ]
  },

  // --- 9 个结局节点 (锁定) ---
  bad_end_airlock: { isEnding: true, title: 'BAD END 1：气闸屠场' },
  bad_end_microwave: { isEnding: true, title: 'BAD END 2：微波焦尸' },
  bad_end_kill_qin: { isEnding: true, title: 'BAD END 3：误杀与孤立' },
  bad_end_break_serum: { isEnding: true, title: 'BAD END 4：打碎的希望' },
  bad_end_whitestrider: { isEnding: true, title: 'BAD END 5：雪原猎物' },
  bad_end_scotoma: { isEnding: true, title: 'BAD END 6：盲斑折颈' },
  bad_end_reactor_blast: { isEnding: true, title: 'BAD END 7：环形重置' },
  ending_escape_only: { isEnding: true, title: 'ENDING 1：冻土幽灵' },
  ending_true_breakthrough: { isEnding: true, title: 'ENDING 2：晨曦破晓' }
};

// ==========================================================================
// 2. 静态地图绘制定义 (战术俯视风格)
// ==========================================================================
const RADAR_MAPS = {
  '0F_shelter': {
    draw(ctx, w, h) {
      // 房间外墙
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 左侧气闸门
      ctx.fillStyle = 'rgba(255, 183, 3, 0.2)';
      ctx.fillRect(25, 95, 12, 50);
      ctx.strokeStyle = 'var(--accent-amber)';
      ctx.strokeRect(25, 95, 12, 50);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '8px monospace';
      ctx.fillText('气闸', 27, 125);

      // 顶部打字机条例操作台
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.fillRect(60, 35, 90, 45);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.strokeRect(60, 35, 90, 45);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '9px monospace';
      ctx.fillText('[官方操作台/温度计]', 65, 50);

      // 顶部右侧队友休息区
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.fillRect(250, 35, 90, 45);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.strokeRect(250, 35, 90, 45);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '9px monospace';
      ctx.fillText('[秦澈/苏澜 待命位]', 255, 50);

      // 底部冷休眠舱
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(165, 185, 70, 22);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '8px monospace';
      ctx.fillText('休眠床位(起点)', 170, 200);
    }
  },

  '0F_corridor': {
    draw(ctx, w, h) {
      // 走廊轮廓
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 中间隔离墙壁 (将走廊分成左干燥、右凝霜)
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fillRect(190, 25, 20, 110);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.strokeRect(190, 25, 20, 110);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '8px monospace';
      ctx.fillText('隔断墙', 186, 75);

      // 左侧干燥通道：微波禁区！(黄色/红色斜纹高亮，标注为危险区，玩家走入不致死)
      ctx.save();
      ctx.fillStyle = 'rgba(255, 60, 60, 0.12)';
      ctx.fillRect(35, 35, 145, 125);
      ctx.strokeStyle = 'rgba(255, 80, 80, 0.4)';
      ctx.strokeRect(35, 35, 145, 125);

      // 绘制斜线纹理
      ctx.strokeStyle = 'rgba(255, 80, 80, 0.18)';
      ctx.lineWidth = 1;
      for (let x = 40; x < 180; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 35);
        ctx.lineTo(x + 20, 160);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 100, 100, 0.85)';
      ctx.font = '9px monospace';
      ctx.fillText('⚠️ 干燥无霜走廊 (微波辐射杀阵)', 42, 50);
      ctx.fillStyle = 'rgba(255, 180, 180, 0.6)';
      ctx.font = '8px monospace';
      ctx.fillText('【可进入走位 · 非致死判定】', 42, 65);
      ctx.restore();

      // 右侧凝霜通道 (冰晶蓝调)
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.fillRect(220, 35, 145, 125);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.strokeRect(220, 35, 145, 125);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.font = '9px monospace';
      ctx.fillText('❄️ 凝霜安全通道 (泄压阀方向)', 228, 50);

      // 底部入口提示
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '9px monospace';
      ctx.fillText('▲ 0F 避难舱气闸入口', 150, 215);
    }
  },

  '-0.5F_duct': {
    draw(ctx, w, h) {
      // 夹层管道结构
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 贯穿高压电缆束
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(25, 100);
      ctx.lineTo(w - 25, 100);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(25, 140);
      ctx.lineTo(w - 25, 140);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText('高压冷凝管束 // 蒸汽排气口', 40, 95);
      ctx.fillText('钛合金缆架桥道', 40, 135);

      // 检修平台
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.strokeRect(170, 145, 65, 45);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(170, 145, 65, 45);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '8px monospace';
      ctx.fillText('检修工作台', 175, 160);
    }
  },

  '-1F_cold_storage': {
    draw(ctx, w, h) {
      // 冷库
      ctx.strokeStyle = 'rgba(0, 180, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 蓝冰冷凝区
      ctx.fillStyle = 'rgba(0, 120, 255, 0.1)';
      ctx.fillRect(35, 35, w - 70, h - 70);

      // 顾言舟干尸台座
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.strokeRect(170, 110, 60, 40);
      ctx.fillStyle = 'rgba(255, 0, 85, 0.12)';
      ctx.fillRect(170, 110, 60, 40);
      ctx.fillStyle = 'rgba(255, 100, 150, 0.85)';
      ctx.font = '8px monospace';
      ctx.fillText('相态2 顾言舟干尸', 172, 130);

      // 竖井排风口
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(200, 70, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '8px monospace';
      ctx.fillText('垂直排风井', 178, 73);
    }
  },

  '0F_surface': {
    draw(ctx, w, h) {
      // 开阔雪原
      ctx.strokeStyle = 'rgba(200, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // 风雪纹理
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 6; i++) {
        const y = 40 + i * 30;
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(w - 30, y - 10);
        ctx.stroke();
      }

      // 天线基座 (右上方)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.strokeRect(280, 35, 90, 80);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.fillRect(280, 35, 90, 80);

      // 天线红灯标记
      ctx.fillStyle = 'rgba(255, 0, 85, 0.8)';
      ctx.beginPath();
      ctx.arc(325, 70, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '8px monospace';
      ctx.fillText('80m 天线塔基座 [红灯]', 284, 50);

      // 车库方向 (右下)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.strokeRect(290, 155, 75, 40);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText('地表车库方向', 295, 175);
    }
  },

  'antenna_tower': {
    draw(ctx, w, h) {
      // 旋梯结构 (同心环与螺旋)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
      ctx.stroke();

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + Math.cos(a) * 45, h / 2 + Math.sin(a) * 45);
        ctx.lineTo(w / 2 + Math.cos(a) * 85, h / 2 + Math.sin(a) * 85);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '9px monospace';
      ctx.fillText('中央天线塔旋梯 // 奇偶级阶梯', 130, 35);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText('高度: +78.5m', 180, 220);
    }
  },

  'antenna_cabin': {
    draw(ctx, w, h) {
      // 信号舱机房
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 控制台仪表板
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.fillRect(40, 35, 100, 45);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.strokeRect(40, 35, 100, 45);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.font = '8px monospace';
      ctx.fillText('下塔直通梯 · 雪地车', 45, 55);

      // 莫比乌斯第82级奇点裂隙
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.6)';
      ctx.beginPath();
      ctx.arc(320, 75, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 183, 3, 0.8)';
      ctx.font = '8px monospace';
      ctx.fillText('第82级奇点裂隙', 285, 110);
    }
  },

  '-4F_core': {
    draw(ctx, w, h) {
      // 倒悬冰穹核心
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 超导反应堆同心环
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(300, 175, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fill();

      // 高压氢储罐
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.6)';
      ctx.strokeRect(270, 45, 60, 35);
      ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
      ctx.fillRect(270, 45, 60, 35);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '8px monospace';
      ctx.fillText('高压氢储罐', 275, 65);
      ctx.fillText('超导反应堆', 278, 178);
    }
  }
};

// ==========================================================================
// 3. 雷达控制器核心实现 (Radar Controller)
// ==========================================================================
const Radar = {
  canvas: null,
  ctx: null,
  container: null,
  toggleBtn: null,
  promptBar: null,
  promptTextEl: null,
  coordsEl: null,
  titleTextEl: null,

  // 内部逻辑坐标系统固定为 400 x 240
  virtualWidth: 400,
  virtualHeight: 240,

  // 状态变量
  isInitialized: false,
  isCollapsed: false,
  isLocked: false,
  currentNodeId: 'start',
  currentConfig: null,

  // 陆巡姿态与移动
  player: {
    x: 200,
    y: 175,
    facing: 270 // 度数：0=东, 90=南, 180=西, 270=北
  },
  moveSpeed: 2.2,
  targetPos: null, // 触屏/点击寻路目标 { x, y }
  keysDown: new Set(),
  activeHotspot: null, // 当前处于触发半径内的最近 hotspot

  // 动效计时
  animFrameId: null,

  init() {
    if (this.isInitialized) return;

    this.canvas = document.getElementById('radar-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById('radar-panel');
    this.toggleBtn = document.getElementById('btn-radar-toggle');
    this.promptBar = document.getElementById('radar-prompt-bar');
    this.promptTextEl = document.getElementById('radar-prompt-text');
    this.coordsEl = document.getElementById('radar-coords');
    this.titleTextEl = document.getElementById('radar-title-text');

    this.bindEvents();
    this.applyNode(this.currentNodeId);
    this.startLoop();
    this.isInitialized = true;
  },

  bindEvents() {
    // 1. 折叠/展开雷达按钮
    if (this.toggleBtn) {
      this.toggleBtn.onclick = () => {
        this.toggleCollapse();
      };
    }

    // 2. 键盘控制 (WASD / 方向键 / F)
    window.addEventListener('keydown', (e) => {
      // 时间线模态框打开时绝对不吞键
      const modal = document.getElementById('timeline-modal');
      if (modal && modal.style.display !== 'none') {
        return;
      }

      if (this.isLocked) return;

      const code = e.code;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        this.keysDown.add(code);
        this.targetPos = null; // 玩家手动按键盘时打断寻路
        e.preventDefault();
      } else if (code === 'KeyF') {
        if (this.activeHotspot && typeof GameState !== 'undefined') {
          e.preventDefault();
          this.triggerHotspot(this.activeHotspot);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const modal = document.getElementById('timeline-modal');
      if (modal && modal.style.display !== 'none') {
        return;
      }
      this.keysDown.delete(e.code);
    });

    // 3. 点击 / 触屏点地图走位
    if (this.canvas) {
      const handlePointer = (e) => {
        if (this.isLocked) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.virtualWidth / rect.width;
        const scaleY = this.virtualHeight / rect.height;
        const clickX = Math.max(20, Math.min(this.virtualWidth - 20, (e.clientX - rect.left) * scaleX));
        const clickY = Math.max(20, Math.min(this.virtualHeight - 20, (e.clientY - rect.top) * scaleY));

        // 检查是否点中了某个 hotspot
        if (this.currentConfig && this.currentConfig.hotspots) {
          for (const spot of this.currentConfig.hotspots) {
            const d = Math.hypot(spot.x - clickX, spot.y - clickY);
            if (d <= spot.radius * 1.25) {
              // 如果陆巡已经在该 hotspot 范围内，直接触发！
              const playerDist = Math.hypot(spot.x - this.player.x, spot.y - this.player.y);
              if (playerDist <= spot.radius) {
                this.triggerHotspot(spot);
                return;
              }
              // 否则陆巡寻路前往该 hotspot
              this.targetPos = { x: spot.x, y: spot.y, targetHotspot: spot };
              return;
            }
          }
        }

        // 普通空地点击：走向目标点
        this.targetPos = { x: clickX, y: clickY, targetHotspot: null };
      };

      this.canvas.addEventListener('pointerdown', handlePointer);
    }

    // 4. 点击提示条等同于按 [F] (为触屏玩家提供最便捷交互)
    if (this.promptBar) {
      this.promptBar.onclick = () => {
        if (this.activeHotspot) {
          this.triggerHotspot(this.activeHotspot);
        }
      };
    }

    // 5. 监听窗口尺寸自适应
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    this.resizeCanvas();
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
    }
  },

  toggleCollapse(forceState = null) {
    if (!this.container) return;
    this.isCollapsed = forceState !== null ? forceState : !this.isCollapsed;
    this.container.classList.toggle('collapsed', this.isCollapsed);

    const toggleText = document.getElementById('radar-toggle-text');
    const toggleIcon = document.getElementById('radar-toggle-icon');
    if (toggleText) toggleText.innerText = this.isCollapsed ? '展开雷达' : '收起雷达';
    if (toggleIcon) toggleIcon.innerText = this.isCollapsed ? '▼' : '▲';

    if (!this.isCollapsed) {
      if (typeof setTimeout !== 'undefined') {
        setTimeout(() => this.resizeCanvas(), 50);
      } else {
        this.resizeCanvas();
      }
    }
  },

  // 状态快照与恢复
  getPose() {
    return {
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
      facing: Math.round(this.player.facing)
    };
  },

  setPose(pose) {
    if (!pose) return;
    this.player.x = pose.x;
    this.player.y = pose.y;
    this.player.facing = pose.facing;
    this.targetPos = null;
    this.updateCoordsDisplay();
  },

  applyNode(nodeId, restoredPose = null) {
    this.currentNodeId = nodeId;
    const config = RADAR_NODES_CONFIG[nodeId];

    if (!config) {
      this.isLocked = true;
      return;
    }

    this.currentConfig = config;

    // 结局节点处理：锁定雷达
    if (config.isEnding) {
      this.isLocked = true;
      this.targetPos = null;
      this.activeHotspot = null;
      if (this.promptBar) this.promptBar.style.display = 'none';
      if (this.titleTextEl) {
        this.titleTextEl.innerText = `战术投影锁定 // ${config.title || '结局收敛'}`;
      }
      return;
    }

    // 非结局节点：激活雷达
    this.isLocked = false;

    // 设置位置与朝向
    if (restoredPose) {
      this.setPose(restoredPose);
    } else if (config.spawn) {
      this.player.x = config.spawn.x;
      this.player.y = config.spawn.y;
      this.player.facing = typeof config.facing === 'number' ? config.facing : 270;
      this.targetPos = null;
    }

    if (this.titleTextEl) {
      this.titleTextEl.innerText = `战术雷达 // ${config.mapName || '赫尔墨斯综合体'}`;
    }

    this.updateCoordsDisplay();
  },

  reset() {
    this.currentNodeId = 'start';
    this.applyNode('start');
  },

  triggerHotspot(hotspot) {
    if (!hotspot || typeof hotspot.choiceIndex !== 'number') return;
    if (typeof GameState !== 'undefined' && typeof GameState.chooseByIndex === 'function') {
      GameState.chooseByIndex(hotspot.choiceIndex);
    }
  },

  updateCoordsDisplay() {
    if (this.coordsEl) {
      this.coordsEl.innerText = `POS: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`;
    }
  },

  // ========================================================================
  // 4. 物理移动计算与碰撞边界
  // ========================================================================
  updatePhysics() {
    if (this.isLocked) return;

    let moveX = 0;
    let moveY = 0;

    // 键盘移动判断
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) moveY -= 1;
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) moveY += 1;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) moveX -= 1;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) moveX += 1;

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      const nx = (moveX / len) * this.moveSpeed;
      const ny = (moveY / len) * this.moveSpeed;

      this.player.x += nx;
      this.player.y += ny;
      this.player.facing = (Math.atan2(ny, nx) * 180) / Math.PI;
      if (this.player.facing < 0) this.player.facing += 360;
    } else if (this.targetPos) {
      // 触屏 / 鼠标寻路移动
      const dx = this.targetPos.x - this.player.x;
      const dy = this.targetPos.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 2.5) {
        this.player.x = this.targetPos.x;
        this.player.y = this.targetPos.y;
        const reachedTargetHotspot = this.targetPos.targetHotspot;
        this.targetPos = null;

        // 若点击的是某个 hotspot 且到达，自动触发
        if (reachedTargetHotspot) {
          const d = Math.hypot(reachedTargetHotspot.x - this.player.x, reachedTargetHotspot.y - this.player.y);
          if (d <= reachedTargetHotspot.radius) {
            this.triggerHotspot(reachedTargetHotspot);
          }
        }
      } else {
        const step = Math.min(this.moveSpeed, dist);
        const nx = (dx / dist) * step;
        const ny = (dy / dist) * step;

        this.player.x += nx;
        this.player.y += ny;
        this.player.facing = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (this.player.facing < 0) this.player.facing += 360;
      }
    }

    // 边界限制 (保持在舱室内 25~375, 25~215)
    this.player.x = Math.max(28, Math.min(this.virtualWidth - 28, this.player.x));
    this.player.y = Math.max(28, Math.min(this.virtualHeight - 28, this.player.y));

    this.updateCoordsDisplay();

    // 检测最近的 Hotspot 判定
    this.checkHotspots();
  },

  checkHotspots() {
    if (!this.currentConfig || !this.currentConfig.hotspots || this.isLocked) {
      this.activeHotspot = null;
      if (this.promptBar) this.promptBar.style.display = 'none';
      return;
    }

    let nearest = null;
    let minDist = Infinity;

    for (const spot of this.currentConfig.hotspots) {
      const dist = Math.hypot(spot.x - this.player.x, spot.y - this.player.y);
      if (dist <= spot.radius && dist < minDist) {
        minDist = dist;
        nearest = spot;
      }
    }

    this.activeHotspot = nearest;

    if (this.promptBar && this.promptTextEl) {
      if (nearest) {
        this.promptBar.style.display = 'flex';
        this.promptTextEl.innerText = `[F] ${nearest.prompt || nearest.label}`;
      } else {
        this.promptBar.style.display = 'none';
      }
    }
  },

  // ========================================================================
  // 5. 渲染循环引擎 (Canvas 2D)
  // ========================================================================
  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  },

  render() {
    if (!this.canvas || !this.ctx || this.isCollapsed) return;

    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 清空画布
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // 缩放到统一虚拟分辨率 (400 x 240)
    const scaleX = w / this.virtualWidth;
    const scaleY = h / this.virtualHeight;
    ctx.scale(scaleX, scaleY);

    // 1. 绘制背景网格
    this.drawGrid(ctx, this.virtualWidth, this.virtualHeight);

    // 2. 结局锁定状态渲染
    if (this.isLocked) {
      this.drawLockedState(ctx, this.virtualWidth, this.virtualHeight);
      ctx.restore();
      return;
    }

    // 3. 绘制静态地图特征 (舱壁、通道、禁区等)
    if (this.currentConfig && this.currentConfig.mapId) {
      const mapDef = RADAR_MAPS[this.currentConfig.mapId];
      if (mapDef && typeof mapDef.draw === 'function') {
        mapDef.draw(ctx, this.virtualWidth, this.virtualHeight);
      }
    }

    // 4. 绘制所有 Hotspots 光圈
    this.drawHotspots(ctx);

    // 5. 绘制陆巡本体与 120° 视锥
    this.drawPlayer(ctx);

    // 6. 绘制科技感 HUD 角标
    this.drawHUDCorners(ctx, this.virtualWidth, this.virtualHeight);

    ctx.restore();
  },

  drawGrid(ctx, w, h) {
    ctx.fillStyle = '#050c14';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = 20;

    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  },

  drawHUDCorners(ctx, w, h) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    const len = 8;

    // 左上
    ctx.beginPath();
    ctx.moveTo(10, 10 + len);
    ctx.lineTo(10, 10);
    ctx.lineTo(10 + len, 10);
    ctx.stroke();

    // 右上
    ctx.beginPath();
    ctx.moveTo(w - 10 - len, 10);
    ctx.lineTo(w - 10, 10);
    ctx.lineTo(w - 10, 10 + len);
    ctx.stroke();

    // 左下
    ctx.beginPath();
    ctx.moveTo(10, h - 10 - len);
    ctx.lineTo(10, h - 10);
    ctx.lineTo(10 + len, h - 10);
    ctx.stroke();

    // 右下
    ctx.beginPath();
    ctx.moveTo(w - 10 - len, h - 10);
    ctx.lineTo(w - 10, h - 10);
    ctx.lineTo(w - 10, h - 10 - len);
    ctx.stroke();
  },

  drawHotspots(ctx) {
    if (!this.currentConfig || !this.currentConfig.hotspots) return;

    const time = performance.now() / 1000;

    for (const spot of this.currentConfig.hotspots) {
      const isActive = this.activeHotspot === spot;
      const pulse = Math.sin(time * 3) * 2;
      const r = spot.radius + pulse;

      ctx.save();

      // 外光环
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? '#ffb703' : 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // 内层微光填充
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? 'rgba(255, 183, 3, 0.18)' : 'rgba(0, 240, 255, 0.05)';
      ctx.fill();

      // 核心标记点
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#ffb703' : 'rgba(0, 240, 255, 0.8)';
      ctx.fill();

      // 标注文字
      ctx.font = isActive ? 'bold 10px monospace' : '9px monospace';
      ctx.fillStyle = isActive ? '#ffb703' : 'rgba(255, 255, 255, 0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(spot.label, spot.x, spot.y - spot.radius - 4);

      if (isActive) {
        ctx.fillStyle = '#ffb703';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('[按 F 或点击交互]', spot.x, spot.y + spot.radius + 12);
      }

      ctx.restore();
    }
  },

  drawPlayer(ctx) {
    const px = this.player.x;
    const py = this.player.y;
    const facingDeg = this.player.facing;
    const coneRadius = 75;

    ctx.save();

    // 1. 渲染 120° 视锥 (扇形渐变：facing - 60° 到 facing + 60°)
    const startRad = ((facingDeg - 60) * Math.PI) / 180;
    const endRad = ((facingDeg + 60) * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, coneRadius, startRad, endRad);
    ctx.closePath();

    const grad = ctx.createRadialGradient(px, py, 0, px, py, coneRadius);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
    grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.01)');

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. 陆巡本体外环与核心
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 204, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 3. 朝向三角指示箭头
    const dirRad = (facingDeg * Math.PI) / 180;
    const tipX = px + Math.cos(dirRad) * 11;
    const tipY = py + Math.sin(dirRad) * 11;
    const leftX = px + Math.cos(dirRad + 2.5) * 5;
    const leftY = py + Math.sin(dirRad + 2.5) * 5;
    const rightX = px + Math.cos(dirRad - 2.5) * 5;
    const rightY = py + Math.sin(dirRad - 2.5) * 5;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = '#00ffcc';
    ctx.fill();

    // 4. 陆巡身份标签
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(0, 255, 204, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText('陆巡', px, py + 16);

    ctx.restore();
  },

  drawLockedState(ctx, w, h) {
    // 结局时空锁定背景噪点与红色警告
    ctx.fillStyle = 'rgba(255, 0, 85, 0.06)';
    ctx.fillRect(0, 0, w, h);

    // 干扰线
    ctx.strokeStyle = 'rgba(255, 0, 85, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 10; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'var(--accent-danger, #ff0055)';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('// RADAR OFFLINE - TIMELINE COLLAPSED //', w / 2, h / 2 - 14);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '11px monospace';
    ctx.fillText('【战术投影锁定 · 已达结局分支】', w / 2, h / 2 + 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';
    ctx.fillText('请使用右下方行动选项 或 终端顶部 [⏪ 回溯] 退出循环', w / 2, h / 2 + 28);
  }
};
