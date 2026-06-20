import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  BatteryCharging, 
  Wrench, 
  Settings2, 
  ClipboardCheck, 
  Droplets, 
  Snowflake, 
  Disc 
} from 'lucide-react';

export interface PricingTier {
  name: string;
  price: string;
  duration: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  bullets: string[];
  color: string;
  illustration: React.ReactNode;
  pricing: PricingTier[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'scanning',
    slug: 'car-scanning-diagnostics',
    name: 'Car Scanning Diagnostics',
    icon: Cpu,
    summary: 'Complete vehicle electronics and powertrain system scanning using advanced OBD-II instrumentation to read live telemetry and ECU error codes.',
    bullets: [
      'Full ECU & module system health scanning',
      'Detailed diagnostic trouble code (DTC) logs',
      'Real-time sensor telemetry analysis',
      'Alternator, starter motor, and battery electrical test'
    ],
    color: 'from-red-500 to-rose-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <motion.div 
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full border border-red-500/30 flex items-center justify-center relative"
        >
          <div className="absolute w-24 h-24 rounded-full border border-red-500/50 flex items-center justify-center animate-pulse" />
          <Cpu className="w-12 h-12 text-[#FF2D2D]" />
          <div className="absolute inset-x-0 h-0.5 bg-red-500/40 top-1/2 -translate-y-1/2 animate-bounce" />
        </motion.div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-gray-500 font-mono">
          <span>SYSTEMS: ACTIVE</span>
          <span>ERRORS: 0</span>
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Diagnostic Check',
        price: 'AED 150',
        duration: '30 mins',
        features: ['Obd2 error code retrieval', 'Basic dashboard reset', 'PDF health report by email']
      },
      {
        name: 'Interim System Scan',
        price: 'AED 350',
        duration: '1 hour',
        features: ['Full 52-module diagnostic scan', 'Live sensor data stream recording', 'Battery & charging system check', 'Clear history codes']
      },
      {
        name: 'Major Electronic Analysis',
        price: 'AED 600',
        duration: '2-3 hours',
        features: ['Deep wiring & harness diagnostic', 'ECU reflashing check', 'Pinpoint sensor failure checking', 'Master mechanic consult session']
      }
    ]
  },
  {
    id: 'battery',
    slug: 'car-battery-replacement',
    name: 'Battery Replacement',
    icon: BatteryCharging,
    summary: 'Premium AGM/EFB battery installations paired with computerized vehicle ECU registration to prevent alternator overloading and preserve settings.',
    bullets: [
      'High-reserve capacity AGM & EFB premium batteries',
      'In-line memory saver connection during swap',
      'Computerized battery registration with engine ECU',
      'Terminal cleanup, coating & corrosion treatment'
    ],
    color: 'from-amber-500 to-orange-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="relative flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-28 border-2 border-amber-500/50 rounded-xl relative p-2 flex flex-col justify-end"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-amber-500 rounded-t" />
            <motion.div 
              animate={{ height: ['20%', '85%', '20%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-full bg-gradient-to-t from-amber-600 to-yellow-400 rounded-lg"
            />
          </motion.div>
          <BatteryCharging className="w-8 h-8 text-amber-400 absolute top-10" />
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Care Pack',
        price: 'AED 299',
        duration: '30 mins',
        features: ['Standard lead-acid battery', 'Installation & core recycling', '1-year standard warranty']
      },
      {
        name: 'Interim AGM Upgrade',
        price: 'AED 650',
        duration: '45 mins',
        features: ['Premium Varta/Bosch EFB battery', 'ECU battery registration', 'Chassis grounding test', '18-month warranty']
      },
      {
        name: 'Major AGM System Swap',
        price: 'AED 1,199',
        duration: '1 hour',
        features: ['Elite AGM battery package', 'ECU memory saving registration', 'Alternator charge load diagnostic', '3-year replacement warranty']
      }
    ]
  },
  {
    id: 'engine',
    slug: 'car-engine-repair',
    name: 'Engine Repair',
    icon: Wrench,
    summary: 'Comprehensive head gasket replacements, mechanical overhauls, timing belt assembly timing, and oil leak sealing performed by certified master techs.',
    bullets: [
      'Cylinder head diagnostics & gasket replacements',
      'Timing belt/chain assembly configuration',
      'Oil leak source identification and complete sealing',
      'Ignition coil, spark plug, and fuel injector tuning'
    ],
    color: 'from-rose-500 to-red-700',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="flex gap-4 items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="relative"
          >
            <Settings2 className="w-16 h-16 text-gray-500" />
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="-mt-8"
          >
            <Wrench className="w-12 h-12 text-[#FF2D2D]" />
          </motion.div>
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Valve Tune-up',
        price: 'AED 450',
        duration: '2 hours',
        features: ['Spark plug & coil pack replacement', 'Throttle body chemical flush', 'Engine compression logging']
      },
      {
        name: 'Interim Seal & Belt Fix',
        price: 'AED 1,200',
        duration: '1 day',
        features: ['Valve cover gasket replacement', 'Drive belt & tensioner swap', 'Fluid leak pressure test', 'Engine bay detailed cleaning']
      },
      {
        name: 'Major Overhaul / Timing',
        price: 'AED 3,800+',
        duration: '3-5 days',
        features: ['Timing belt/chain kit overhaul', 'Cylinder head gasket rebuild', 'Oil pump & cooling system refresh', '12-month parts & labor guarantee']
      }
    ]
  },
  {
    id: 'transmission',
    slug: 'car-transmission-repair',
    name: 'Transmission Repair',
    icon: Settings2,
    summary: 'Accurate diagnoses of solenoids, torque converters, CVT pulleys, manual clutches, and complete transmission unit rebuilds.',
    bullets: [
      'Automatic, manual, and CVT fluid exchanges & filter changes',
      'Transmission control solenoid electrical diagnosis',
      'Clutch plate adjustments and replacement services',
      'Full mechanical gearbox rebuilds with dynamometer testing'
    ],
    color: 'from-blue-500 to-indigo-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3].map((gear) => (
              <motion.div
                key={gear}
                animate={{ rotate: gear % 2 === 0 ? 360 : -360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              >
                <Settings2 className={`w-${12 - gear * 2} h-${12 - gear * 2} text-indigo-400`} />
              </motion.div>
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Gear Ratios Optimized</span>
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Fluid Swap',
        price: 'AED 399',
        duration: '1.5 hours',
        features: ['Transmission oil drain & refill', 'Pan gasket replacement', 'Adaptation memory reset']
      },
      {
        name: 'Interim Solenoid Service',
        price: 'AED 1,450',
        duration: '4-6 hours',
        features: ['Shift solenoid block replacement', 'Full oil flushing & replacement filter', 'Gearbox system pressure test']
      },
      {
        name: 'Major Gearbox Rebuild',
        price: 'AED 4,500+',
        duration: '3-4 days',
        features: ['Complete mechanical disassembly', 'Clutch pack & planetary gears swap', 'Torque converter replacement', '24-month extended coverage']
      }
    ]
  },
  {
    id: 'maintenance',
    slug: 'car-scheduled-maintenance',
    name: 'Scheduled Maintenance',
    icon: ClipboardCheck,
    summary: 'Multi-point safety assessments, air/cabin filter upgrades, and factory-scheduled maintenance routines configured for your specific vehicle mileage.',
    bullets: [
      'Cabin & engine air intake filter upgrades',
      'Full chassis, steering, and suspension lubrication checks',
      'Multi-point inspection (fluids, brakes, safety components)',
      'Dashboard service light resetting & digital log book updates'
    ],
    color: 'from-emerald-500 to-teal-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="flex flex-col gap-2 w-3/4">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item * 0.2 }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl"
            >
              <ClipboardCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="h-2 w-24 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Annual Service',
        price: 'AED 199',
        duration: '1 hour',
        features: ['25-point safety inspection', 'Brake pad wear report', 'Fluids check & top-off']
      },
      {
        name: 'Interim 40k/80k Check',
        price: 'AED 450',
        duration: '2.5 hours',
        features: ['Cabin & engine air filters swap', 'Spark plug diagnostic test', 'Cooling system pressure audit', 'Tire rotation & check']
      },
      {
        name: 'Major 100k Service',
        price: 'AED 999',
        duration: '4 hours',
        features: ['Serpentine drive belt replacement', 'Brake fluid & coolant flush', 'Fuel injector clean-out', 'Full OBD scanner log history']
      }
    ]
  },
  {
    id: 'oil',
    slug: 'car-oil-change',
    name: 'Oil Change',
    icon: Droplets,
    summary: 'Full synthetic motor oil service with OEM filter replacements, critical fluid adjustments, and manual oil life indicator calibration.',
    bullets: [
      'Premium synthetic oils matching manufacturer specs',
      'OEM high-capacity spin-on or cartridge filters',
      'Complimentary power steering, coolant, and washer fluid top-offs',
      'Strict disposal of hazardous chemicals adhering to green standards'
    ],
    color: 'from-yellow-500 to-amber-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <Droplets className="w-16 h-16 text-yellow-500 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
        </motion.div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor 5,000 KM Care',
        price: 'AED 180',
        duration: '30 mins',
        features: ['Semi-synthetic brand motor oil', 'OEM oil filter replacement', '10-point visual safety check']
      },
      {
        name: 'Interim 10,000 KM Care',
        price: 'AED 299',
        duration: '45 mins',
        features: ['Fully synthetic premium oil change', 'OEM high-efficiency oil filter', 'Fluid levels check & top-offs', 'Chassis grease points lube']
      },
      {
        name: 'Major Extended Performance',
        price: 'AED 499',
        duration: '1 hour',
        features: ['Mobil1 / Shell Helix Ultra oil change', 'Engine oil flush treatment', 'Premium filter', '35-point safety inspection & diagnostics check']
      }
    ]
  },
  {
    id: 'ac',
    slug: 'car-ac-repair',
    name: 'AC Repair',
    icon: Snowflake,
    summary: 'AC system diagnostics utilizing UV dye to trace refrigerant leaks, blower motor upgrades, and dual-zone climate control calibrations.',
    bullets: [
      'Refrigerant evacuation, recycling, and recharging (R134a/R1234yf)',
      'Vacuum leak testing and UV tracer dye inspection',
      'AC compressor, condenser, and expansion valve repairs',
      'Anti-bacterial cabin ventilation evaporator disinfection'
    ],
    color: 'from-cyan-500 to-blue-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <Snowflake className="w-16 h-16 text-cyan-400 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </motion.div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Max Cooling Active</span>
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Gas Top-up',
        price: 'AED 150',
        duration: '30 mins',
        features: ['Refrigerant charge evaluation', 'Eco R134a gas top-up', 'A/C output temperature reading']
      },
      {
        name: 'Interim System Leak Audit',
        price: 'AED 400',
        duration: '1.5 hours',
        features: ['UV tracer dye leak check', 'Full gas evacuation & recharge', 'Cabin microfilter replacement', 'Sanitation spray']
      },
      {
        name: 'Major Compressor Swap',
        price: 'AED 1,600+',
        duration: '4-6 hours',
        features: ['AC Compressor or Condenser replacement', 'Receiver drier swap', 'Thermostatic valve check', '12-month cooling guarantee']
      }
    ]
  },
  {
    id: 'alignment',
    slug: 'car-wheel-balancing-alignment',
    name: 'Wheel Balancing/Alignment',
    icon: Disc,
    summary: 'Four-wheel 3D laser suspension alignment, steering geometry tuning, and high-speed dynamic computerized wheel balancing.',
    bullets: [
      'Precision 3D camera camber, caster, and toe adjustment',
      'Road Force wheel balancing to eliminate steering vibration',
      'Tire wear inspection and tread depth diagnostics',
      'Steering angle sensor calibration & steering components check'
    ],
    color: 'from-purple-500 to-violet-600',
    illustration: (
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="relative z-10"
          >
            <Disc className="w-20 h-20 text-purple-400" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md" />
          </div>
          <div className="absolute top-1/2 left-[-15px] right-[-15px] h-0.5 bg-red-500/60 z-0 pointer-events-none" />
          <div className="absolute left-1/2 top-[-15px] bottom-[-15px] w-0.5 bg-red-500/60 z-0 pointer-events-none" />
        </div>
      </div>
    ),
    pricing: [
      {
        name: 'Minor Alignment Check',
        price: 'AED 120',
        duration: '20 mins',
        features: ['3D alignment check with printout', 'Tire pressure check', 'Tread depth measurement']
      },
      {
        name: 'Interim Front/Rear Align',
        price: 'AED 250',
        duration: '45 mins',
        features: ['Precision 3D steering alignment', 'Steering angle sensor calibration', 'Tire rotation service']
      },
      {
        name: 'Major Balance & Alignment Pack',
        price: 'AED 450',
        duration: '1.5 hours',
        features: ['4-wheel computerized Road Force balance', 'Complete laser steering geometry alignment', 'Suspension bushing inspection', 'Road test check']
      }
    ]
  }
];
