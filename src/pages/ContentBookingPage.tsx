import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Megaphone,
  Mic,
  PenSquare,
  Video,
  Film,
  Send,
  SlidersHorizontal,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ServiceItem {
  id: string;
  title: string;
  category: 'creative' | 'marketing' | 'media' | 'audio' | 'engineering';
  available: boolean;
  price: string;
  numericPrice: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trendingBadge?: string;
  avatars: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'photo',
    title: 'Photography',
    category: 'creative',
    available: true,
    price: '$32.54',
    numericPrice: 32.54,
    description: 'High-resolution architectural, studio, and aerial drone captures.',
    icon: Camera,
    trendingBadge: '🔥 Top Pick',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'ad',
    title: 'Advertising',
    category: 'marketing',
    available: true,
    price: '$32.54',
    numericPrice: 32.54,
    description: 'High-converting multi-platform ad copy, creative campaigns & distribution.',
    icon: Megaphone,
    trendingBadge: '⚡ Trending #1',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'podcast',
    title: 'Podcast Recording',
    category: 'audio',
    available: false,
    price: '$32.54',
    numericPrice: 32.54,
    description: 'Acoustic-treated studio recording, spatial audio synthesis & mastering.',
    icon: Mic,
    avatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'content',
    title: 'Content Writing',
    category: 'creative',
    available: true,
    price: '$32.54',
    numericPrice: 32.54,
    description: 'Long-form editorial articles, SEO documentation, and executive pitches.',
    icon: PenSquare,
    trendingBadge: '✍️ Best Rated',
    avatars: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'videography',
    title: 'Videography',
    category: 'media',
    available: false,
    price: '$32.54',
    numericPrice: 32.54,
    description: '4K cinema-grade progress timelapses and site walkthrough reels.',
    icon: Video,
    avatars: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    category: 'media',
    available: true,
    price: '$32.54',
    numericPrice: 32.54,
    description: 'Motion graphic titles, color grade presets, and audio track syncing.',
    icon: Film,
    trendingBadge: '🎬 High Demand',
    avatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'bim-rendering',
    title: '3D BIM Neural Render',
    category: 'engineering',
    available: true,
    price: '$48.50',
    numericPrice: 48.50,
    description: 'Photorealistic spatial digital twin & lighting simulations with AI.',
    icon: Layers,
    trendingBadge: '✨ Next-Gen AI',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    ],
  },
  {
    id: 'voice-synthesis',
    title: 'Voiceover & Audio AI',
    category: 'audio',
    available: true,
    price: '$24.00',
    numericPrice: 24.00,
    description: 'Multilingual neural voiceover synthesis for training & announcements.',
    icon: Volume2,
    trendingBadge: '🎙️ Multi-lingual',
    avatars: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    ],
  },
];

export const ContentBookingPage: React.FC = () => {
  const { t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeHoverId, setActiveHoverId] = useState<string>('ad'); // Default to Advertising as hovered in the user's screenshot
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Filter items
  const filteredServices = SERVICES_DATA.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'trending'
        ? !!item.trendingBadge
        : item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookNow = (service: ServiceItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedServiceForBooking(service);
  };

  const handleConfirmBooking = () => {
    setBookingSuccessModal(true);
    setTimeout(() => {
      setBookingSuccessModal(false);
      setSelectedServiceForBooking(null);
    }, 2200);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Header (Exact Title & Action Controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Content Booking
          </h1>
          <p className="text-xs sm:text-sm font-normal text-[#64748B] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>

        {/* Top Right Action Icons with Motion Hover */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="pl-9 pr-4 py-2 text-xs bg-white text-[#0F172A] border border-[#E2E8F0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] transition-all w-36 sm:w-48 placeholder:text-[#94A3B8] shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory((prev) => (prev === 'trending' ? 'all' : 'trending'))}
            className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-xs ${
              selectedCategory === 'trending'
                ? 'bg-[#1B365D] text-white border-[#1B365D]'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
            title="Filter Trending"
          >
            <Filter className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInfoModalOpen(true)}
            className="p-2.5 rounded-full bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-xs"
            title="Model Tuning & Generator Specs"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 2. Featured Deep Navy Announcement Banner (Matching User's Uploaded Image) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[26px] bg-[#162E54] text-white p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            {/* Yellow Graphic Badge with Pen / Hand Drawing Silhouette */}
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-[#0F172A]"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hand silhouette holding pen */}
                <path
                  d="M10 32C10 32 14 26 22 26C26 26 30 29 34 27L40 21L37 18L31 24C29 22 25 21 21 21C13 21 10 32 10 32Z"
                  fill="#0F172A"
                />
                <path
                  d="M12 28L28 12L34 18L18 34H12V28Z"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M26 14L32 20"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 38C14 36 24 38 32 35C38 32 42 34 44 33"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Headline and paragraph */}
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Use AI Content Generator easily!
              </h2>
              <p className="text-xs sm:text-[13px] text-[#CBD5E1] leading-relaxed font-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi.
              </p>
            </div>
          </div>

          {/* Right White Pill Button with Hover Motion */}
          <div className="shrink-0 self-end lg:self-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setInfoModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-white text-[#162E54] hover:bg-[#F8FAFC] font-semibold text-xs tracking-tight shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
            >
              See More Info
            </motion.button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 3. Main Content Card Container (Exact White Box with Rounded Corners) */}
      <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-[#E2E8F0]/70 shadow-sm space-y-5">
        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'trending', label: '🔥 Trending Models' },
              { id: 'creative', label: 'Creative Studio' },
              { id: 'marketing', label: 'Advertising & Copy' },
              { id: 'media', label: 'Video & Film' },
              { id: 'audio', label: 'Audio & Voice' },
              { id: 'engineering', label: 'BIM & Operations' },
            ].map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B365D] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-medium text-[#64748B] hidden md:block">
            Showing <span className="font-bold text-[#0F172A]">{filteredServices.length}</span> active options
          </div>
        </div>

        {/* 4. Model Trending Hover Rows List (with Motion UI) */}
        <div className="space-y-2">
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            const isHovered = activeHoverId === service.id;

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                onMouseEnter={() => setActiveHoverId(service.id)}
                className={`group relative rounded-2xl p-3 sm:px-5 sm:py-3.5 transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? 'bg-white shadow-[0_10px_30px_-5px_rgba(27,54,93,0.08)] ring-1 ring-slate-150 transform -translate-y-0.5'
                    : 'bg-transparent hover:bg-[#F8FAFC]'
                }`}
                onClick={() => service.available && handleBookNow(service)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Column: Icon + Title + Status Badge + Description */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 sm:w-[42%]">
                    {/* Rounded Icon Box */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isHovered
                          ? 'bg-[#1B365D] text-white shadow-sm'
                          : 'bg-[#F1F5F9] text-[#1B365D] group-hover:bg-[#E2E8F0]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Title + Status Badge + Subtext */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-[15px] text-[#0F172A] tracking-tight">
                          {service.title}
                        </span>

                        {/* Status Pill Badge (Green Available / Gray Not Available) */}
                        {service.available ? (
                          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-white bg-[#10B981] px-2 py-0.5 rounded-md leading-tight shadow-xs">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-white bg-[#94A3B8] px-2 py-0.5 rounded-md leading-tight">
                            Not Available
                          </span>
                        )}

                        {service.trendingBadge && (
                          <span className="inline-flex items-center text-[10px] font-extrabold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                            {service.trendingBadge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#64748B] font-normal truncate mt-0.5 max-w-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column 1: Service Price */}
                  <div className="flex items-center justify-between sm:justify-center sm:w-[20%] text-xs font-semibold">
                    <span className="text-[#64748B] sm:hidden">Pricing:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#64748B] font-medium text-[11px] sm:text-xs">Service Price</span>
                      <span className="text-[#D97706] font-bold text-sm sm:text-[15px] tabular-nums">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column 2: Latest Work Avatars */}
                  <div className="hidden md:flex items-center gap-2 sm:w-[22%]">
                    <span className="text-xs text-[#64748B] font-medium">Latest work</span>
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {service.avatars.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="Work sample"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Interactive Action Button (Paper plane vs Book now pill) */}
                  <div className="flex items-center justify-end sm:w-[16%]">
                    <AnimatePresence mode="wait">
                      {isHovered && service.available ? (
                        <motion.button
                          key="book-now-btn"
                          initial={{ opacity: 0, scale: 0.9, x: 8 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: 8 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleBookNow(service, e)}
                          className="px-4 py-1.5 rounded-full bg-[#1B365D] hover:bg-[#122540] text-white font-semibold text-xs tracking-tight shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer relative"
                        >
                          <span>Book now</span>
                          <span className="text-[#F59E0B] text-xs">✦</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          key="default-send-btn"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => {
                            if (service.available) handleBookNow(service, e);
                          }}
                          className={`p-2 rounded-full transition-colors cursor-pointer ${
                            service.available
                              ? 'text-[#64748B] hover:text-[#1B365D] hover:bg-[#F1F5F9]'
                              : 'text-[#CBD5E1] cursor-not-allowed'
                          }`}
                          title={service.available ? 'Book Service' : 'Currently Unavailable'}
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredServices.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold">No services found matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-bold text-[#1B365D] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Interactive Booking Modal with Motion UI */}
      <AnimatePresence>
        {selectedServiceForBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedServiceForBooking(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B365D] text-white flex items-center justify-center shadow-md">
                    {React.createElement(selectedServiceForBooking.icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      Book {selectedServiceForBooking.title}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Verified AI & Production Generation Pipeline
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedServiceForBooking(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Service specs */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Service Model</span>
                  <span className="font-bold text-[#0F172A]">{selectedServiceForBooking.title} v2.5</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Estimated Delivery</span>
                  <span className="font-bold text-[#10B981]">Instant / Real-time Sync</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Base License Rate</span>
                  <span className="font-bold text-[#D97706] tabular-nums text-sm">
                    {selectedServiceForBooking.price}
                  </span>
                </div>
              </div>

              {/* Project Scope / Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A]">Project Brief / Prompt Scope</label>
                <textarea
                  rows={3}
                  defaultValue="Commercial spot generation for Metro Corridor Station 4 with drone footage integration and social media cut downs."
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]"
                />
              </div>

              {/* Booking Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedServiceForBooking(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#122540] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
                  <span>Confirm Booking ({selectedServiceForBooking.price})</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Success Modal */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-7 shadow-2xl border border-slate-100 max-w-sm w-full text-center space-y-3 z-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#DCFCE7] text-[#10B981] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Booking Successfully Confirmed!</h3>
              <p className="text-xs text-[#64748B]">
                Your request has been queued to the neural generation runner. You will receive an instant notification.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. "See More Info" Generator Modal */}
      <AnimatePresence>
        {infoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModalOpen(false)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    AI Studio Engine
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] mt-1.5">
                    About AI Content Generator
                  </h3>
                </div>
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                The BuildEase AI Content Suite integrates deep multimodal models to automate media production,
                on-site progress documentation, and public-facing marketing collateral. From automated video cutting to
                neural speech synthesis, every asset is verified with cryptographic watermarks and cloud storage logs.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">Throughput Speed</div>
                  <div className="text-lg font-black text-[#0F172A] mt-1">120 frames/sec</div>
                  <div className="text-[11px] text-[#10B981] font-semibold mt-0.5">Ultra low latency</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">Multi-Trade Library</div>
                  <div className="text-lg font-black text-[#0F172A] mt-1">50+ Pre-trained</div>
                  <div className="text-[11px] text-[#D97706] font-semibold mt-0.5">Civil & Architectural</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setInfoModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#122540] text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Got it, close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
