import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Radio,
  Eye,
  ShieldCheck,
  MapPin,
  Users,
  Compass,
  Maximize2,
  Activity,
  HardHat,
  Cpu,
} from 'lucide-react';

interface SiteNode {
  id: string;
  name: string;
  sector: string;
  workers: number;
  progress: number;
  status: 'optimal' | 'warning' | 'active';
  coords: { x: number; y: number; z: number };
}

const SITE_NODES: SiteNode[] = [
  { id: 'gate', name: 'Main Security Gate & Turnstiles', sector: 'Sector Alpha', workers: 42, progress: 100, status: 'optimal', coords: { x: 20, y: 75, z: 0 } },
  { id: 'pier28', name: 'Pier 28 Cap Beam Reinforcement', sector: 'Sector Bravo', workers: 68, progress: 75, status: 'active', coords: { x: 50, y: 45, z: 25 } },
  { id: 'pier29', name: 'Pier 29 & 30 Rebar Cage Binding', sector: 'Sector Charlie', workers: 84, progress: 93, status: 'active', coords: { x: 75, y: 30, z: 35 } },
  { id: 'hub', name: 'Commercial Hub Basement Pour', sector: 'Sector Delta', workers: 70, progress: 48, status: 'warning', coords: { x: 35, y: 25, z: -15 } },
];

export const SiteVisualizer3D: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SiteNode>(SITE_NODES[1]);
  const [viewAngle, setViewAngle] = useState<'isometric' | 'top' | 'elevation'>('isometric');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Transform styles based on active 3D viewing perspective
  const perspectiveStyles = {
    isometric: { rotateX: 52, rotateZ: -32, rotateY: 4 },
    top: { rotateX: 0, rotateZ: 0, rotateY: 0 },
    elevation: { rotateX: 85, rotateZ: 0, rotateY: 0 },
  }[viewAngle];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#252521] border border-[#51483D]/40 shadow-[0_20px_50px_-10px_rgba(37,37,33,0.3)] text-[#F4F0E8] p-5 sm:p-7">
      {/* Visualizer Top Bar Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#51483D]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#51483D]/60 border border-[#A77B50]/40 flex items-center justify-center text-[#A77B50] shadow-sm">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-[#F4F0E8]">
                Interactive 3D Job-Site Hologram
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40">
                LiDAR Spatial Telemetry
              </span>
            </div>
            <p className="text-xs text-[#96938B] mt-0.5">
              Live spatial coordinates mapped via GPS geofence & on-device gate biometrics
            </p>
          </div>
        </div>

        {/* View Angle Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#51483D]/40 border border-[#51483D]/60 text-xs">
          {(['isometric', 'top', 'elevation'] as const).map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => setViewAngle(angle)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                viewAngle === angle
                  ? 'bg-[#A77B50] text-[#F4F0E8] shadow-sm'
                  : 'text-[#96938B] hover:text-[#F4F0E8]'
              }`}
            >
              {angle}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsScanning(!isScanning)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ml-1 ${
              isScanning
                ? 'bg-[#A77B50]/20 text-[#A77B50] border-[#A77B50]/40'
                : 'bg-transparent text-[#96938B] border-transparent hover:text-[#F4F0E8]'
            }`}
            title={isScanning ? 'Pause LiDAR Scan' : 'Resume LiDAR Scan'}
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden flex items-center justify-center my-4">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,123,80,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* 3D Transform Stage */}
        <div
          style={{ perspective: 1000 }}
          className="relative w-full h-full flex items-center justify-center select-none"
        >
          <motion.div
            animate={{
              rotateX: perspectiveStyles.rotateX,
              rotateZ: perspectiveStyles.rotateZ,
              rotateY: perspectiveStyles.rotateY,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]"
          >
            {/* Base Blueprint Ground Plane */}
            <div
              style={{
                transform: 'translateZ(-20px)',
                backgroundImage: `
                  linear-gradient(to right, rgba(167, 123, 80, 0.22) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(167, 123, 80, 0.22) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }}
              className="absolute inset-0 rounded-2xl border-2 border-[#A77B50]/30 bg-[#252521]/90 shadow-[0_0_40px_rgba(167,123,80,0.15)]"
            >
              {/* Outer Boundary Perimeter Geofence Ring */}
              <div className="absolute inset-4 rounded-xl border border-dashed border-[#A77B50]/50" />
              <div className="absolute top-2 left-3 text-[9px] font-mono font-bold text-[#A77B50] uppercase tracking-wider">
                GEOFENCE BOUNDARY // 100M RADIUS
              </div>

              {/* Sweeping LiDAR Laser Scanner Beam */}
              {isScanning && (
                <motion.div
                  animate={{
                    top: ['0%', '100%', '0%'],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A77B50] to-transparent shadow-[0_0_15px_#A77B50]"
                />
              )}
            </div>

            {/* Elevated Structural Floorplate 1 (Superstructure) */}
            <div
              style={{ transform: 'translateZ(30px)' }}
              className="absolute top-12 left-16 right-16 bottom-16 rounded-xl border border-[#D8CCB9]/20 bg-[#51483D]/30 backdrop-blur-xs"
            >
              <div className="absolute -top-3 left-3 text-[8px] font-mono text-[#D8CCB9] uppercase bg-[#252521] px-1.5 py-0.5 rounded border border-[#51483D]">
                Elevated Deck +12.5M
              </div>
            </div>

            {/* Elevated Structural Floorplate 2 (Tower Crane & Pylon Axis) */}
            <div
              style={{ transform: 'translateZ(65px)' }}
              className="absolute top-28 left-28 w-32 h-32 rounded-lg border border-[#A77B50]/60 bg-[#A77B50]/15"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-16 bg-[#A77B50] rounded-full shadow-[0_0_10px_#A77B50]" />
              </div>
            </div>

            {/* Interactive 3D Worksite Nodes / Clusters */}
            {SITE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  style={{
                    left: `${node.coords.x}%`,
                    top: `${node.coords.y}%`,
                    transform: `translate3d(-50%, -50%, ${node.coords.z + 40}px)`,
                  }}
                  className="absolute cursor-pointer group"
                >
                  {/* Vertical Elevation Stalk to Ground */}
                  <div
                    style={{ height: `${node.coords.z + 40}px` }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-t from-transparent via-[#A77B50]/40 to-[#A77B50]"
                  />

                  {/* Pulsing 3D Pin Beacon */}
                  <div className="relative">
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                          isSelected ? 'bg-[#A77B50]' : 'bg-[#D8CCB9]'
                        }`}
                      />
                      <span
                        className={`relative inline-flex items-center justify-center rounded-full h-6 w-6 font-bold text-[10px] shadow-lg transition-transform duration-300 ${
                          isSelected
                            ? 'bg-[#A77B50] text-[#F4F0E8] scale-125 ring-2 ring-[#F4F0E8]'
                            : 'bg-[#51483D] text-[#D8CCB9] hover:scale-110'
                        }`}
                      >
                        {node.workers}
                      </span>
                    </span>

                    {/* Floating Tooltip Label */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-0.5 rounded-md whitespace-nowrap text-[10px] font-bold pointer-events-none transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#F4F0E8] text-[#252521] shadow-md opacity-100 -translate-y-1'
                          : 'bg-[#252521]/90 text-[#D8CCB9] opacity-75 group-hover:opacity-100'
                      }`}
                    >
                      {node.sector}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Viewport Overlay Compass Indicator */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-mono text-[#96938B] bg-[#252521]/80 px-2.5 py-1 rounded-lg border border-[#51483D]/40">
          <Compass className="w-3.5 h-3.5 text-[#A77B50]" />
          <span>AXIS: X:{perspectiveStyles.rotateX}° Z:{perspectiveStyles.rotateZ}°</span>
        </div>
      </div>

      {/* Selected Node Telemetry HUD Footer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="relative z-20 p-4 rounded-2xl bg-[#51483D]/30 border border-[#51483D]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A77B50] text-[#F4F0E8] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#F4F0E8]">
                  {selectedNode.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#252521] text-[#A77B50] border border-[#A77B50]/30 font-mono">
                  {selectedNode.sector}
                </span>
              </div>
              <p className="text-xs text-[#96938B] mt-0.5">
                Physical deployment verified via biometric turnstiles and GSM gate calls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#96938B] block">Active Workforce</span>
              <span className="text-sm font-extrabold text-[#F4F0E8] tabular-nums">
                {selectedNode.workers} Laborers
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#96938B] block">Scope Progress</span>
              <span className="text-sm font-extrabold text-[#A77B50] tabular-nums">
                {selectedNode.progress}% Met
              </span>
            </div>

            <div className="w-20 sm:w-28 h-2 bg-[#252521] rounded-full overflow-hidden border border-[#51483D]">
              <div
                className="h-full bg-gradient-to-r from-[#A77B50] to-[#8E653C] rounded-full"
                style={{ width: `${selectedNode.progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
