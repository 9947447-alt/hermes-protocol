/**
 * 北纬82°赫尔墨斯综合体：莫比乌斯绝境协议
 * (Hermes Protocol: Möbius Terminal)
 * 交互式逻辑推理解密引擎
 */

// ==========================================================================
// 1. 原生 Web Audio API 声学引擎 (纯代码程序化合成)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.windNode = null;
    this.windGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.startWind();
      this.playClick();
    } else {
      this.stopWind();
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playAlarm() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1760, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playHeartbeat() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  startWind() {
    if (!this.ctx || this.windNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = noiseBuffer;
    this.windNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.windNode.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);
    this.windNode.start();
  }

  stopWind() {
    if (this.windNode) {
      try { this.windNode.stop(); } catch(e){}
      this.windNode.disconnect();
      this.windNode = null;
    }
  }
}

const audio = new SoundEngine();

// ==========================================================================
// 2. 道具与证物数据库
// ==========================================================================
const ITEMS_DB = {
  canned_meat: {
    id: 'canned_meat',
    name: '冻硬的午餐肉罐头',
    tag: '物理检测媒介',
    traits: '含水率 65% · 内部水分子结晶态 · 导热性差',
    desc: '厨房配给的未开封铁皮罐头，表面覆满白霜。水分子在特定高能微波辐射（2450MHz）下会剧烈共振摩擦产生内压爆裂，是极佳的隐形微波灭菌场探测器。'
  },
  tear_plate: {
    id: 'tear_plate',
    name: '泪液冰点金属检测板',
    tag: '双盲生理试剂板',
    traits: '高导热铜铝合金 · 刻度基准 0℃ 与 -0.52℃',
    desc: '医护专用的双凹槽金属板。人类正常泪液含盐 0.9%，冰点为 -0.52℃；受冷孢子异化的宿主分泌极化抗冻糖蛋白，泪液在 -14.8℃ 下仍不结冰。'
  },
  dry_ice_extinguisher: {
    id: 'dry_ice_extinguisher',
    name: '手持二氧化碳干冰灭火器',
    tag: '热力学防护装备',
    traits: '喷射温度 -78.5℃ · 气化吸热隔热层',
    desc: '喷淋在防寒服外层可在数分钟内形成超低温二氧化碳冷气膜，不仅能屏蔽人体红外热辐射，还能在短时间内抵御微波诱发的热衰竭。'
  },
  qin_hydraulic_axis: {
    id: 'qin_hydraulic_axis',
    name: '秦澈的钛合金机械轴',
    tag: '关键机械构件',
    traits: '军规钛合金锻造 · 刻痕：“敬人类不屈的理性”',
    desc: '机械师秦澈在彻底异化前用角磨机切断右臂义肢取出的核心传动主轴。这是地表极地重型雪地车唯一的机械离合启动钥匙。'
  },
  pure_antifreeze_serum: {
    id: 'pure_antifreeze_serum',
    name: '高纯度抗冻蛋白血清 (唯一试剂)',
    tag: '生化逆转血清',
    traits: '耐受深冷 · 针对 1994 年原型毒株设计',
    desc: '医官苏澜随身密封保存的唯一原液。若直接注射给晚期异化体毫无作用；但在拓扑时空中，将其注入 30 年前的原始未感染宿体，可引发因果自洽反向湮灭。'
  },
  gu_corpse_token: {
    id: 'gu_corpse_token',
    name: '相态 2 顾言舟的遗物与左轮',
    tag: '因果时空原质',
    traits: '1994年工牌 0001 · 弹巢仅存 1 枚击发弹壳',
    desc: '在 -1F 冰库发现的顾言舟干尸。胸前弹孔与工牌证实其在 30 年前就已饮弹自尽。作为未被后续模因污染的原始时空锚点，他是破解祖父悖论的核心媒介。'
  }
};

// ==========================================================================
// 3. 全阶多层规则数据库 (含血液、偏振、摩尔纹与反转状态文本)
// ==========================================================================
const RULES_DB = {
  0: [
    {
      num: '元规则 Ⅰ',
      title: '逻辑反转律 (SpO₂ 关联)',
      standard: '当且仅当佩戴者外周血氧饱和度 SpO₂ < 80%（出现管状视野、指甲发绀）时，受神经缺氧阻断影响，所有规程中的逻辑联结词强制反向求补：【若 A 则必须 B】自动翻转为【若非 A 则必须非 B】。',
      truth: '生理缺氧导致脑电突触反相放电，系统依靠反相指令保护濒死意识。'
    },
    {
      num: '元规则 Ⅱ',
      title: '介质解构律 (多相墨水)',
      standard: '纸质条例受四相分子墨水控制：白光直射显现表层（诱杀指令）；血液浸润显现中层真实警告；心率 ≥150 bpm 且视网膜微血管搏动时，与纳米光栅发生摩尔纹干涉显现底层密码。',
      truth: '通过多重物理与生理门槛，防止未具备对抗能力的普通感染者轻举妄动。'
    },
    {
      num: '元规则 Ⅲ',
      title: '物理不变公理',
      standard: '空间的几何形变与认知污染，绝无法违背重力做功、水的相变点（0℃ 结冰）以及多普勒频移。仪器与人眼会说谎，但相变物理现象从不说谎。',
      truth: '一切推理的绝对真理锚点。遇到规则矛盾时，以客观物理相变为准。'
    }
  ],
  1: [
    {
      num: '规则 1-1',
      title: '生火与温控指令',
      standard: '舱内恒温器维持在 20℃。若温度计读数攀升至 37℃ 以上，必须在 60 秒内拉下红色手柄启动全舱液氮降温。',
      blood: '【血液显影】绝对不可拉下手柄！手柄机械连接着外门电锁，拉下会直接向走廊开门！37℃ 是异化体释放的虚假热相场！',
      inversion: '若温度计读数未攀升至 37℃，绝对不可拉下红色手柄（必须维持阀门锁死）。',
      truth: '打字机原版是诱骗幸存者开门的自杀陷阱。'
    },
    {
      num: '规则 1-2',
      title: '通道辨识指令',
      standard: '穿过主走廊时，必须选择地面【干燥无霜】的通道，这代表除湿与通风系统运作良好。',
      blood: '【血液显影】干燥无霜是致命微波场！高能微波抽干了空气中一切水分子！走入者 20 秒内血液沸腾！',
      polaroid: '【偏振镜显影】凝霜通道才是常态极地环境，微波发射塔位于干燥通道天花板。',
      truth: '干燥通道正在执行 2450MHz 微波灭菌，进入必死。'
    },
    {
      num: '规则 1-3',
      title: '联络准则',
      standard: '03:00 对讲机自检。若听到站长顾言舟的声音，回答“第 4 组就绪”并听从其路线指挥。',
      blood: '【血液显影】广播里是 1994 年灾变前的死循环录音！按其指引会走进早被坍塌冰块封死的绝路！',
      truth: '广播里的顾言舟是过去时空切片，信息具有 30 年滞后性。'
    }
  ],
  2: [
    {
      num: '规则 2-1',
      title: '苏澜手记 (逆反期)',
      standard: '【原字迹】必须用安全绳将所有人腰带锁死；必须在耳鸣时摘掉耳罩；遇到体温高于 37.5℃ 的队友立即就地注药处决。',
      polaroid: '【偏振滤光还原】苏澜患有 Phase 1 逆反期，大脑滤除所有否定词。真实意图为：【严禁】系安全绳；耳鸣时【必须戴上】耳罩！',
      truth: '用安全绳会使得一头【白行者】将整队人顺索拖走；耳鸣是【拟音喉】在校准共振峰。'
    },
    {
      num: '规则 2-2',
      title: '秦澈机械律',
      standard: '在管道爬行时，手脚只能落在承受压应力（Compression）的工字型混凝土横梁上；绝对不可触碰悬吊式的受拉钢缆。',
      truth: '【缆绳吊客】吸附在受拉钢索上，对高频张力震颤极其敏锐，触碰拉力钢缆必遭秒杀。'
    },
    {
      num: '规则 2-3',
      title: '逃生钥匙公理',
      standard: '绿色保险箱内装有反步兵破片地雷。雪地车唯一的离合启动钥匙是秦澈右臂机械骨骼内的钛合金液压主轴。',
      truth: '启动车辆必须获得秦澈的机械轴，而拆解该轴需要其神经解绑。'
    }
  ],
  3: [
    {
      num: '规则 3-1',
      title: '热羽流压制 (地表外部)',
      standard: '在零下 50℃ 的白蚀风暴中，严禁张口呼吸。必须口含碎冰将口腔压制至 0℃，排气管贴地排入积雪。',
      truth: '【白行者】无视线，完全依靠红外感应锁定高于 -10℃ 的上升热对流气体（呼出的白雾）。'
    },
    {
      num: '规则 3-2',
      title: '天线塔奇偶步进律',
      standard: '攀爬 80 米中央天线塔时必须闭眼单手行进，默数步数：第 81 级（奇数步）通向真实天线信号舱；第 82 级（偶数步）触发曲率坍缩直接跌入 -4F 倒悬冰穹。',
      moire: '【摩尔纹干涉码】第 82 级台阶受驻波干涉，是进入非欧几何深渊的单向重力滑梯。',
      truth: '人类双足步幅不对称，偶数步会触发共振折叠。'
    }
  ],
  4: [
    {
      num: '规则 4-1',
      title: '倒悬引力反弹',
      standard: '在倒悬冰穹中重力指向天顶。想要重返人间，不要向上攀爬，必须将全部负重投向脚底无底黑海。下坠动能会在穿越视界时转为升力。',
      truth: '莫比乌斯流形在底层的反向投射物理定律。'
    },
    {
      num: '规则 4-2',
      title: '因果律阻断公式',
      standard: 'Δt = Core × (1 - Identity)。若要终结莫比乌斯循环，必须用【原始未受污染载体（相态 2 顾言舟遗骸）】吸收全部时空残差，严禁炸毁反应堆。',
      moire: '【摩尔纹终极公式】将高纯抗冻血清注入相态 2 干尸的心脏，使 1994 年的感染源从源头失效！',
      truth: '祖父悖论的反向应用：治愈过去的原型，现在的异化体将因失去存在因果而瓦解。'
    }
  ]
};

// ==========================================================================
// 4. 剧情拓扑节点与决策树 (Story Graph)
// ==========================================================================
const STORY_NODES = {
  // ---------------- 第 1 幕：0F 避难舱与走廊危机 ----------------
  start: {
    title: '第一幕：避难所苏醒与初验',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 避难观测舱',
    timestamp: '1994-11-04 02:41:19 UTC',
    vitals: { temp: 36.8, spo2: 98, hr: 78 },
    text: `
      <p>刺骨的寒意从铁皮地面渗入骨髓。你猛烈咳嗽着醒来，眼前是一座布满冰霜与闪烁指示灯的地下控制舱。</p>
      <p>身旁的对讲机发出沙沙杂音，随后传来前任站长<strong>顾言舟</strong>沉稳而略带疲惫的声音：<em>“……第 4 组观测员陆巡，听到请回答。综合体已触发四级收容失效，请按桌面上的官方打印条例行事，我正在 0F 调度室为你监控撤离路线……”</em></p>
      <p>你撑起身子，发现机械师<strong>秦澈</strong>正坐在角落检修一把气动射钉枪，他呼吸粗重，脸色异样潮红；医官<strong>苏澜</strong>缩在墙角，用颤抖的双手紧握着一本日记本，瞳孔神经质地扩散。</p>
      <p>操作台的打字机托架上，卡着一张受潮发黄的纸页——<strong>《综合体撤离条例》</strong>。同时，你随身携带的防寒服口袋里放着一块厨房配给的<strong>【冻硬的午餐肉罐头】</strong>和<strong>【泪液冰点金属检测板】</strong>。</p>
    `,
    alert: null,
    onEnter: (state) => {
      state.inventory.push('canned_meat', 'tear_plate');
      state.currentPhaseUnlocked = 1;
    },
    choices: [
      {
        text: '仔细阅读操作台上的官方打字机条例，并查看室内温度计',
        target: 'node_check_rules_desk'
      },
      {
        text: '走向秦澈与苏澜，检查队友的生理体征与武器配备',
        target: 'node_check_companions_start'
      }
    ]
  },

  node_check_rules_desk: {
    title: '操作台前的异常读数',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 避难观测舱',
    timestamp: '1994-11-04 02:43:05 UTC',
    vitals: { temp: 36.7, spo2: 97, hr: 84 },
    text: `
      <p>你快步走到操作台前。打字机上的条例清晰印着：</p>
      <blockquote>【规则 1-1】若温度计读数攀升至 37℃ 以上，必须在 60 秒内拉下红色手柄启动全舱液氮降温。</blockquote>
      <p>就在你阅读的瞬间，墙壁上的水银温度计突然剧烈震颤，水银柱以肉眼可见的速度从 -5℃ 狂飙至 <strong>38.5℃</strong>！</p>
      <p>控制台正上方，一只标有“EMERGENCY NITROGEN”的粗壮红色手柄开始发出刺眼的红色爆闪，尖锐的蜂鸣声撕裂耳膜！倒计时屏幕跳出数字：<strong>59... 58... 57...</strong></p>
      <p>苏澜尖叫起来：<em>“温度飙升了！快拉液氮手柄！我们要被烤熟了！”</em></p>
    `,
    alert: '气温传感器异常跃迁：38.5℃！红色液氮自毁手柄激活！',
    choices: [
      {
        text: '立刻冲上前拉下红色手柄，启动全舱液氮降温',
        target: 'bad_end_airlock'
      },
      {
        text: '忽视温度计读数，脱下手套用手掌直接按压铝合金操作台面',
        target: 'node_touch_desk_truth'
      }
    ]
  },

  node_check_companions_start: {
    title: '队友的异态与隐秘手记',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 避难观测舱',
    timestamp: '1994-11-04 02:42:30 UTC',
    vitals: { temp: 36.8, spo2: 98, hr: 82 },
    text: `
      <p>你来到秦澈身旁。他见你走来，立刻用左手拉紧了防寒服领口，但你仍能清晰感受到他周身散发出的滚烫热浪。他的右臂是由沉重的军规外骨骼与高压油管构成的机械义肢。</p>
      <p>苏澜猛然抬头，眼神空洞地看着你，将手记推到你眼前：<em>“陆巡，看这个……不要相信广播里的顾站长……他在 30 年前就应该……”</em></p>
      <p>你注意到苏澜写下的字迹工整，但每一句话都透着强烈的别扭感。就在此时，警报大作，温度计跳变至 <strong>38.5℃</strong>，红色手柄倒计时启动！</p>
    `,
    alert: '气温传感器突变！液氮手柄警报触发！',
    choices: [
      {
        text: '怀疑传感器故障，伸手触碰操作台金属表面检验热传导',
        target: 'node_touch_desk_truth'
      },
      {
        text: '听从苏澜惊恐的叫喊，立刻扑向红色手柄',
        target: 'bad_end_airlock'
      }
    ]
  },

  node_touch_desk_truth: {
    title: '金属冰点与机械陷阱',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 避难观测舱',
    timestamp: '1994-11-04 02:44:11 UTC',
    vitals: { temp: 36.6, spo2: 97, hr: 90 },
    text: `
      <p>你的指尖猛然贴在裸露的铝合金操作台上——<strong>刺骨！冰冷得让皮肤几乎瞬间粘在金属上！</strong></p>
      <p>根据【元规则 Ⅲ 物理不变公理】：铝合金导热系数极高，若环境真有 38.5℃，台面绝不可能保持在零度以下！温度计被某种模因场篡改了读数！</p>
      <p>你立刻顺着红色手柄的背板检修孔向内看去：一根直径 4mm 的冷轧钢绞线穿过防爆隔板，<strong>并没有连接任何液氮阀门，而是死死连着外舱隔离门的机械防爆插销！</strong></p>
      <p>一旦拉动手柄，液氮不会喷洒，而是会瞬间拉开外门！门外漆黑的走廊里，隐约传来非人的刮擦声与沉重的呼吸。</p>
      <p>秦澈擦了一把冷汗，咬牙道：<em>“操……有人把排险手柄改造成了开门机关！差点中了圈套！”</em></p>
    `,
    alert: '实证成功：识破温度假象与开门陷阱！解密工具【血液浸润】获得实证支持。',
    choices: [
      {
        text: '维持红色手柄锁死，带领全队打开走廊内侧气闸，探索撤离通道',
        target: 'node_microwave_corridor'
      }
    ]
  },

  node_microwave_corridor: {
    title: '走廊的分歧：干燥与冰霜',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 环形走廊岔路',
    timestamp: '1994-11-04 02:47:40 UTC',
    vitals: { temp: 36.4, spo2: 96, hr: 95 },
    text: `
      <p>避难舱的内侧气闸滑开，眼前呈现出两条通向电梯井的走廊：</p>
      <ul>
        <li><strong>左侧走廊（干燥通道）</strong>：地面干爽无水迹，墙体没有任何冰霜，空气甚至带着一丝温热。完全符合打字机【规则 1-2：必须选择干燥无霜通道】的描述。</li>
        <li><strong>右侧走廊（凝霜通道）</strong>：管道凝结着厚达两指的坚硬白霜，铁丝网地板覆满冰凌，寒气逼人。</li>
      </ul>
      <p>苏澜盯着左侧通道喃喃自语：<em>“干燥通道……通风良好……必须走左边……”</em></p>
      <p>秦澈停下脚步，机械右臂发出轻微的电机嗡鸣：<em>“不对劲。极地地下设施没有任何加热管道，怎么可能维持大面积干燥无霜？”</em></p>
    `,
    alert: '走廊前方出现两条路径，请审慎决定行进方向。',
    choices: [
      {
        text: '按照规则指示，选择地面干燥无霜的左侧走廊快速通过',
        target: 'bad_end_microwave'
      },
      {
        text: '拿出背包里的冻硬午餐肉罐头，奋力掷向左侧干燥走廊',
        target: 'node_can_microwave_test'
      }
    ]
  },

  node_can_microwave_test: {
    title: '爆裂的肉罐头与隐形屠场',
    phase: 'PHASE I: 0F BREACH',
    location: '0F 走廊分歧点',
    timestamp: '1994-11-04 02:49:15 UTC',
    vitals: { temp: 36.3, spo2: 95, hr: 102 },
    text: `
      <p>你掏出铁皮午餐肉罐头，用力抛向左侧干燥走廊的中央。</p>
      <p>罐头在半空中滑行，刚越过分界线三米——<strong>轰！！！</strong></p>
      <p>铁皮瞬间向外极度鼓胀扭曲，内部冷冻的水分在 0.5 秒内剧烈汽化，伴随着一声沉闷的爆响，滚烫熟透的肉沫与高压蒸汽四处飞溅！现场没有任何火光，只有刺鼻的焦糊味与空气中强烈的电离臭氧气息！</p>
      <p>苏澜吓得瘫软在地上。秦澈瞳孔骤缩：<em>“是天花板里的 2450MHz 工业级微波灭菌器！功率开到了最大！谁走进去，谁的内脏就会在二十秒内彻底沸腾爆裂！”</em></p>
      <p>规则 1-2 所说的‘干燥无霜’，根本不是通风良好，而是强微波场把空气里的水分全烧干了！</p>
      <p>秦澈掏出一支<strong>【二氧化碳干冰灭火器】</strong>：<em>“右边凝霜通道有通向主电梯井的检修梯，但电梯可能被锁死了，我们得利用手动泄压阀强行跳入夹层！”</em></p>
    `,
    alert: '物理验证成功！缴获道具：二氧化碳干冰灭火器！解锁第 2 阶段规则！',
    onEnter: (state) => {
      state.inventory.push('dry_ice_extinguisher');
      state.currentPhaseUnlocked = 2;
    },
    choices: [
      {
        text: '全员进入右侧凝霜通道，利用泄压阀强行迫降电梯进入 -0.5F 夹层',
        target: 'node_enter_duct_p2'
      }
    ]
  },

  // ---------------- 第 2 幕：-0.5F 管道夹层与信任决裂 ----------------
  node_enter_duct_p2: {
    title: '第二幕：-0.5F 夹层死斗与信任测试',
    phase: 'PHASE II: -0.5F VOID',
    location: '-0.5F 缆道检修夹层',
    timestamp: '1994-11-04 03:12:08 UTC',
    vitals: { temp: 35.8, spo2: 92, hr: 110 },
    text: `
      <p>你们顺着凝霜通道滑入主电梯井。在电梯轿厢下行的瞬间，秦澈猛拉手动泄压阀，高压气体爆鸣喷出，轿厢硬生生卡在 0F 与 -1F 之间的阻尼段！</p>
      <p>撬开轿厢顶盖，上方显露出一条高仅 1.1 米、四壁布满高压铜管与受拉钢缆的狭长空腔——这就是被系统图纸抹去的 <strong>-0.5F 缆道夹层</strong>。</p>
      <p>众人伏地爬入。空气潮湿冰冷，前方管道壁上，能看到前任工程师用螺丝刀生生抠出的金属刻痕：<strong>【规则 2-2：只能踩踏受压横梁，绝不可碰触受拉钢缆！】</strong></p>
      <p>突然，身后的苏澜猛然暴起！她手持一把锋利的手术骨锯，死死抵住秦澈的咽喉，双眼布满红血丝，嘶声裂肺地吼道：</p>
      <p><em>“陆巡！别靠近他！你没摸到他的体温吗？！他浑身滚烫，体温起码 38 度！按照撤离条例，高热者必须就地处决！他已经被感染了，他是怪物！！”</em></p>
    `,
    alert: '内讧爆发！苏澜试图处决高热的秦澈！',
    choices: [
      {
        text: '相信苏澜的医学判断，协助她控制并处决体温高热的秦澈',
        target: 'bad_end_kill_qin'
      },
      {
        text: '上前强行夺下苏澜手中的骨锯，制止她的过激行为',
        target: 'bad_end_break_serum'
      },
      {
        text: '大喝制止两人，拿出金属检测板采集两人的泪液进行冰点测定',
        target: 'node_tear_test_decision'
      }
    ]
  },

  node_tear_test_decision: {
    title: '绝对防伪：泪液相变测试',
    phase: 'PHASE II: -0.5F VOID',
    location: '-0.5F 缆道检修夹层',
    timestamp: '1994-11-04 03:15:40 UTC',
    vitals: { temp: 35.5, spo2: 90, hr: 122 },
    text: `
      <p><em>“都给我住手！”</em> 你拔出气动射钉枪横在两人中间，掏出<strong>【双凹槽泪液检测板】</strong>拍在冰冷的钢管上：<em>“言语会骗人，感觉会骗人，只有眼泪的结冰温度骗不了人！”</em></p>
      <p>你迫使苏澜在左侧凹槽滴入一滴眼泪，随后用棉签取了秦澈眼角的一滴汗液与眼泪滴入右侧。</p>
      <p>检测板迅速导热降温至当前环境的 <strong>-5℃</strong>：</p>
      <ul>
        <li><strong>苏澜的泪液</strong>：在降至 <strong>-0.52℃</strong> 的瞬间，液体内部迅速析出六角形冰晶，整滴水珠凝结为剔透的人类冰花！</li>
        <li><strong>秦澈的泪液</strong>：随着温度一路暴跌至 -5℃、-10℃ 甚至 <strong>-14.8℃</strong>，水滴依旧呈现诡异的粘稠液态，毫无结冰迹象！</li>
      </ul>
      <p>死一般的寂静在逼仄的管道里蔓延。</p>
      <p>苏澜的泪水冰点完全正常，证明她的生理细胞是 100% 的纯人类；她只是因为视网膜盲斑扩散，大脑语言中枢陷入了滤除否定词的<strong>【逆反认知期】</strong>！</p>
      <p>而秦澈……他的眼泪已经分泌出极化抗冻糖蛋白，他的深层细胞确实已经开始不可逆地晶化异变！</p>
    `,
    alert: '真相揭晓：苏澜是纯人类（逆反受害者）；秦澈确已深层异化！',
    onEnter: (state) => {
      state.companionStates.su.tearTested = true;
      state.companionStates.su.tearVal = -0.52;
      state.companionStates.qin.tearTested = true;
      state.companionStates.qin.tearVal = -14.8;
    },
    choices: [
      {
        text: '看向秦澈，听取这位垂危机械师最后的自白',
        target: 'node_qin_sacrifice'
      }
    ]
  },

  node_qin_sacrifice: {
    title: '秦澈的决断：机械钥匙与自缚',
    phase: 'PHASE II: -0.5F VOID',
    location: '-0.5F 缆道深处',
    timestamp: '1994-11-04 03:19:22 UTC',
    vitals: { temp: 35.2, spo2: 89, hr: 115 },
    text: `
      <p>秦澈呆呆地看着那滴未结冰的眼泪，自嘲地笑了一声，眼眶通红：</p>
      <p><em>“原来……三天前在重水池抢修的时候，我就已经吸入孢子了。我一直以为只是重感冒发烧……”</em></p>
      <p>他的喉头开始发出极轻微的 4000Hz 超声杂音——那是异化物互相辨识的频标。但他依然保有完全的人类尊严与理性。</p>
      <p>秦澈抓起角磨机，狠狠咬住毛巾，<strong>反手切断了连接自己右肩神经束的高压线缆！</strong>伴随着火花与神经撕裂的闷哼，他将沉重的右臂机械义肢硬生生卸了下来，砸在你怀里：</p>
      <p><em>“陆巡……拆开小臂，里面那根钛合金液压主轴就是雪地车的钥匙！拿着它……带苏澜走通风管道去地表车库！”</em></p>
      <p>他抓过干冰灭火器，钻进身侧的一处狭小冷凝闸门，反手从里面将铁门焊死，并将整罐干冰喷向自己：</p>
      <p><em>“别回头！等我彻底变成怪物前，干冰会把我冻成铁块……快走！！”</em></p>
    `,
    alert: '获得关键道具：【秦澈的钛合金机械轴】！秦澈自我封印。',
    onEnter: (state) => {
      state.inventory.push('qin_hydraulic_axis');
      state.companionStates.qin.alive = false;
    },
    choices: [
      {
        text: '强忍悲痛背起苏澜，探索夹层深处寻找通向地表的排风口',
        target: 'node_find_gu_corpse'
      }
    ]
  },

  node_find_gu_corpse: {
    title: '冷库中的悖论：顾言舟的干尸',
    phase: 'PHASE II: -0.5F VOID',
    location: '-1F 废弃生物冷库',
    timestamp: '1994-11-04 03:26:00 UTC',
    vitals: { temp: 34.8, spo2: 88, hr: 105 },
    text: `
      <p>在穿过夹层底部的排风管时，你们误入了一间积满灰尘的废弃生物冷库。在厚重的冰挂之中，赫然坐着一具干枯的人形遗骸。</p>
      <p>遗骸身穿旧式科考服，右手垂落在地，握着一把仅剩一枚空弹壳的柯尔特左轮手枪。颅骨右侧有一个贯通的弹孔。</p>
      <p>你抹开其胸前的工作牌冰霜，上面赫然写着：</p>
      <blockquote>【首席科学家兼站长：顾言舟】<br>工号：0001 · 死亡鉴定日期：1994年10月12日</blockquote>
      <p>对讲机里，那位沉稳的“顾言舟”还在温和地呼叫着：<em>“陆巡，你们到达 -1F 了吗？请向左转进入主发电机房……”</em></p>
      <p>苏澜抱住头发出痛苦的抽泣：<em>“死人……死人一直在跟我们说话……我们都在死人创造的世界里……”</em></p>
      <p>你搜查遗骸，从其贴身衣袋里取出了苏澜一直寻找的<strong>【高纯度抗冻蛋白血清】</strong>，以及遗骸手中的<strong>【左轮手枪与顾言舟工作牌】</strong>！</p>
    `,
    alert: '因果悖论证实：顾言舟早在 30 年前就已自尽！获得关键道具【抗冻血清】与【顾言舟干尸遗物】！',
    onEnter: (state) => {
      state.inventory.push('pure_antifreeze_serum', 'gu_corpse_token');
      state.companionStates.guPhase = 2;
    },
    choices: [
      {
        text: '收好血清与遗物，爬入垂直主排风道，强行攀爬冲向 0F 极地外部！',
        target: 'node_surface_blizzard_p3'
      }
    ]
  },

  // ---------------- 第 3 幕：0F 地表极夜白蚀暴风雪 ----------------
  node_surface_blizzard_p3: {
    title: '第三幕：白蚀暴风雪与天线陷阱',
    phase: 'PHASE III: WHITEOUT',
    location: '0F 极地外部冰原',
    timestamp: '1994-11-04 03:45:12 UTC',
    vitals: { temp: 34.2, spo2: 86, hr: 118 },
    text: `
      <p>你们撞开被冰雪压实的排气百叶窗，翻滚着跌入了极夜的冰原。</p>
      <p>狂风如同成千上万头巨兽在咆哮，能见度不足五米。零下 50℃ 的绝对严寒瞬间让你的睫毛结出厚重的冰针。夜空中，深绿与血红交织的极光像沸腾的瀑布般翻滚燃烧，空气中弥漫着强烈的电离臭氧味。</p>
      <p>前方两百米外的雪雾中，隐约出现了一个身高超过四米的极细白色骨架人形——<strong>【白行者】</strong>！它在呼啸的狂风中漫步，头部没有五官，只有两道极度敏感的红外感知裂隙在微微颤动。</p>
      <p>苏澜因为严寒，胸口剧烈起伏，几乎下意识地要张开嘴大口吸气呼出浓郁的白雾！</p>
    `,
    alert: '致命危机：白行者在前方徘徊！规则 3-1 正在受检验！',
    onEnter: (state) => {
      state.currentPhaseUnlocked = 3;
    },
    choices: [
      {
        text: '大声喊叫提醒苏澜快跑，同时拼命向前狂奔冲向车库',
        target: 'bad_end_whitestrider'
      },
      {
        text: '抓一把积雪塞入口中压低口腔温度，贴紧雪地伏地潜行',
        target: 'node_evade_strider_success'
      }
    ]
  },

  node_evade_strider_success: {
    title: '绝对零度潜行与双怪夹击',
    phase: 'PHASE III: WHITEOUT',
    location: '0F 外部天线基座',
    timestamp: '1994-11-04 03:52:40 UTC',
    vitals: { temp: 33.5, spo2: 82, hr: 135 },
    text: `
      <p>冰雪在口腔内融化，刺骨的麻木感让你几乎失去知觉，但口腔温度被强行压制到了 <strong>0℃</strong>！呼出的气体不再形成升腾的热对流羽流，而是被贴地的导流管导入松软的雪层深处。</p>
      <p>【白行者】无声无息地从你们上方三米处跨过，细长的晶化脚爪刺入冰层，带起一阵白霜，随后隐入风暴之中。</p>
      <p>然而，当你们爬到中央天线塔基座时，异变骤生：</p>
      <p>右侧风暴中传来了你<strong>已故母亲撕心裂肺的呼唤声</strong>，声波穿透头盔，震得你内耳剧痛——是<strong>【拟音喉】</strong>！它在用高能超声波锁定你的方位！</p>
      <p>与此同时，左侧视线边缘的黑暗里，一团没有实质的巨大黑斑正随着你的眼球转动而游弋——是<strong>【盲斑】</strong>！只要你一眨眼，它就会在你的生理盲区内实体化并折断你的颈椎！</p>
    `,
    alert: '绝死困境：左侧【盲斑】（盲区杀人）与右侧【拟音喉】（听觉撕裂）同时围攻！',
    choices: [
      {
        text: '双眼死死盯住正前方天线塔的红灯，保持视线平直绝不移开',
        target: 'bad_end_scotoma'
      },
      {
        text: '闭起左眼，用便携电池短路制造高压电弧爆鸣，同时将强光手电照向拟音喉',
        target: 'node_monsters_counter_kill'
      }
    ]
  },

  node_monsters_counter_kill: {
    title: '怪物的盲区互噬',
    phase: 'PHASE III: WHITEOUT',
    location: '0F 外部天线基座',
    timestamp: '1994-11-04 03:56:15 UTC',
    vitals: { temp: 33.2, spo2: 79, hr: 155 },
    text: `
      <p>你的血氧降到了 <strong>79%</strong>（视野收窄为管状，<strong>元规则 Ⅰ 算子反转激活！</strong>）；极度紧张让你的心率飙升至 <strong>155 bpm</strong>（<strong>视网膜摩尔纹干涉已就绪！</strong>）。</p>
      <p>你闭起左眼，用单眼余光死死压制【盲斑】的实体化；右手猛然将便携电瓶的铜导线狠狠搭在铁塔接地线上！</p>
      <p><strong>噼啪——轰！！！</strong></p>
      <p>一道耀眼刺目的万伏高压电弧在风雪中暴烈炸开，伴随着高达 10,000Hz 的金属爆鸣！【拟音喉】脆弱的次声囊瞬间被强频超载，发出凄厉痛苦的痉挛嘶鸣！</p>
      <p>趁其失去平衡，你猛然转动手电筒反光镜，<strong>将【盲斑】的虚数阴影，不偏不倚投射进了【拟音喉】张开的喉管裂口盲区内！</strong></p>
      <p>【盲斑】在【拟音喉】的身体内部瞬间进入实体化状态——喀嚓！伴随着令人牙酸的骨骼碎裂声，两头不可名状的恐怖畸变体在彼此的体内疯狂撕扯、坍缩，最终双双化为一滩冻结的黑色残渣！</p>
    `,
    alert: '神级解密：诱导怪物相克互噬成功！摩尔纹干涉已激活！血氧反转逻辑生效！',
    onEnter: (state) => {
      state.activeTools.moire = true;
    },
    choices: [
      {
        text: '抓住战机，立刻冲上 80 米中央天线塔的旋梯！',
        target: 'node_antenna_climb'
      }
    ]
  },

  node_antenna_climb: {
    title: '天线塔的奇偶深渊',
    phase: 'PHASE III: WHITEOUT',
    location: '中央天线塔旋梯',
    timestamp: '1994-11-04 04:02:10 UTC',
    vitals: { temp: 32.8, spo2: 78, hr: 162 },
    text: `
      <p>两人冒着狂风冲上天线塔的金属旋梯。严寒与缺氧让呼吸如同刀割。</p>
      <p>此时，【规则 3-2 奇偶步进律】在脑海中炸响：</p>
      <blockquote>第 81 级（奇数步）通向真实天线信号舱；第 82 级（偶数步）触发曲率坍缩直接跌入 -4F 倒悬冰穹！</blockquote>
      <p>苏澜因为力竭，手脚并用地向上攀爬，嘴里数着：<em>“79……80……81……82……”</em></p>
      <p><em>“苏澜，别踏第 82 级！！”</em> 你大吼着伸手去抓，但已经太迟了——苏澜的右靴稳稳落在了第 82 级台阶上。</p>
      <p>刹那间，那级台阶化作了一道深不见底的引力漩涡！苏澜整个人在一声惊呼中，瞬间被反转的重力拉向无底虚空，消失在扭曲的光晕里！</p>
      <p>而你，因为右靴底预先绑了钢钉，步幅短了 5 厘米，你的身体结结实实停留在<strong>第 81 级台阶</strong>上！</p>
      <p>前方是一道厚重的高空防爆门，里面是天线塔顶端的信号机房与终端控制台。</p>
    `,
    alert: '苏澜跌入 -4F 倒悬冰穹！主角成功登顶第 81 级真实平台！',
    choices: [
      {
        text: '推门进入信号舱，查阅机载最高权限档案，面临终局抉择',
        target: 'node_antenna_cabin_choice'
      }
    ]
  },

  node_antenna_cabin_choice: {
    title: '天线机房内的终极分歧',
    phase: 'PHASE IV: CONVERGENCE',
    location: '天线塔顶信号舱',
    timestamp: '1994-11-04 04:08:33 UTC',
    vitals: { temp: 32.5, spo2: 78, hr: 150 },
    text: `
      <p>信号舱内，古老的示波器正泛着幽绿的光芒。你在控制台上找到了基站建造时由顾言舟亲手写下的最后备忘录：</p>
      <blockquote>“这里从来不是科考站。它是地球磁极被人类钻井穿刺后形成的【时空莫比乌斯环】。地表车库里的雪地车哪怕跑一万公里，也只会在这片十公里的环形时空里打转。要打破闭环，必须进入 -4F 倒悬核心，重置最初的因果锚点。”</blockquote>
      <p>窗外风暴稍歇，你看到下方地表车库的大门已被暴风吹开，停机坪上的重型雪地车完好无损。如果你现在下楼，凭借手中的【秦澈机械轴】，你可以直接开走车辆突围。</p>
      <p>但如果你想彻底拯救苏澜、终结这 30 年的无休止轮回，你必须主动跳下第 82 级的时空裂隙，坠入那片连神明都无法涉足的 <strong>-4F 倒悬冰穹</strong>！</p>
    `,
    alert: '终局分歧：【方案 A：地表雪地车常规生还】 vs 【方案 B：跌入 -4F 破译世界真相】！',
    onEnter: (state) => {
      state.currentPhaseUnlocked = 4;
    },
    choices: [
      {
        text: '放弃深渊冒险，下塔启动雪地车，向南突围冲出极夜风暴',
        target: 'ending_escape_only'
      },
      {
        text: '带上相态 2 遗骨与血清，纵身跃入第 82 级时空奇点',
        target: 'node_enter_abyss_p4'
      }
    ]
  },

  // ---------------- 第 4 幕：-4F 倒悬冰穹与真理决战 ----------------
  node_enter_abyss_p4: {
    title: '第四幕：-4F 倒悬冰穹与母核对峙',
    phase: 'PHASE IV: CONVERGENCE',
    location: '-4F 倒悬冰穹核心',
    timestamp: '1994-11-04 04:20:00 UTC',
    vitals: { temp: 31.8, spo2: 75, hr: 168 },
    text: `
      <p>狂风在耳边逆向呼啸。失重感持续了整整三十秒，随后你重重摔在一面坚硬而透明的冰晶天花板上。</p>
      <p>这里的物理学彻底颠倒了：<strong>天花板变成了地面，而原本的地底深处，变成了一片浩瀚无垠、倒悬在头顶的无底黑海！</strong></p>
      <p>苏澜正倒在前方十米处，微弱地喘息着。在冰穹中央，巨大的超导反应堆散发着幽蓝的<strong>切伦科夫辐射冷光</strong>。</p>
      <p>反应堆中央的超导线圈中，熔铸着一具庞大而畸变的生化母体——那是<strong>顾言舟（相态 4）</strong>！无数神经光缆刺入他半晶化的大脑，对讲机里那个沉稳的声音，此刻直接在你的脑髓深处回荡：</p>
      <p><em>“陆巡……你终于来了。30 年了，每一千次循环里，只有三个你能够走到这一步。但你们最终都选择引爆核反应堆，让循环再次扩大。放弃吧，人类的自私与求生本能无法破解这道因果方程。”</em></p>
    `,
    alert: '直面母核！根据规则 4-1 与 4-2，必须做出最终物理与因果决断！',
    choices: [
      {
        text: '拔出腰间的信号枪，射击超导反应堆的高压氢储罐引发大爆炸',
        target: 'bad_end_reactor_blast'
      },
      {
        text: '将高纯抗冻血清注入相态 2 顾言舟干尸的心脏，并将干尸推入超导线圈',
        target: 'ending_true_breakthrough'
      }
    ]
  },

  // ---------------- 六大结局定义 ----------------
  bad_end_airlock: {
    title: 'BAD END 1：气闸屠场',
    phase: 'TERMINATED',
    location: '0F 避难舱门外',
    timestamp: '1994-11-04 02:45:00 UTC',
    vitals: { temp: 0, spo2: 0, hr: 0 },
    text: `
      <p>你用尽全身力气扳下了红色手柄。伴随着高压气阀的刺耳泄压声，厚重的防爆隔离门突然向两侧滑开！</p>
      <p>门外没有任何液氮，只有数头戴着白色破损防毒面具的恐怖拟态体。面具在黑暗中脱落，露出了长满复眼与口器的空洞血肉。</p>
      <p>它们如同潮水般涌入避难舱，在苏澜绝望的惨叫声中将一切撕成碎片。你死前的最后一眼，看到打字机纸上【规则 1-1】的油墨，在鲜血浸润下慢慢浮现出一行嘲弄的小字：<em>“红色把手是开门栓……”</em></p>
    `,
    isEnding: true,
    endingId: 'be_1',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_check_rules_desk' }]
  },

  bad_end_microwave: {
    title: 'BAD END 2：微波焦尸',
    phase: 'TERMINATED',
    location: '0F 干燥走廊',
    timestamp: '1994-11-04 02:48:30 UTC',
    vitals: { temp: 100, spo2: 0, hr: 0 },
    text: `
      <p>你带头踏入了地面干燥无霜的左侧走廊。刚走出五步，空气突然变得炽热黏稠，视野中所有的光线开始扭曲。</p>
      <p>你感到血液在血管里疯狂咆哮沸腾，眼球在眼眶中受热爆裂，五脏六腑如同被架在烈火熔炉上炙烤！你甚至来不及发出一声呼救，整个人在强高频微波辐射下轰然倒地，脱水炭化为一具冒着黑烟的焦尸。</p>
      <p>地面干燥，是因为连空气分子都被烧干了。你成了微波走廊里又一具无名的炭化标本。</p>
    `,
    isEnding: true,
    endingId: 'be_2',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_microwave_corridor' }]
  },

  bad_end_kill_qin: {
    title: 'BAD END 3：误杀与孤立',
    phase: 'TERMINATED',
    location: '-0.5F 夹层',
    timestamp: '1994-11-04 03:13:50 UTC',
    vitals: { temp: 34.0, spo2: 60, hr: 0 },
    text: `
      <p>你协助精神失常的苏澜扑向了秦澈。在混乱的搏斗中，秦澈的手臂外骨骼被强行打碎，气动射钉枪走火击穿了主通风管。</p>
      <p>濒死的秦澈看着你，眼中充满悲凉与绝望。失去秦澈的机械维护，你们根本无法在复杂的夹层中辨认方向。三个小时后，伴随着【缆绳吊客】顺着震动的钢缆无声滑落，你们在极度严寒与怪物围攻中耗尽了最后一丝热量。</p>
    `,
    isEnding: true,
    endingId: 'be_3',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_enter_duct_p2' }]
  },

  bad_end_break_serum: {
    title: 'BAD END 4：打碎的希望',
    phase: 'TERMINATED',
    location: '-0.5F 夹层',
    timestamp: '1994-11-04 03:14:20 UTC',
    vitals: { temp: 33.5, spo2: 50, hr: 0 },
    text: `
      <p>你粗暴地夺下苏澜的手术锯并将她推倒在地。苏澜的背包狠狠砸在铁管上，里面唯一的密封血清试管应声粉碎，晶莹的解药液体渗入冰缝蒸发殆尽。</p>
      <p>秦澈的异化在数分钟后全面爆发，失去了血清作为最终反制的希望，整座避难所陷入了不可逆的绝望死斗。</p>
    `,
    isEnding: true,
    endingId: 'be_4',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_enter_duct_p2' }]
  },

  bad_end_whitestrider: {
    title: 'BAD END 5：雪原猎物',
    phase: 'TERMINATED',
    location: '0F 极地地表',
    timestamp: '1994-11-04 03:46:30 UTC',
    vitals: { temp: 0, spo2: 0, hr: 0 },
    text: `
      <p>你大声呼喊着在深及膝盖的雪地里狂奔。零下 50℃ 的狂风灌入口鼻，你剧烈喘息，每一下呼吸都在极夜的寒空中喷出一团浓白滚烫的热水汽！</p>
      <p>上方的【白行者】裂隙骤然转动。四米高的骨架在风暴中快如闪电，两道惨白的冰刺瞬间贯穿了你的胸膛，将你高高挑起在半空中。血液甚至来不及滴落在地，就在暴风雪中凝结成了鲜红的冰晶。</p>
    `,
    isEnding: true,
    endingId: 'be_5',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_surface_blizzard_p3' }]
  },

  bad_end_scotoma: {
    title: 'BAD END 6：盲斑折颈',
    phase: 'TERMINATED',
    location: '0F 天线塔下',
    timestamp: '1994-11-04 03:54:10 UTC',
    vitals: { temp: 0, spo2: 0, hr: 0 },
    text: `
      <p>你双眼死死盯着正前方的红灯，哪怕睫毛结冰也绝不移动眼珠。你以为你在克制恐惧，却忘记了人类视网膜拥有先天的生理盲点！</p>
      <p>【盲斑】精确地滑入了你右眼颞侧 15 度的视野暗区。在完全没有感光信号的瞬间，虚数阴影凝聚成冰冷的钢铁巨爪，从背后无声无息地拧断了你的第七颈椎。</p>
    `,
    isEnding: true,
    endingId: 'be_6',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_evade_strider_success' }]
  },

  bad_end_reactor_blast: {
    title: 'BAD END 7：环形重置',
    phase: 'TERMINATED',
    location: '-4F 倒悬冰穹',
    timestamp: '1994-11-04 04:22:15 UTC',
    vitals: { temp: 5000, spo2: 0, hr: 0 },
    text: `
      <p>你绝望地向超导氢罐扣动扳机。烈焰与核等离子体在千分之一秒内将整个冰穹化为白昼。然而，莫比乌斯时空并没有被摧毁，狂暴的能量顺着拓扑流形被全盘压缩回了 1994 年 11 月 4 日的清晨。</p>
      <p>光芒消散后，你再次在 0F 避难舱的冰冷地面上惊醒，对讲机里再次响起了顾言舟沉稳的呼叫……轮回再次开始。</p>
    `,
    isEnding: true,
    endingId: 'be_7',
    choices: [{ text: '回溯至分歧节点重新推演', target: 'node_enter_abyss_p4' }]
  },

  // --- 终局 1：普通生还 ---
  ending_escape_only: {
    title: 'ENDING 1：冻土幽灵 (常规逃生)',
    phase: 'ESCAPE ACHIEVED',
    location: '北极圈外沿 · 挪威哨卡',
    timestamp: '1994-11-06 08:30:00 UTC',
    vitals: { temp: 36.4, spo2: 98, hr: 80 },
    text: `
      <p>你没有选择跳入深渊。你冲下天线塔，利用秦澈的机械轴启动了重型雪地车，将油门踩到底，冲破了白蚀风暴圈。</p>
      <p>在冰原上狂飙了两天两夜后，雪地车耗尽了最后一滴柴油，停在北极圈外沿的挪威科考站前。你被冻得奄奄一息，但你活了下来。</p>
      <p>军医在加护病房里为你做全面体检。你裹着毛毯，喝着热汤，看着窗外初升的人间晨曦。</p>
      <p>突然，身旁的收音机发出刺耳的杂音，传出了顾言舟那熟悉而诡异的语调：<em>“……汇报当前位置，第 15 轮逃生模拟数据已成功上传……”</em></p>
      <p>你惊恐地摸向自己的眼眶，在镜子前，你发现自己的眼角流下一滴眼泪——在温暖的 24℃ 室温病房里，那滴眼泪竟未曾化开，依旧是一朵坚硬剔透的晶化冰花……你逃出了基地，却把莫比乌斯环的种子带向了整个人类世界。</p>
    `,
    isEnding: true,
    endingId: 'end_1',
    choices: [{ text: '查看时空图谱，尝试解开唯一真结局', target: 'node_antenna_cabin_choice' }]
  },

  // --- 终局 2：真理破晓 ---
  ending_true_breakthrough: {
    title: 'ENDING 2：晨曦破晓 (真理终局 · 轮回终结)',
    phase: 'TOPOLOGY RESOLVED',
    location: '现实世界 · 北冰洋考察船甲板',
    timestamp: '1994-11-04 06:14:00 UTC',
    vitals: { temp: 36.8, spo2: 99, hr: 75 },
    text: `
      <p>你没有攻击母核，而是将那一支高纯度抗冻蛋白血清，<strong>狠狠扎入了相态 2 顾言舟原始干尸的心脏，并用尽全身力气将干尸推入了超导反应堆的核心线圈！</strong></p>
      <p><strong>祖父悖论的反向坍缩在这一刻暴烈激活！</strong></p>
      <p>在因果链的源头，30 年前的顾言舟在自尽前被注入了血清，使“1994年全站异化”这一事件在物理学上失去了成立的前提！</p>
      <p>相态 4 的母体发出惊恐绝望的超声哀鸣，庞大的生化肢体像褪色的旧胶卷般寸寸风化碎裂！整个非欧几何空间剧烈震颤，倒悬的黑海倾泻而下，但在触碰你的一瞬间化作了温暖的晨光！</p>
      <hr style="border-color: rgba(0,240,255,0.2); margin: 16px 0;">
      <p>“醒醒，陆巡工程师，快醒醒！”</p>
      <p>你猛然睁开眼，大口呼吸着清新温润的空气。身旁没有冰雪，没有怪物，只有明亮整洁的现代化极地考察船实验室。</p>
      <p>头发花白但完好无损、穿着白大褂的<strong>顾言舟站长</strong>正微笑着递来一杯热咖啡：<em>“深度低温减压引起的意识解离综合征终于平复了。这次深井地磁勘探圆满成功，全站 47 人，无一伤亡。”</em></p>
      <p>秦澈正在一旁擦拭着他完好的双臂和工具箱，苏澜端着测试板笑盈盈地记录数据。</p>
      <p>窗外，是生机勃勃的北冰洋海面，海鸥鸣叫着掠过晴空，一轮绚丽的朝阳将万顷波涛染成纯粹的金红。你摊开手掌，掌心躺着那枚刻着<strong>【敬人类不屈的理性】</strong>的钛合金螺栓。你微微一笑，终于确信：人类的理性与勇气，战胜了不可名状的深渊。</p>
    `,
    isEnding: true,
    endingId: 'end_2',
    choices: [{ text: '重温这场惊心动魄的理智之战', target: 'start' }]
  }
};

// ==========================================================================
// 5. 游戏全局状态管理器 (Game State Manager)
// ==========================================================================
const GameState = {
  vitals: {
    temp: 36.8,
    spo2: 98,
    hr: 76,
    location: '0F 避难观测舱'
  },
  inventory: [],
  activeTools: {
    blood: false,
    polaroid: false,
    moire: false
  },
  companionStates: {
    qin: { temp: 38.2, tearTested: false, tearVal: null, alive: true },
    su: { temp: 36.5, tearTested: false, tearVal: null, alive: true },
    guPhase: 1
  },
  currentPhaseUnlocked: 1,
  currentRuleSubtab: 0,
  fontScale: 1.15,
  historyStack: [],
  currentNodeId: 'start',
  visitedNodes: ['start'],
  unlockedEndings: new Set(),

  init() {
    this.fontScale = 1.15;
    document.documentElement.style.setProperty('--font-scale', this.fontScale.toFixed(2));
    this.renderNode('start');
    this.bindEvents();
    this.updateUI();
  },

  reset() {
    this.vitals = { temp: 36.8, spo2: 98, hr: 76, location: '0F 避难观测舱' };
    this.inventory = [];
    this.activeTools = { blood: false, polaroid: false, moire: false };
    this.companionStates = {
      qin: { temp: 38.2, tearTested: false, tearVal: null, alive: true },
      su: { temp: 36.5, tearTested: false, tearVal: null, alive: true },
      guPhase: 1
    };
    this.currentPhaseUnlocked = 1;
    this.currentRuleSubtab = 0;
    this.visitedNodes = ['start'];
    this.historyStack = [];
    this.renderNode('start');
    this.updateUI();
    this.log('循环已重置至起点：0F 避难观测舱。');
  },

  rewindStep() {
    if (this.historyStack.length === 0) return;
    const prev = this.historyStack.pop();
    this.vitals = { ...prev.vitals };
    this.inventory = [ ...prev.inventory ];
    this.activeTools = { ...prev.activeTools };
    this.companionStates = JSON.parse(JSON.stringify(prev.companionStates));
    this.currentPhaseUnlocked = prev.currentPhaseUnlocked;
    this.currentRuleSubtab = prev.currentRuleSubtab;
    this.renderNode(prev.nodeId, true);
    this.log(`因果线已回溯至上一个抉择点：${STORY_NODES[prev.nodeId].title}`);
    audio.playClick();
  },

  renderNode(nodeId, isRewind = false) {
    const node = STORY_NODES[nodeId];
    if (!node) {
      console.error('Node not found:', nodeId);
      return;
    }

    // 记录前进历史快照
    if (!isRewind && this.currentNodeId && this.currentNodeId !== nodeId) {
      this.historyStack.push({
        nodeId: this.currentNodeId,
        vitals: { ...this.vitals },
        inventory: [ ...this.inventory ],
        activeTools: { ...this.activeTools },
        companionStates: JSON.parse(JSON.stringify(this.companionStates)),
        currentPhaseUnlocked: this.currentPhaseUnlocked,
        currentRuleSubtab: this.currentRuleSubtab
      });
    }

    this.currentNodeId = nodeId;
    if (!this.visitedNodes.includes(nodeId)) {
      this.visitedNodes.push(nodeId);
    }

    // 更新生理指标
    if (node.vitals) {
      this.vitals.temp = node.vitals.temp;
      this.vitals.spo2 = node.vitals.spo2;
      this.vitals.hr = node.vitals.hr;
    }
    if (node.location) {
      this.vitals.location = node.location;
    }

    // 触发节点回调
    if (typeof node.onEnter === 'function') {
      node.onEnter(this);
    }

    // 记录结局解锁
    if (node.isEnding && node.endingId) {
      this.unlockedEndings.add(node.endingId);
      audio.playAlarm();
    }

    // 渲染故事卡片
    document.getElementById('story-timestamp').innerText = node.timestamp || '1994-11-04 UTC';
    document.getElementById('story-phase').innerText = node.phase || 'HERMES PROTOCOL';
    document.getElementById('story-title').innerText = node.title;

    // 文本与警报渲染
    document.getElementById('story-content').innerHTML = node.text;
    const alertEl = document.getElementById('story-alert');
    if (node.alert) {
      alertEl.style.display = 'flex';
      document.getElementById('story-alert-text').innerText = node.alert;
    } else {
      alertEl.style.display = 'none';
    }

    // 渲染选项列表
    const choicesListEl = document.getElementById('choices-list');
    choicesListEl.innerHTML = '';
    node.choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${c.text}</span>`;
      btn.onclick = () => {
        audio.playClick();
        this.renderNode(c.target);
      };
      choicesListEl.appendChild(btn);
    });

    // 滚动至顶部
    document.querySelector('.story-terminal-card').scrollTop = 0;

    this.updateUI();
  },

  updateUI() {
    // 1. 遥测仪表更新
    const tempEl = document.getElementById('telem-temp');
    const spo2El = document.getElementById('telem-spo2');
    const hrEl = document.getElementById('telem-hr');
    const locEl = document.getElementById('telem-location');

    tempEl.innerText = this.vitals.temp.toFixed(1);
    spo2El.innerText = this.vitals.spo2;
    hrEl.innerText = this.vitals.hr;
    locEl.innerText = this.vitals.location;

    // 进度条与警报颜色
    document.getElementById('gauge-temp').style.width = `${Math.min(100, Math.max(0, (this.vitals.temp - 30) * 10))}%`;
    document.getElementById('gauge-spo2').style.width = `${this.vitals.spo2}%`;
    document.getElementById('gauge-hr').style.width = `${Math.min(100, (this.vitals.hr / 180) * 100)}%`;

    // 核心体温颜色
    if (this.vitals.temp > 37.5 || this.vitals.temp < 34.0) {
      tempEl.style.color = 'var(--accent-danger)';
    } else {
      tempEl.style.color = 'var(--text-bright)';
    }

    // 血氧反转徽章 (SpO2 < 80%)
    const badgeInv = document.getElementById('badge-inversion');
    if (this.vitals.spo2 < 80) {
      badgeInv.innerText = '算子反转生效中';
      badgeInv.className = 'telem-badge active-danger';
    } else {
      badgeInv.innerText = '反转未触发';
      badgeInv.className = 'telem-badge';
    }

    // 心率摩尔纹徽章 (HR >= 150)
    const badgeMoire = document.getElementById('badge-moire');
    const toolMoire = document.getElementById('tool-moire');
    if (this.vitals.hr >= 150) {
      badgeMoire.innerText = '摩尔纹已激活';
      badgeMoire.className = 'telem-badge active-amber';
      toolMoire.disabled = false;
      document.getElementById('moire-state').innerText = '就绪';
    } else {
      badgeMoire.innerText = '摩尔纹隐匿';
      badgeMoire.className = 'telem-badge';
      toolMoire.disabled = true;
      document.getElementById('moire-state').innerText = '不可用';
    }

    // 2. 解锁规则子标签页状态
    for (let p = 2; p <= 4; p++) {
      const subtab = document.getElementById(`subtab-p${p}`);
      if (subtab) {
        if (this.currentPhaseUnlocked >= p) {
          subtab.disabled = false;
          subtab.innerText = p === 2 ? '夹层检修' : (p === 3 ? '地表极夜' : '倒悬冰穹');
        } else {
          subtab.disabled = true;
          subtab.innerText = `-- 阶段 ${p} (锁) --`;
        }
      }
    }

    // 3. 渲染规则列表
    this.renderRules();

    // 4. 渲染道具栏
    this.renderInventory();

    // 5. 渲染同伴卡片
    this.renderRoster();

    // 6. 结局数
    document.getElementById('unlocked-endings-count').innerText = this.unlockedEndings.size;
    document.getElementById('modal-endings-count').innerText = this.unlockedEndings.size;

    // 7. 回溯按钮状态更新
    const canRewind = this.historyStack.length > 0;
    const btnRewind = document.getElementById('btn-rewind');
    const btnChoiceRewind = document.getElementById('btn-choice-rewind');
    if (btnRewind) btnRewind.disabled = !canRewind;
    if (btnChoiceRewind) btnChoiceRewind.disabled = !canRewind;
  },

  renderRules() {
    const container = document.getElementById('rule-display-area');
    container.innerHTML = '';
    const phaseRules = RULES_DB[this.currentRuleSubtab] || [];

    phaseRules.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'rule-card';

      // 判断滤镜状态
      let bodyContent = r.standard;
      let stateTag = '表层文字';

      // 算子反转状态优先生效
      if (this.vitals.spo2 < 80 && r.inversion) {
        bodyContent = `<strong style="color:var(--accent-danger)">【元规则 Ⅰ 算子反向求补】</strong>: ${r.inversion}`;
        stateTag = '算子反转';
        card.classList.add('polaroid-revealed');
      } else if (this.activeTools.moire && r.moire) {
        bodyContent = r.moire;
        stateTag = '纳米摩尔纹干涉';
        card.classList.add('moire-active');
      } else if (this.activeTools.polaroid && r.polaroid) {
        bodyContent = r.polaroid;
        stateTag = '充血偏振显影';
        card.classList.add('polaroid-revealed');
      } else if (this.activeTools.blood && r.blood) {
        bodyContent = r.blood;
        stateTag = '二价铁络合显影';
        card.classList.add('blood-soaked');
      }

      card.innerHTML = `
        <div class="rule-card-header">
          <span class="rule-num">${r.num}：${r.title}</span>
          <span class="rule-state-tag">${stateTag}</span>
        </div>
        <div class="rule-body">${bodyContent}</div>
        ${r.truth ? `<div class="rule-truth-hint">💡 逻辑闭环注解: ${r.truth}</div>` : ''}
      `;
      container.appendChild(card);
    });
  },

  renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const emptyHint = document.getElementById('inv-empty-hint');
    const countEl = document.getElementById('inv-count');

    countEl.innerText = this.inventory.length;
    grid.innerHTML = '';

    if (this.inventory.length === 0) {
      emptyHint.style.display = 'block';
      document.getElementById('item-inspector').style.display = 'none';
      return;
    }

    emptyHint.style.display = 'none';
    this.inventory.forEach((itemId) => {
      const item = ITEMS_DB[itemId];
      if (!item) return;

      const card = document.createElement('div');
      card.className = 'inv-item-card';
      card.innerHTML = `
        <div class="inv-item-name">${item.name}</div>
        <div class="inv-item-tag">[ ${item.tag} ]</div>
      `;
      card.onclick = () => {
        document.querySelectorAll('.inv-item-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const insp = document.getElementById('item-inspector');
        insp.style.display = 'block';
        document.getElementById('item-inspect-name').innerText = item.name;
        document.getElementById('item-inspect-traits').innerText = item.traits;
        document.getElementById('item-inspect-desc').innerText = item.desc;
        audio.playClick();
      };
      grid.appendChild(card);
    });
  },

  renderRoster() {
    // 秦澈
    const qin = this.companionStates.qin;
    document.getElementById('qin-temp').innerText = qin.alive ? `${qin.temp.toFixed(1)}℃` : '已冷冻/离线';
    document.getElementById('qin-tear').innerText = qin.tearTested ? `${qin.tearVal}℃ (未结冰·深层异化)` : '未测定';
    if (!qin.alive) {
      document.getElementById('qin-status-tag').innerText = '自断右臂·自我冷冻';
      document.getElementById('qin-status-tag').className = 'roster-status status-unknown';
    }

    // 苏澜
    const su = this.companionStates.su;
    document.getElementById('su-tear').innerText = su.tearTested ? `${su.tearVal}℃ (正常结冰·纯人类)` : '未测定';

    // 顾言舟
    const guEl = document.getElementById('gu-phase-state');
    if (this.companionStates.guPhase === 1) {
      guEl.innerText = '相态 1 (1994年广播调度员)';
    } else if (this.companionStates.guPhase === 2) {
      guEl.innerText = '相态 2 (冷库干尸·饮弹自尽30年)';
    } else {
      guEl.innerText = '相态 4 (超导反应堆神经母核)';
    }
  },

  log(msg) {
    document.getElementById('footer-log-text').innerText = msg;
  },

  bindEvents() {
    // 0. 字号调节按钮
    const updateFontScale = (newScale) => {
      this.fontScale = Math.max(0.85, Math.min(1.65, newScale));
      document.documentElement.style.setProperty('--font-scale', this.fontScale.toFixed(2));
      const percentage = Math.round((this.fontScale / 1.15) * 100);
      const label = document.getElementById('font-size-label');
      if (label) label.innerText = `${percentage}%`;
      audio.playClick();
    };
    const btnFontDec = document.getElementById('btn-font-dec');
    const btnFontInc = document.getElementById('btn-font-inc');
    if (btnFontDec) btnFontDec.onclick = () => updateFontScale(this.fontScale - 0.1);
    if (btnFontInc) btnFontInc.onclick = () => updateFontScale(this.fontScale + 0.1);

    // 1. 音效按钮
    document.getElementById('btn-sound').onclick = () => {
      const on = audio.toggle();
      document.getElementById('sound-state').innerText = on ? '开' : '关';
      this.log(on ? '程序化环境声学引擎已上线。' : '环境音效已静音。');
    };

    // 2. CRT 切换
    document.getElementById('btn-crt').onclick = () => {
      document.body.classList.toggle('crt-enabled');
      const on = document.body.classList.contains('crt-enabled');
      document.getElementById('crt-state').innerText = on ? '开' : '关';
      audio.playClick();
    };

    // 3. 回溯上一个选择点按钮
    const onRewindClick = () => {
      this.rewindStep();
    };
    const btnRewind = document.getElementById('btn-rewind');
    const btnChoiceRewind = document.getElementById('btn-choice-rewind');
    if (btnRewind) btnRewind.onclick = onRewindClick;
    if (btnChoiceRewind) btnChoiceRewind.onclick = onRewindClick;

    // 4. 重置按钮
    document.getElementById('btn-restart').onclick = () => {
      if (confirm('确认强制复位神经连接，回到本次因果循环的起点？')) {
        this.reset();
      }
    };

    // 5. 模态框打开与关闭
    document.getElementById('btn-timeline').onclick = () => {
      audio.playClick();
      this.openTimelineModal();
    };
    document.getElementById('btn-close-modal').onclick = () => {
      audio.playClick();
      document.getElementById('timeline-modal').style.display = 'none';
    };

    // 5. 战术面板 Tab 切换
    document.querySelectorAll('.panel-tab-btn').forEach((btn) => {
      btn.onclick = () => {
        audio.playClick();
        document.querySelectorAll('.panel-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
      };
    });

    // 6. 规则子 Tab 切换
    document.querySelectorAll('.rule-subtab-btn').forEach((btn) => {
      btn.onclick = () => {
        audio.playClick();
        document.querySelectorAll('.rule-subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentRuleSubtab = parseInt(btn.getAttribute('data-phase'), 10);
        this.renderRules();
      };
    });

    // 7. 解密滤镜工具
    document.getElementById('tool-blood').onclick = () => {
      audio.playClick();
      this.activeTools.blood = !this.activeTools.blood;
      document.getElementById('tool-blood').classList.toggle('active-blood', this.activeTools.blood);
      document.getElementById('blood-state').innerText = this.activeTools.blood ? '开' : '关';
      this.renderRules();
      this.log(this.activeTools.blood ? '已使用静脉血液浸润纸张，二价铁络合显影已激活。' : '血液浸润滤镜已清除。');
    };

    document.getElementById('tool-polaroid').onclick = () => {
      audio.playClick();
      this.activeTools.polaroid = !this.activeTools.polaroid;
      document.getElementById('tool-polaroid').classList.toggle('active-polaroid', this.activeTools.polaroid);
      document.getElementById('polaroid-state').innerText = this.activeTools.polaroid ? '开' : '关';
      this.renderRules();
      this.log(this.activeTools.polaroid ? '已佩戴充血偏振滤镜，消除文字荧光涂层干扰。' : '偏振滤镜已关闭。');
    };

    document.getElementById('tool-moire').onclick = () => {
      if (this.vitals.hr < 150) return;
      audio.playClick();
      this.activeTools.moire = !this.activeTools.moire;
      document.getElementById('tool-moire').classList.toggle('active-moire', this.activeTools.moire);
      document.getElementById('moire-state').innerText = this.activeTools.moire ? '生效中' : '就绪';
      this.renderRules();
      this.log(this.activeTools.moire ? '视网膜微动脉震颤已与纳米光栅对齐，摩尔纹密码显影！' : '摩尔纹滤镜已关闭。');
    };
  },

  openTimelineModal() {
    const modal = document.getElementById('timeline-modal');
    modal.style.display = 'flex';

    // 渲染结局矩阵
    const endingsList = [
      { id: 'be_1', code: 'BAD END 1', name: '气闸屠场', desc: '盲拉液氮手柄，直接向走廊开门释放拟态' },
      { id: 'be_2', code: 'BAD END 2', name: '微波焦尸', desc: '盲从干燥无霜规则，步入高能微波杀阵' },
      { id: 'be_3', code: 'BAD END 3', name: '误杀孤立', desc: '盲从条例处决高热秦澈，夹层断绝生机' },
      { id: 'be_4', code: 'BAD END 4', name: '粉碎希望', desc: '鲁莽推搡打碎血清，断绝最终生化反制' },
      { id: 'be_5', code: 'BAD END 5', name: '雪原猎物', desc: '在零下50度极夜张口狂奔，热羽流引来白行者' },
      { id: 'be_6', code: 'BAD END 6', name: '盲斑折颈', desc: '双目直视红灯，盲斑落入视神经盲点实体化' },
      { id: 'be_7', code: 'BAD END 7', name: '环形重置', desc: '企图用核爆摧毁反应堆，能量被压缩回起点' },
      { id: 'end_1', code: 'ENDING 1', name: '冻土幽灵 (常规逃生)', desc: '驾驶雪地车逃出基地，但携带共振模因' },
      { id: 'end_2', code: 'ENDING 2', name: '晨曦破晓 (真理终局)', desc: '祖父悖论反向坍缩，彻底终结莫比乌斯循环' }
    ];

    const endingsGrid = document.getElementById('endings-grid');
    endingsGrid.innerHTML = '';
    endingsList.forEach((e) => {
      const card = document.createElement('div');
      const unlocked = this.unlockedEndings.has(e.id);
      card.className = `ending-badge-card ${unlocked ? 'unlocked' : ''} ${e.id === 'end_2' ? 'true-end' : ''}`;
      card.innerHTML = `
        <div class="ending-code">${e.code} ${unlocked ? '【已解锁】' : '【未发现】'}</div>
        <div class="ending-name">${unlocked ? e.name : '？？？？？？'}</div>
        <div class="ending-desc">${unlocked ? e.desc : '因果链尚未收敛至此分支。'}</div>
      `;
      endingsGrid.appendChild(card);
    });

    // 渲染锚点列表
    const checkpointsList = document.getElementById('checkpoints-list');
    checkpointsList.innerHTML = '';
    this.visitedNodes.forEach((nId) => {
      const n = STORY_NODES[nId];
      if (!n) return;
      const item = document.createElement('div');
      item.className = 'checkpoint-item';
      item.innerHTML = `
        <span class="checkpoint-title">${n.title}</span>
        <span class="checkpoint-tag">${n.location || '时空坐标'}</span>
      `;
      item.onclick = () => {
        modal.style.display = 'none';
        this.renderNode(nId);
        this.log(`已成功回溯至时空锚点：${n.title}`);
        audio.playClick();
      };
      checkpointsList.appendChild(item);
    });
  }
};

// 页面加载就绪后自动启动
window.addEventListener('DOMContentLoaded', () => {
  GameState.init();
});
