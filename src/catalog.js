/* Official product catalogue.
 *
 * Source of truth: the four Xili product leaflets (产品折页设计样稿, July 2026) and
 * the corporate brochure (企业宣传册 2026-05-19). Only products documented there
 * appear on this site; model numbers, accuracy classes, ratings and protocols are
 * transcribed from those sheets. Photography is the official studio set.
 */

/* Spec row labels. Values themselves are model numbers, ratings and standard
   names, which read the same in every locale. */
export const specLabels = {
  accuracy: { en: 'Accuracy', fr: 'Précision', zh: '准确度' },
  voltage: { en: 'Rated voltage', fr: 'Tension nominale', zh: '额定电压' },
  current: { en: 'Rated current', fr: 'Courant nominal', zh: '额定电流' },
  protocol: { en: 'Protocol', fr: 'Protocole', zh: '通信协议' },
  ports: { en: 'Interfaces', fr: 'Interfaces', zh: '通信接口' },
  band: { en: 'Frequency band', fr: 'Bande de fréquence', zh: '工作频段' },
  fits: { en: 'Fits', fr: 'Compatible avec', zh: '适配对象' },
  ratio: { en: 'Rated ratio', fr: 'Rapport nominal', zh: '额定比' },
  burden: { en: 'Rated burden', fr: 'Charge nominale', zh: '额定二次负荷' },
  standard: { en: 'Standard', fr: 'Norme', zh: '适用标准' },
  material: { en: 'Enclosure', fr: 'Enveloppe', zh: '材质' },
  rating: { en: 'Rating', fr: 'Calibre', zh: '额定值' },
  cell: { en: 'Cell chemistry', fr: 'Chimie de cellule', zh: '电池类型' },
  pack: { en: 'Pack', fr: 'Pack', zh: '额定参数' },
  range: { en: 'Range', fr: 'Autonomie', zh: '续航里程' },
  output: { en: 'Output', fr: 'Sortie', zh: '输出' },
  bays: { en: 'Bays', fr: 'Baies', zh: '仓位' },
  panel: { en: 'PV panel', fr: 'Panneau PV', zh: '光伏板' },
  use: { en: 'Application', fr: 'Application', zh: '适用场景' },
}

/* ------------------------------------------------------------------ */
/* 计量仪表系列 — Metering instruments (22 models)                      */

const meteringInstruments = [
  {
    key: 'state-grid-meters',
    title: {
      en: 'State Grid standard smart meters',
      fr: 'Compteurs intelligents au standard State Grid',
      zh: '国网标准智能电能表',
    },
    note: {
      en: 'Developed to State Grid Corporation of China specifications, DL/T 698.45-2017.',
      fr: 'Développés selon les spécifications de State Grid Corporation of China, DL/T 698.45-2017.',
      zh: '依据国家电网标准研制，DL/T 698.45-2017。',
    },
    items: [
      {
        img: 'ddzy311', model: 'DDZY311',
        name: {
          en: 'Class-A single-phase smart payment meter (remote · internal/external switch)',
          fr: 'Compteur monophasé intelligent à prépaiement classe A (télécommande · interrupteur interne/externe)',
          zh: 'A级单相费控智能电能表系列（远程 · 开关内置/外置）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A · 0.25–0.5(100) A'],
          ['protocol', 'DL/T 698.45-2017'],
          ['ports', 'RS485 · IR · PLC · HPLC+HRF'],
        ],
      },
      {
        img: 'dtzy311-b', model: 'DTZY311',
        name: {
          en: 'Class-B three-phase smart payment meter (remote · internal/external switch)',
          fr: 'Compteur triphasé intelligent à prépaiement classe B (télécommande · interrupteur interne/externe)',
          zh: 'B级三相费控智能电能表系列（远程 · 开关内置/外置）',
        },
        specs: [
          ['accuracy', 'Active Class B · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.2–0.5(60) A · 0.2–0.5(100) A · 0.015–0.075(6) A · 0.003–0.015(1.2) A'],
          ['protocol', 'DL/T 698.45-2017'],
          ['ports', 'RS485 · IR · PLC · HPLC+HRF · 4G'],
        ],
      },
      {
        img: 'dtzy311-c', model: 'DTZY311',
        name: {
          en: 'Class-C three-phase smart payment meter (remote · external switch)',
          fr: 'Compteur triphasé intelligent à prépaiement classe C (télécommande · interrupteur externe)',
          zh: 'C级三相费控智能电能表系列（远程 · 开关外置）',
        },
        specs: [
          ['accuracy', 'Active Class C · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.015–0.075(6) A · 0.003–0.015(1.2) A'],
          ['protocol', 'DL/T 698.45'],
          ['ports', 'RS485 · IR · PLC · HPLC+HRF · 4G'],
        ],
      },
      {
        img: 'dtz311-dsz311', model: 'DTZ311 / DSZ311',
        name: {
          en: 'Class-C three-phase smart meter',
          fr: 'Compteur triphasé intelligent classe C',
          zh: 'C级三相智能电能表系列',
        },
        specs: [
          ['accuracy', 'Active Class C · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.015–0.075(6) A · 0.003–0.015(1.2) A'],
          ['protocol', 'DL/T 698.45-2017'],
          ['ports', 'RS485 · IR'],
        ],
      },
    ],
  },
  {
    key: 'csg-meters',
    title: {
      en: 'China Southern Power Grid standard meters',
      fr: 'Compteurs au standard China Southern Power Grid',
      zh: '南方电网标准智能电能表',
    },
    note: {
      en: 'Developed to China Southern Power Grid specifications, DL/T 645-2007. Gateway models integrate with the CSG “Dianhong” power-IoT operating system.',
      fr: 'Développés selon les spécifications de China Southern Power Grid, DL/T 645-2007. Les modèles passerelle s’intègrent au système d’exploitation IoT « Dianhong » de CSG.',
      zh: '依据南方电网标准研制，DL/T 645-2007。网关表可无缝接入南网“电鸿”电力物联操作系统。',
    },
    items: [
      {
        img: 'ddz311', model: 'DDZ311',
        name: {
          en: 'Class-A single-phase smart payment meter (comms module · internal/external switch)',
          fr: 'Compteur monophasé intelligent à prépaiement classe A (module de communication · interrupteur interne/externe)',
          zh: 'A级单相费控智能电能表（通信模块 · 开关内置/外置）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A · 0.25–0.5(80) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485 · IR · Bluetooth · PLC · HPLC+HRF'],
        ],
      },
      {
        img: 'ddzm311', model: 'DDZM311',
        name: {
          en: 'Class-A single-phase smart gateway meter (comms module · internal switch)',
          fr: 'Compteur passerelle monophasé intelligent classe A (module de communication · interrupteur interne)',
          zh: 'A级单相智能网关电能表系列（通信模块 · 开关内置）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A · 0.25–0.5(80) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485 · Bluetooth · HPLC+HRF · 4G'],
        ],
      },
      {
        img: 'dtz311', model: 'DTZ311',
        name: {
          en: 'Class-B three-phase smart meter (comms module · external switch)',
          fr: 'Compteur triphasé intelligent classe B (module de communication · interrupteur externe)',
          zh: 'B级三相智能电能表系列（通信模块 · 开关外置）',
        },
        specs: [
          ['accuracy', 'Active Class B · reactive Class 2'],
          ['voltage', '3×220/380 V'],
          ['current', '0.015–0.075(6) A · 0.25–0.5(80) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485 · IR · PLC · HPLC+HRF · 4G'],
        ],
      },
      {
        img: 'dtzm311', model: 'DTZM311',
        name: {
          en: 'Class-B three-phase smart gateway meter (comms module · external switch)',
          fr: 'Compteur passerelle triphasé intelligent classe B (module de communication · interrupteur externe)',
          zh: 'B级三相智能网关电能表系列（通信模块 · 开关外置）',
        },
        specs: [
          ['accuracy', 'Active Class B · reactive Class 2'],
          ['voltage', '3×220/380 V'],
          ['current', '0.015–0.075(6) A · 0.25–0.5(80) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485 · Bluetooth · HPLC+HRF · 4G'],
        ],
      },
    ],
  },
  {
    key: 'rail-wall-meters',
    title: {
      en: 'DIN-rail, wall-mount and DC meters',
      fr: 'Compteurs sur rail DIN, muraux et CC',
      zh: '导轨式、壁挂式与直流电能表',
    },
    note: {
      en: 'DC models cover charging piles, photovoltaic generation, telecom towers and distributed energy.',
      fr: 'Les modèles CC couvrent bornes de recharge, production photovoltaïque, pylônes télécom et énergie distribuée.',
      zh: '其中直流电能表适用于直流充电桩、光伏发电、铁塔通信及分布式能源领域。',
    },
    items: [
      {
        img: 'ddzy311-g', model: 'DDZY311-G',
        name: {
          en: 'Single-phase smart payment meter (module · remote · internal switch · replaceable battery · wall-mount)',
          fr: 'Compteur monophasé intelligent à prépaiement (module · télécommande · interrupteur interne · batterie remplaçable · mural)',
          zh: '单相费控智能电能表（模块 · 远程 · 开关内置 · 电池可换 · 壁挂式）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017'],
          ['ports', 'RS485 · IR · CAT.1 wireless'],
        ],
      },
      {
        img: 'ddsu311-2p', model: 'DDSU311',
        name: {
          en: 'Single-phase electronic energy meter (2P DIN-rail)',
          fr: 'Compteur monophasé électronique (rail DIN 2P)',
          zh: '单相电子式电能表系列（2P 导轨式）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485'],
        ],
      },
      {
        img: 'ddsu311-4p', model: 'DDSU311',
        name: {
          en: 'Single-phase smart payment meter (4P DIN-rail)',
          fr: 'Compteur monophasé intelligent à prépaiement (rail DIN 4P)',
          zh: '单相费控智能电能表系列（4P 导轨式）',
        },
        specs: [
          ['accuracy', 'Class A'],
          ['voltage', '220 V'],
          ['current', '0.25–0.5(60) A'],
          ['protocol', 'DL/T 645-2007'],
          ['ports', 'RS485 · IR'],
        ],
      },
      {
        img: 'dtzy311-g', model: 'DTZY311-G / DSZY311-G',
        name: {
          en: 'Three-phase smart payment meter (wall-mount)',
          fr: 'Compteur triphasé intelligent à prépaiement (mural)',
          zh: '三相费控智能电能表系列（壁挂式）',
        },
        specs: [
          ['accuracy', 'Active Class B · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.2–0.5(60) A · 0.2–0.5(100) A · 0.015–0.075(6) A · 0.003–0.015(1.2) A'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017'],
          ['ports', 'NB-IoT · RS485 · IR'],
        ],
      },
      {
        img: 'dtsu311', model: 'DTSU311 / DSSU311',
        name: {
          en: 'Three-phase electronic energy meter (DIN-rail)',
          fr: 'Compteur triphasé électronique (rail DIN)',
          zh: '三相电子式电能表系列（导轨式）',
        },
        specs: [
          ['accuracy', 'Active Class B · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.2–0.5(60) A · 0.2–0.5(100) A · 0.015–0.075(6) A'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017'],
          ['ports', 'RS485 · IR'],
        ],
      },
      {
        img: 'djsf311', model: 'DJSF311',
        name: {
          en: 'Static DC energy meter (wall-mount)',
          fr: "Compteur d'énergie CC statique (mural)",
          zh: '静止式直流电能表系列（壁挂式）',
        },
        specs: [
          ['accuracy', 'Class 0.5 · Class 1'],
          ['voltage', '350 V · 500 V · 750 V · 1000 V'],
          ['current', '100–600 A'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017 · MODBUS-RTU'],
          ['ports', 'RS485 ×1 · IR ×1'],
        ],
      },
      {
        img: 'djs311', model: 'DJS311',
        name: {
          en: 'Static DC energy meter (panel-mount)',
          fr: "Compteur d'énergie CC statique (encastré)",
          zh: '静止式直流电能表系列（嵌入式）',
        },
        specs: [
          ['accuracy', 'Class 0.5 · Class 1'],
          ['voltage', '350 V · 500 V · 750 V · 1000 V'],
          ['current', '100–600 A'],
          ['protocol', 'DL/T 645-2007 · MODBUS-RTU'],
          ['ports', 'RS485 ×1'],
        ],
      },
      {
        img: 'djsu311', model: 'DJSU311',
        name: {
          en: 'Electronic DC energy meter (DIN-rail)',
          fr: 'Compteur CC électronique (rail DIN)',
          zh: '直流电子式电能表系列（导轨式）',
        },
        specs: [
          ['accuracy', 'Class 0.5 · Class 1'],
          ['voltage', '350 V · 500 V · 750 V · 1000 V'],
          ['current', '100–600 A'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017'],
          ['ports', 'RS485 ×1 · IR ×1'],
        ],
      },
    ],
  },
  {
    key: 'terminals',
    title: {
      en: 'Acquisition terminals and concentrators',
      fr: "Terminaux d'acquisition et concentrateurs",
      zh: '采集终端与集中器',
    },
    items: [
      {
        img: 'ecu4h13', model: 'ECU4H13-XL31101',
        name: {
          en: 'Energy controller (dedicated transformer)',
          fr: "Contrôleur d'énergie (transformateur dédié)",
          zh: '能源控制器（专变）',
        },
        specs: [
          ['accuracy', 'Active Class C · reactive Class 2'],
          ['voltage', '3×220/380 V'],
          ['current', '0.015–0.075(6) A'],
          ['protocol', 'Q/GDW 11778-2017 · DL/T 698.44-2016 · DL/T 645-2007'],
          ['ports', 'RS485 · IR · CAN · PLC · wireless · Ethernet · 5G/4G'],
        ],
      },
      {
        img: 'ift-xl31101', model: 'IFT-XL31101',
        name: {
          en: 'Intelligent fusion terminal',
          fr: 'Terminal de fusion intelligent',
          zh: '智能融合终端',
        },
        specs: [
          ['accuracy', 'Active Class C · reactive Class 2'],
          ['voltage', '3×220/380 V'],
          ['current', '0.015–0.075(6) A'],
          ['protocol', 'DL/T 634.5101-2022 · DL/T 634.5104-2009 · MQTT 5.0 · Modbus'],
          ['ports', 'RS485 · IR · CAN · Bluetooth · wireless · Ethernet · PLC'],
        ],
      },
      {
        img: 'fkta43', model: 'FKTA43-XL31102',
        name: {
          en: 'Dedicated-transformer acquisition terminal (Type III)',
          fr: "Terminal d'acquisition pour transformateur dédié (type III)",
          zh: '专变采集终端（III 型）',
        },
        specs: [
          ['accuracy', 'Active Class C · reactive Class 2'],
          ['voltage', '3×220/380 V · 3×57.7/100 V · 3×100 V'],
          ['current', '0.015–0.075(6) A'],
          ['protocol', 'Q/GDW 11778-2017 · DL/T 645-2007'],
          ['ports', 'RS485 · IR · RS232 · wireless · Ethernet/fibre · 4G'],
        ],
      },
      {
        img: 'wjtl33', model: 'WJTL33-XL31105',
        name: {
          en: 'Type-II concentrator (joint water–electricity reading)',
          fr: 'Concentrateur type II (relevé conjoint eau-électricité)',
          zh: 'II 型集中器（水电同抄）',
        },
        specs: [
          ['voltage', '220 V'],
          ['protocol', 'DL/T 645-2007 · DL/T 698.45-2017'],
          ['ports', 'Uplink: public wireless · Downlink: RS485 ×1 · M-BUS ×1'],
          ['rating', 'Clock accuracy ≤ 0.5 s/day'],
        ],
      },
    ],
  },
  {
    key: 'modules',
    title: {
      en: 'Dual-mode communication modules',
      fr: 'Modules de communication bimode',
      zh: '双模通信模块',
    },
    note: {
      en: 'HPLC power-line carrier plus HRF sub-GHz radio in one module — carrier reach up to 2,000 m, radio up to 500 m, throughput ≥ 1 Mbps, self-organising MESH topology.',
      fr: 'Courants porteurs HPLC et radio HRF sub-GHz dans un seul module — portée porteuse jusqu’à 2 000 m, radio jusqu’à 500 m, débit ≥ 1 Mbit/s, topologie MESH auto-organisée.',
      zh: 'HPLC 电力线载波与 HRF 微功率无线双模合一——载波通信距离可达 2000 米，无线通信距离 500 米，通信速率不小于 1Mbps，支持自组网 MESH 拓扑。',
    },
    items: [
      {
        img: 'txldh13', model: 'TXLDH13-HBDS0311',
        name: {
          en: 'Dual-mode communication module (single/three-phase meters)',
          fr: 'Module de communication bimode (compteurs mono/triphasés)',
          zh: '双模通信模块（单/三相电能表）',
        },
        specs: [
          ['fits', 'Single-phase and three-phase smart meters'],
          ['protocol', 'DL/T 698.45-2017'],
          ['band', 'HPLC 0.7–12 MHz · HRF 470–510 MHz'],
          ['rating', 'PLC ≤ 2,000 m · RF ≤ 500 m · ≥ 1 Mbps'],
        ],
      },
      {
        img: 'txlda13', model: 'TXLDA13-HBJS0311',
        name: {
          en: 'Dual-mode communication module (concentrators)',
          fr: 'Module de communication bimode (concentrateurs)',
          zh: '双模通信模块（集中器）',
        },
        specs: [
          ['fits', 'Concentrators'],
          ['protocol', 'DL/T 698.45-2017'],
          ['band', 'HPLC 0.7–12 MHz · HRF 470–510 MHz'],
          ['rating', '32-bit processor · 15-level routing depth'],
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 智能水表系列 — Smart water meters                                    */

const waterMeters = [
  {
    key: 'water-meters',
    title: { en: 'Smart water meters', fr: "Compteurs d'eau intelligents", zh: '智能水表' },
    note: {
      en: 'A published product category on the company’s Chinese site: remote-reading, valve-control and ultrasonic water meters over NB-IoT and LoRa, read alongside electricity by the WJTL33 joint-reading concentrator.',
      fr: 'Catégorie publiée sur le site chinois du groupe : compteurs d’eau à télérelevé, à vanne pilotée et ultrasoniques via NB-IoT et LoRa, relevés avec l’électricité par le concentrateur WJTL33.',
      zh: '公司官网公开的产品类别：支持 NB-IoT 与 LoRa 的远传、阀控及超声波水表，可由 WJTL33 水电同抄集中器与电表一并抄收。',
    },
    items: [
      {
        img: 'lxsg-z', model: 'LXSG-Z',
        name: { en: 'Direct-reading remote water meter', fr: "Compteur d'eau à télérelevé direct", zh: '直读式远传水表' },
        specs: [['ports', 'Wired remote reading'], ['use', 'Residential and community metering']],
      },
      {
        img: 'lxsg-zf', model: 'LXSG-ZF',
        name: { en: 'Direct-reading remote water meter with valve control', fr: "Compteur d'eau à télérelevé direct avec vanne pilotée", zh: '直读式远传阀控水表' },
        specs: [['ports', 'Wired remote reading · remote valve'], ['use', 'Prepaid and controlled supply']],
      },
      {
        img: 'lxsy-wl', model: 'LXSY-WL',
        name: { en: 'Wireless remote water meter with valve control', fr: "Compteur d'eau sans fil avec vanne pilotée", zh: '无线智能远传阀控水表' },
        specs: [['ports', 'Wireless · remote valve'], ['use', 'Apartments and campuses']],
      },
      {
        img: 'lxsy', model: 'LXSY',
        name: { en: 'Wireless remote smart water meter', fr: "Compteur d'eau intelligent à télérelevé sans fil", zh: '无线远传智能水表' },
        specs: [['ports', 'Wireless remote reading'], ['use', 'Residential metering']],
      },
      {
        img: 'lxsk', model: 'LXSK',
        name: { en: 'RF-card prepaid water meter', fr: "Compteur d'eau prépayé à carte RF", zh: '射频卡预付费水表' },
        specs: [['ports', 'RF card'], ['use', 'Prepaid supply without a network']],
      },
      {
        img: 'lxsy-nb', model: 'LXSY-NB',
        name: { en: 'NB-IoT remote water meter', fr: "Compteur d'eau à télérelevé NB-IoT", zh: 'NB-IoT 无线远传智能水表' },
        specs: [['ports', 'NB-IoT'], ['use', 'Utility-scale remote reading']],
      },
      {
        img: 'lxc-wlf', model: 'LXC-WLF',
        name: { en: 'LoRa ultrasonic water meter with valve control', fr: "Compteur d'eau ultrasonique LoRa avec vanne pilotée", zh: 'LoRa 无线远传阀控超声波水表' },
        specs: [['ports', 'LoRa · remote valve'], ['rating', 'Ultrasonic measurement'], ['use', 'Campuses and industrial parks']],
      },
      {
        img: 'lxc-wf', model: 'LXC-WF',
        name: { en: 'NB-IoT ultrasonic water meter with valve control', fr: "Compteur d'eau ultrasonique NB-IoT avec vanne pilotée", zh: 'NB-IoT 无线远传阀控超声波水表' },
        specs: [['ports', 'NB-IoT · remote valve'], ['rating', 'Ultrasonic measurement'], ['use', 'Utility and campus networks']],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 计量互感器系列 — Metering instrument transformers (4 models)          */

const meteringTransformers = [
  {
    key: 'transformers',
    title: {
      en: 'Metering instrument transformers',
      fr: 'Transformateurs de mesure',
      zh: '计量用互感器',
    },
    note: {
      en: 'Low-voltage current transformers plus medium- and high-voltage current, voltage and combined units, for 0.66 kV to 35 kV power systems. High accuracy (0.2 / 0.2S / 0.5S), strong insulation, anti-pollution and dry-cast construction — used for energy metering, protective relaying and power measurement, giving the system accurate and safe signal conversion.',
      fr: 'Transformateurs de courant BT ainsi que transformateurs de courant, de tension et combinés MT/HT, pour réseaux de 0,66 kV à 35 kV. Haute précision (0,2 / 0,2S / 0,5S), isolation renforcée, tenue à la pollution et construction moulée à sec — pour le comptage d’énergie, la protection par relais et la mesure de puissance, avec une conversion de signal précise et sûre.',
      zh: '本系列产品包括低压电流互感器、中高压电流/电压互感器及组合互感器，适用于 0.66kV 至 35kV 电力系统，具备高精度（0.2/0.2S/0.5S）、强绝缘、防污、干式浇注等特性，广泛应用于电能计量、继电保护、功率测量等场景，可为电力系统提供精准、安全的信号转换与测量保障。',
    },
    items: [
      {
        img: 'lmz1d-xlp1', model: 'LMZ1/2/3/4/5D-XLP1',
        name: {
          en: 'Low-voltage metering current transformer',
          fr: 'Transformateur de courant BT pour comptage',
          zh: '计量用低压电流互感器',
        },
        specs: [
          ['accuracy', 'Class 0.2S · 0.5S'],
          ['voltage', '0.66 kV and below · 50/60 Hz'],
          ['ratio', '(75–3000)/5 A'],
          ['burden', '5 VA'],
          ['use', 'Current conversion and precise measurement · energy metering · protective relaying'],
        ],
      },
      {
        img: 'ljzn1-10', model: 'LJZN1-10/20/35 · LJZN2-10',
        name: {
          en: 'Metering current transformer, epoxy dry-type',
          fr: 'Transformateur de courant de mesure, type sec époxy',
          zh: '计量用电流互感器（环氧树脂干式）',
        },
        specs: [
          ['accuracy', 'Class 0.2S · 0.5S'],
          ['voltage', '10–35 kV · 50 Hz'],
          ['ratio', '(30–2500)/5 A'],
          ['burden', '10 VA · 15 VA'],
          ['use', 'High-accuracy current measurement · energy metering · power measurement · protective relaying'],
        ],
      },
      {
        img: 'jdzqn-10', model: 'JDZQN-10/20/35 · JDZXN-10/20/35',
        name: {
          en: 'Metering voltage transformer, epoxy cast indoor',
          fr: 'Transformateur de tension de mesure, moulé époxy intérieur',
          zh: '计量用电压互感器（环氧树脂浇注户内）',
        },
        specs: [
          ['accuracy', 'Class 0.2S · 0.5S'],
          ['voltage', '10–35 kV · 50 Hz'],
          ['ratio', '(10–35) kV/√3 kV · (10–35) kV/0.1 kV'],
          ['burden', '15 VA · 20 VA'],
          ['use', 'Voltage conversion and precise measurement · energy metering · voltage supervision · protective relaying'],
        ],
      },
      {
        img: 'jzzv1-10', model: 'JZZV1-10 · JZZY1-10',
        name: {
          en: 'Combined metering transformer (VT + CT)',
          fr: 'Transformateur combiné de mesure (TT + TC)',
          zh: '计量用组合互感器（PT + CT）',
        },
        specs: [
          ['accuracy', 'Class 0.2S · 0.5S'],
          ['voltage', '6 kV · 10 kV grid · 50 Hz'],
          ['ratio', '10 kV/0.1 kV · 10 kV/√3 kV · (30–500)/5 A'],
          ['burden', 'Voltage 10 VA · current 20 VA'],
          ['use', 'Three-phase active and reactive energy metering · combined voltage-current conversion · direct HV line metering'],
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 配电网系列 — Distribution network (7 models, Zhejiang Xili)           */

const distributionNetwork = [
  {
    key: 'metering-enclosures',
    title: {
      en: 'Energy metering enclosures',
      fr: 'Coffrets de comptage',
      zh: '电能计量箱',
    },
    note: {
      en: 'Built to State Grid specification Q/GDW 11008-2013, with integrated smart outgoing switch and protection.',
      fr: 'Conformes à la spécification State Grid Q/GDW 11008-2013, avec interrupteur de sortie intelligent et protection intégrés.',
      zh: '依据国家电网公司 Q/GDW 11008-2013 标准研制，集成智能进出线开关和保护装置。',
    },
    items: [
      {
        img: 'box-pc-abs', model: 'PXD1–PXD2 · PXS1–PXS2',
        name: {
          en: 'Single/three-phase metering enclosure, non-metallic (PC+ABS)',
          fr: 'Coffret de comptage mono/triphasé, non métallique (PC+ABS)',
          zh: '非金属（PC+ABS）单、三相电能计量箱系列',
        },
        specs: [
          ['material', 'PC+ABS composite'],
          ['standard', 'Q/GDW 11008-2013'],
          ['rating', 'Insulation · ageing · theft resistance'],
          ['use', 'Residential and commercial complexes'],
        ],
      },
      {
        img: 'box-smc', model: 'SXD1–SXD2 · SXS1–SXS2',
        name: {
          en: 'Single/three-phase metering enclosure, non-metallic (SMC)',
          fr: 'Coffret de comptage mono/triphasé, non métallique (SMC)',
          zh: '非金属（SMC）单、三相电能计量箱系列',
        },
        specs: [
          ['material', 'SMC composite'],
          ['standard', 'Q/GDW 11008-2013'],
          ['rating', 'Weather · corrosion · long service life'],
          ['use', 'Outdoor, industrial and coastal environments'],
        ],
      },
      {
        img: 'box-steel', model: 'BXD1–BXD2 · BXS1–BXS2',
        name: {
          en: 'Single/three-phase metering enclosure, metal (stainless steel)',
          fr: 'Coffret de comptage mono/triphasé, métal (acier inoxydable)',
          zh: '金属（不锈钢）单、三相电能计量箱系列',
        },
        specs: [
          ['material', 'Stainless steel'],
          ['standard', 'Q/GDW 11008-2013'],
          ['rating', 'High mechanical strength · corrosion resistance'],
          ['use', 'Outdoor, industrial and coastal environments'],
        ],
      },
      {
        img: 'box-ct-3p', model: 'PXS3 · SXS3 · BXS3',
        name: {
          en: 'Three-phase CT-connected metering enclosure',
          fr: 'Coffret de comptage triphasé à raccordement par TC',
          zh: '三相互感器接入式电能计量箱系列',
        },
        specs: [
          ['material', 'PC+ABS composite'],
          ['standard', 'Q/GDW 11008-2013'],
          ['rating', 'Integrated CT and VT · meter-grade signal conversion'],
          ['use', '10 kV+ industrial sites, substations, rural grids'],
        ],
      },
    ],
  },
  {
    key: 'distribution-equipment',
    title: {
      en: 'Distribution cabinets and switchgear',
      fr: 'Armoires de distribution et appareillage',
      zh: '配电箱与开关设备',
    },
    items: [
      {
        img: 'jxf-box', model: 'JXF',
        name: {
          en: 'Distribution box (wall-mounted)',
          fr: 'Coffret de distribution (mural)',
          zh: '配电箱系列（挂墙式）',
        },
        specs: [
          ['material', 'Stainless steel'],
          ['standard', 'GB/T 7251.2-2023'],
          ['rating', 'Power and lighting distribution · overload and short-circuit protection'],
          ['use', 'Factories, residential compounds, retail'],
        ],
      },
      {
        img: 'jp-cabinet', model: 'Jp',
        name: {
          en: 'Integrated smart low-voltage distribution cabinet',
          fr: 'Armoire de distribution BT intelligente intégrée',
          zh: '智能低压综合配电箱系列',
        },
        specs: [
          ['material', 'Stainless steel'],
          ['standard', 'GB/T 7251.12-2023 · GB/T 15576-2020 · GB/T 7251.8-2020'],
          ['rating', 'Distribution · control · protection · metering · reactive compensation'],
          ['use', 'Pole-mounted beside distribution transformers, urban and rural grid upgrades'],
        ],
      },
      {
        img: 'zw32-breaker', model: 'ZW32-12/630-25',
        name: {
          en: 'Primary–secondary integrated pole-mounted circuit breaker',
          fr: 'Disjoncteur sur poteau à intégration primaire-secondaire',
          zh: '一二次融合柱上断路器系列',
        },
        specs: [
          ['rating', '12 kV · 630 A · 25 kA'],
          ['standard', 'GB/T 1984-2024 · GB/T 11022-2020'],
          ['ports', 'Measurement · protection · control · telemetry and telecontrol'],
          ['use', '12 kV distribution lines, outdoor smart switching'],
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 储能系列 — Energy storage (4 models, Zhejiang Xili New Energy)        */

const newEnergy = [
  {
    key: 'ev-batteries',
    title: {
      en: 'Electric-vehicle power batteries',
      fr: 'Batteries motrices pour véhicules électriques',
      zh: '电动车动力电池',
    },
    note: {
      en: 'LFP chemistry with intelligent BMS protection against overcharge, over-discharge, short circuit and over-temperature. Three series: Weichi for two-wheelers, Ruishi for three-wheelers, Pu’an for four-wheelers. Exported under the WESTPOW brand with UN 38.3 transport testing, SDS/MSDS documentation and China Compulsory Certification.',
      fr: 'Chimie LFP avec BMS intelligent protégeant contre surcharge, décharge profonde, court-circuit et surchauffe. Trois séries : Weichi pour deux-roues, Ruishi pour trois-roues, Pu’an pour quatre-roues. Exportées sous la marque WESTPOW avec essais de transport UN 38.3, documentation SDS/MSDS et certification obligatoire chinoise.',
      zh: '磷酸铁锂体系，智能 BMS 具备过充、过放、短路及温度等多重保护。三大系列：“威驰”二轮、“睿士”三轮、“浦安”四轮。产品以自主品牌“威士浦 WESTPOW”出口，具备 UN 38.3 运输测试、SDS/MSDS 安全数据表与国家强制性产品认证（CCC）。',
    },
    items: [
      {
        img: 'xbm4824u', model: 'XBM4824U',
        name: {
          en: '“Weichi” two-wheeler power battery 4824',
          fr: 'Batterie motrice deux-roues « Weichi » 4824',
          zh: '“威驰”系列二轮电动车动力电池 4824',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '48 V / 24 Ah'],
          ['range', '60–100 km'],
          ['rating', '≈10 kg · 50 A discharge · lead-acid bay compatible'],
          ['material', 'Plastic · stainless steel · aluminium alloy'],
        ],
      },
      {
        img: 'xlf6040t01', model: 'XLF6040T01',
        name: {
          en: '“Weichi” two-wheeler power battery 6040',
          fr: 'Batterie motrice deux-roues « Weichi » 6040',
          zh: '“威驰”系列二轮电动车动力电池 6040',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '60 V / 40 Ah · ≈2,400 Wh'],
          ['range', '100–140 km'],
          ['rating', '60 A continuous discharge'],
          ['material', 'Stainless steel · aluminium alloy'],
        ],
      },
      {
        img: 'xlf6050t02', model: 'XLF6050T02',
        name: {
          en: '“Ruishi” three-wheeler power battery 6050',
          fr: 'Batterie motrice trois-roues « Ruishi » 6050',
          zh: '“睿士”系列三轮电动车动力电池 6050',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '60 V / 50 Ah · ≈3,000 Wh'],
          ['range', '90–140 km'],
          ['use', 'Cargo and passenger three-wheelers'],
          ['material', 'Stainless steel · aluminium alloy'],
        ],
      },
      {
        img: 'xlf60100t01', model: 'XLF60100T01',
        name: {
          en: '“Ruishi” three-wheeler power battery 60100',
          fr: 'Batterie motrice trois-roues « Ruishi » 60100',
          zh: '“睿士”系列三轮电动车动力电池 60100',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '60 V / 100 Ah · ≈6,000 Wh'],
          ['range', '150–185 km'],
          ['rating', 'Temperature rise held below 150 °C'],
          ['material', 'Stainless steel · aluminium alloy'],
        ],
      },
      {
        img: 'xlf72100t02', model: 'XLF72100T02',
        name: {
          en: '“Pu’an” four-wheeler power battery 72100',
          fr: 'Batterie motrice quatre-roues « Pu’an » 72100',
          zh: '“浦安”系列四轮电动车动力电池 72100',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '72 V / 100 Ah · ≈7,200 Wh'],
          ['range', '180–220 km'],
          ['use', 'Small low-speed four-wheelers, sightseeing and patrol vehicles'],
          ['material', 'Stainless steel · aluminium alloy'],
        ],
      },
      {
        img: 'xbh72150v', model: 'XBH72150V',
        name: {
          en: '“Pu’an” four-wheeler power battery 72150',
          fr: 'Batterie motrice quatre-roues « Pu’an » 72150',
          zh: '“浦安”系列四轮电动车动力电池 72150',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '72 V / 150 Ah · ≈10,800 Wh'],
          ['range', '180–220 km (replaceable pack)'],
          ['rating', '200 A continuous discharge'],
          ['material', 'Stainless steel · aluminium alloy'],
        ],
      },
    ],
  },
  {
    key: 'portable-power',
    title: {
      en: 'Portable power stations',
      fr: "Stations d'énergie portables",
      zh: '便携储能电源',
    },
    items: [
      {
        img: 'x300', model: 'X300',
        name: {
          en: 'Portable power station · 288 Wh',
          fr: "Station d'énergie portable · 288 Wh",
          zh: '便携电源 · 288Wh',
        },
        specs: [
          ['cell', 'Ternary lithium (18650)'],
          ['pack', '288 Wh'],
          ['output', '300 W AC'],
          ['rating', '≈4.4 kg · USB · DC · AC · solar charging'],
          ['use', 'Short trips, outdoor work, backup power'],
        ],
      },
      {
        img: 'x500', model: 'X500',
        name: {
          en: 'Portable power station · 480 Wh',
          fr: "Station d'énergie portable · 480 Wh",
          zh: '便携电源 · 480Wh',
        },
        specs: [
          ['cell', 'Ternary lithium (18650)'],
          ['pack', '430 Wh rated'],
          ['output', '500 W AC'],
          ['rating', '2,000 cycles'],
          ['use', 'Household, camping, small mobile equipment'],
        ],
      },
      {
        img: 'x1000', model: 'X1000',
        name: {
          en: 'Portable power station · 1,076 Wh',
          fr: "Station d'énergie portable · 1 076 Wh",
          zh: '便携电源 · 1076Wh',
        },
        specs: [
          ['cell', 'LiFePO₄'],
          ['pack', '1,008 Wh rated'],
          ['output', '700 W AC'],
          ['rating', 'Long cycle life · high capacity'],
          ['use', 'Home backup, most household appliances'],
        ],
      },
    ],
  },
  {
    key: 'energy-services',
    title: {
      en: 'Off-grid solar systems',
      fr: 'Systèmes solaires hors réseau',
      zh: '离网太阳能系统',
    },
    items: [
      {
        img: 'shs-50wp', model: 'SHS / 50 WP',
        name: {
          en: 'Solar home system, 50 Wp',
          fr: 'Système solaire domestique, 50 Wc',
          zh: '太阳能家用系统（50Wp）',
        },
        specs: [
          ['panel', '50 W monocrystalline'],
          ['output', '12 V DC · USB · USB-C'],
          ['rating', '2,000–2,500 cycles · PAYGO metering'],
          ['use', 'Off-grid lighting, phone charging, small appliances'],
        ],
      },
    ],
  },
]

/* Catalogue lookup by product-category slug. */
export const catalogBySlug = {
  'metering-instruments': meteringInstruments,
  'water-meters': waterMeters,
  'metering-transformers': meteringTransformers,
  'distribution-network': distributionNetwork,
  'new-energy': newEnergy,
}

export const catalogCount = (slug) =>
  (catalogBySlug[slug] || []).reduce((n, g) => n + g.items.length, 0)
