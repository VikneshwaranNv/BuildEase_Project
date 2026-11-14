import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Radio,
  TowerControl as Tower,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BiometricsService } from '../../services/biometricsService';
import { AttendancePunch, AttendanceSession, PunchType } from '../../types/biometrics';
import { AttendanceRecord, WorkerTrade } from '../../types';

interface ButtonPhonePunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPunchSuccess: (punch: AttendancePunch, session: AttendanceSession) => void;
}

export const ButtonPhonePunchModal: React.FC<ButtonPhonePunchModalProps> = ({
  isOpen,
  onClose,
  onPunchSuccess,
}) => {
  const { workers, projects, language, addAttendanceRecord } = useApp();

  // Active Site & Worker
  const [selectedSiteId, setSelectedSiteId] = useState<string>(projects[0]?.id || 'proj-1');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('W-0418');
  const [punchType, setPunchType] = useState<PunchType>('CHECK_IN');

  // Dynamic gate codes per site
  const siteGateCodes: Record<string, { code: string; tower: string; distance: string }> = {
    'proj-1': { code: '582', tower: 'Sector-7 Central BTS-9921', distance: '18m from Gate' },
    'proj-2': { code: '419', tower: 'MIDC Industrial BTS-4412', distance: '24m from Gate' },
    'proj-3': { code: '837', tower: 'Highway Bypass BTS-1082', distance: '31m from Gate' },
    'proj-4': { code: '625', tower: 'Nashik Agro-Logistics BTS-7714', distance: '15m from Gate' },
  };

  const currentGateInfo = siteGateCodes[selectedSiteId] || siteGateCodes['proj-1'];

  // Phone Call Lifecycle State
  // 'IDLE' | 'CALLING' | 'CONNECTED_ENTER_PIN' | 'VERIFYING' | 'PUNCH_CONFIRMED' | 'SMS_RECEIVED' | 'CALL_FAILED'
  const [phoneState, setPhoneState] = useState<
    'IDLE' | 'CALLING' | 'CONNECTED_ENTER_PIN' | 'VERIFYING' | 'PUNCH_CONFIRMED' | 'SMS_RECEIVED' | 'CALL_FAILED'
  >('IDLE');

  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [phoneScreenMsg, setPhoneScreenMsg] = useState<string>('Press [CALL] to dial BuildEase 1800 Helpline');
  const [smsMessage, setSmsMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedWorker = workers.find((w) => w.workerId === selectedWorkerId) || workers[0];
  const selectedSite = projects.find((p) => p.id === selectedSiteId) || projects[0];

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setPhoneState('IDLE');
      setEnteredDigits('');
      setCallDuration(0);
      setSmsMessage(null);
      setErrorMessage(null);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isOpen]);

  // Voice Speech Helper
  const speakVoice = (textEn: string, textHi: string, textMr: string, textBn: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        let text = textEn;
        let langCode = 'en-US';

        if (language === 'hi') {
          text = textHi;
          langCode = 'hi-IN';
        } else if (language === 'mr') {
          text = textMr;
          langCode = 'mr-IN';
        } else if (language === 'bn' || language === 'as') {
          text = textBn;
          langCode = 'bn-IN';
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('[ButtonPhone] Speech synthesis warning:', err);
    }
  };

  // Start Call to 1800-BUILDEASE
  const handleInitiateCall = () => {
    setErrorMessage(null);
    setEnteredDigits('');
    setPhoneState('CALLING');
    setPhoneScreenMsg('Calling 1800-284-533...');

    // Simulate telecom network connecting after 1.2s
    setTimeout(() => {
      setPhoneState('CONNECTED_ENTER_PIN');
      setPhoneScreenMsg('IVR Active: Enter 3-Digit Site Code');
      setCallDuration(1);

      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Automated IVR speech prompt in worker's native language
      const wName = selectedWorker?.fullName || 'Worker';
      speakVoice(
        `Welcome to BuildEase Helpline, ${wName}. Please enter today's 3-digit site gate code on your keypad.`,
        `बिल्डईज़ हेल्पलाइन में आपका स्वागत है, ${wName} जी. कृपया अपने कीपैड पर आज का तीन अंकों का गेट कोड दर्ज करें.`,
        `बिल्डईज हेल्पलाइनवर आपले स्वागत आहे, ${wName}. कृपया आजचा तीन अंकी गेट कोड डायल करा.`,
        `বিল্ডইজ হেল্পলাইনে স্বাগতম, ${wName}। সাইটের ৩ সংখ্যার গেট কোড চাপুন।`
      );
    }, 1200);
  };

  // End Call
  const handleEndCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setPhoneState('IDLE');
    setEnteredDigits('');
    setCallDuration(0);
    setPhoneScreenMsg('Call Ended. Press [CALL] to retry.');
  };

  // Keypad button press
  const handleKeyPress = (char: string) => {
    // If not in call, allow typing to dial shortcode
    if (phoneState === 'IDLE') {
      if (enteredDigits.length < 10) {
        setEnteredDigits((prev) => prev + char);
      }
      return;
    }

    if (phoneState === 'CONNECTED_ENTER_PIN') {
      if (char >= '0' && char <= '9') {
        const nextDigits = enteredDigits + char;
        setEnteredDigits(nextDigits);

        // When 3 digits are entered, automatically verify!
        if (nextDigits.length === 3) {
          verifyGatePin(nextDigits);
        }
      }
    }
  };

  // Verify PIN against today's active gate code
  const verifyGatePin = async (code: string) => {
    setPhoneState('VERIFYING');
    setPhoneScreenMsg(`Validating PIN: [${code}] & Cell Tower...`);

    try {
      const res = await BiometricsService.submitIvrPhonePunch({
        workerId: selectedWorker.workerId,
        workerName: selectedWorker.fullName,
        trade: selectedWorker.trade,
        phoneNumber: selectedWorker.phone || '98231-40912',
        siteId: selectedSiteId,
        siteName: selectedSite.name,
        gateCode: code,
        cellTowerId: currentGateInfo.tower,
        punchType,
      });

      if (!res.success || !res.punch || !res.session) {
        throw new Error(res.error || 'Invalid site gate passcode. Check the site entrance board.');
      }

      // Success!
      setPhoneState('PUNCH_CONFIRMED');
      setPhoneScreenMsg(`Verified: ${punchType === 'CHECK_IN' ? 'Check-In' : 'Check-Out'} Logged`);

      // Speech confirmation
      const wName = selectedWorker.fullName;
      speakVoice(
        `Thank you ${wName}. Your ${punchType === 'CHECK_IN' ? 'check-in' : 'check-out'} at ${selectedSite.name} is verified. SMS sent.`,
        `धन्यवाद ${wName} जी. आपकी हाजिरी सफलतापूर्वक दर्ज हो गई है. पावती एसएमएस भेज दिया गया है.`,
        `धन्यवाद ${wName}. तुमची हजेरी नोंदवली गेली आहे. एसएमएस पाठवला आहे.`,
        `ধন্যবাদ ${wName}। আপনার উপস্থিতি গৃহীত হয়েছে। এসএমএস পাঠানো হয়েছে।`
      );

      // Create attendance record in AppContext ledger
      const newRec: AttendanceRecord = {
        id: res.session.id,
        workerId: res.punch.workerId,
        workerName: res.punch.workerName,
        trade: res.punch.trade as WorkerTrade,
        siteId: res.punch.siteId,
        siteName: res.punch.siteName,
        date: res.session.date,
        checkInTime: res.session.checkInTime,
        checkOutTime: res.session.checkOutTime,
        hoursWorked: res.session.hoursWorked,
        overtimeHours: res.session.overtimeHours,
        status: 'present',
        verificationStatus: 'supervisor_verified',
        verifiedBy: 'Auto-IVR Telephony (Gate PIN + Cell-ID Verified)',
        notes: `2G Phone Punch: Gate Code [${code}] · Tower ${currentGateInfo.tower} verified`,
      };

      addAttendanceRecord(newRec);
      onPunchSuccess(res.punch, res.session);

      // Trigger incoming SMS after 2 seconds
      setTimeout(() => {
        setPhoneState('SMS_RECEIVED');
        setSmsMessage(
          `BuildEase Alert: ${selectedWorker.fullName}, aapki check-in (08:02 AM) verify ho gayi hai. Site: ${selectedSite.name}. Tower: Sector 7. Helpline: 1800-284-533.`
        );
      }, 2000);
    } catch (err: any) {
      setPhoneState('CALL_FAILED');
      setErrorMessage(err.message || 'Passcode mismatch. Please enter the 3-digit PIN on the gate board.');
      setPhoneScreenMsg('PIN MISMATCH: Check Gate Board');

      speakVoice(
        'Incorrect site passcode. Please check the code on the gate board and try again.',
        'गलत गेट कोड. कृपया गेट बोर्ड पर लिखा तीन अंकों का कोड देखकर दोबारा डायल करें.',
        'चुकीचा गेट कोड. कृपया गेट बोर्डवरील कोड तपासून पुन्हा प्रयत्न करा.',
        'ভুল গেট কোড। অনুগ্রহ করে গেট বোর্ডের কোড দেখে আবার চেষ্টা করুন।'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="2G Feature Phone (Button Phone) Attendance Kiosk"
      subtitle="Allows workers with basic ₹800 keypad phones to punch attendance & verify site presence via daily Gate PIN and Cell Tower triangulation"
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#51483D] flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-[#A77B50]" />
            <span>Toll-Free Telephony Gateway · 0 Mobile Data Required</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#A77B50] hover:bg-[#8F6740] rounded-lg transition-all"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
        {/* Left Column: Site Config & Gate Blackboard (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Site Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#51483D] uppercase tracking-wider mb-1">
              Select Construction Project
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => {
                setSelectedSiteId(e.target.value);
                setEnteredDigits('');
                setPhoneState('IDLE');
              }}
              className="w-full p-2 bg-[#F4F0E8] border border-[#51483D]/30 rounded-lg text-[#252521] font-semibold focus:outline-hidden focus:border-[#A77B50]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Worker Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#51483D] uppercase tracking-wider mb-1">
              Simulated Worker (SIM Card)
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => {
                setSelectedWorkerId(e.target.value);
                setEnteredDigits('');
                setPhoneState('IDLE');
              }}
              className="w-full p-2 bg-[#F4F0E8] border border-[#51483D]/30 rounded-lg text-[#252521] font-semibold focus:outline-hidden focus:border-[#A77B50]"
            >
              {workers.map((w) => (
                <option key={w.workerId} value={w.workerId}>
                  {w.fullName} ({w.workerId}) — {w.trade}
                </option>
              ))}
            </select>
          </div>

          {/* Site Entrance Blackboard Representation */}
          <div className="p-4 bg-[#252521] border-2 border-[#A77B50]/40 rounded-xl text-center space-y-2 shadow-md relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[9px] font-mono text-[#D8CCB9]/60 uppercase">
              Physical Gate Board
            </div>
            <span className="text-[10px] font-bold text-[#D8CCB9] uppercase tracking-widest block">
              SITE ENTRANCE PASSCODE
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-widest text-[#F4F0E8] animate-pulse">
              {currentGateInfo.code}
            </div>
            <div className="text-[11px] text-[#96938B] leading-tight">
              Regenerated daily at 7:00 AM. Only workers physically standing at the entrance gate can see this code.
            </div>
            <div className="pt-2 border-t border-[#51483D] flex items-center justify-center gap-1.5 text-[10px] text-[#D8CCB9] font-mono">
              <Tower className="w-3 h-3 text-[#A77B50]" />
              <span>Tower: {currentGateInfo.tower}</span>
            </div>
          </div>

          {/* How It Verifies Location & Presence */}
          <div className="p-3 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl space-y-2 text-[#51483D] text-[11px]">
            <div className="font-bold text-[#252521] flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#A77B50]" />
              <span>How 2G Location Verification Works:</span>
            </div>
            <ul className="space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
              <li>
                <strong>Gate PIN:</strong> Confirms the worker read today’s code posted at the turnstile gate.
              </li>
              <li>
                <strong>Cell Tower Triangulation (BTS):</strong> Telecom validates the call originated from the site’s authorized cell tower (350m radius).
              </li>
              <li>
                <strong>Registered SIM:</strong> Caller-ID binds to worker ID <strong>{selectedWorker?.workerId}</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Realistic 2G Nokia / Jio Button Phone (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center">
          {/* Outer Phone Casing */}
          <div className="w-[270px] bg-[#252521] p-4 rounded-[36px] border-4 border-[#51483D] shadow-2xl space-y-3 relative select-none">
            {/* Earpiece Speaker Grille */}
            <div className="flex justify-center items-center gap-1.5 pt-1">
              <div className="w-12 h-1.5 bg-[#151513] rounded-full border border-[#51483D]" />
            </div>
            <div className="text-center font-mono text-[9px] text-[#A77B50] tracking-widest font-bold">
              BUILDEASE 2G
            </div>

            {/* Retro Backlit Monochrome LCD Screen */}
            <div className="w-full bg-[#18231C] border-3 border-[#0F1712] rounded-xl p-3 shadow-inner font-mono text-[#A7E8BD] relative overflow-hidden h-[155px] flex flex-col justify-between">
              {/* Scanline overlay effect */}
              <div className="absolute inset-0 bg-[#A7E8BD]/5 pointer-events-none" />

              {/* Top LCD Status Bar */}
              <div className="flex items-center justify-between text-[10px] border-b border-[#A7E8BD]/30 pb-1">
                <div className="flex items-center gap-1">
                  <span>ıll</span>
                  <span className="font-bold">Jio 2G</span>
                </div>
                {callDuration > 0 && <span className="font-bold">00:{callDuration.toString().padStart(2, '0')}</span>}
                <div className="flex items-center gap-1 font-bold">
                  <span>[■■■]</span>
                </div>
              </div>

              {/* LCD Main Screen Message */}
              <div className="py-2 text-center space-y-1">
                {phoneState === 'IDLE' && (
                  <div>
                    <div className="text-[10px] opacity-75">Toll-Free Kiosk Line</div>
                    <div className="text-xs font-bold tracking-wider text-[#F4F0E8]">1800-284-533</div>
                    <div className="text-[9px] opacity-60 mt-1">Press [CALL] to Punch</div>
                  </div>
                )}

                {phoneState === 'CALLING' && (
                  <div className="space-y-1 animate-pulse">
                    <div className="text-[10px]">DIALING...</div>
                    <div className="text-xs font-bold text-[#F4F0E8]">1800-BUILDEASE</div>
                    <div className="text-[9px] opacity-80">Connecting site line...</div>
                  </div>
                )}

                {phoneState === 'CONNECTED_ENTER_PIN' && (
                  <div className="space-y-1">
                    <div className="text-[9px] opacity-85">ENTER GATE CODE:</div>
                    <div className="text-xl font-extrabold tracking-widest bg-[#0F1712]/80 py-1 px-3 rounded border border-[#A7E8BD]/40 text-[#F4F0E8] inline-block min-w-[90px]">
                      {enteredDigits || '___'}
                    </div>
                    <div className="text-[8px] opacity-75">Press 3-digits on keypad</div>
                  </div>
                )}

                {phoneState === 'VERIFYING' && (
                  <div className="space-y-1 animate-pulse">
                    <div className="text-[10px]">CHECKING BTS TOWER...</div>
                    <div className="text-xs font-bold text-[#F4F0E8]">Sector 7 Central</div>
                  </div>
                )}

                {phoneState === 'PUNCH_CONFIRMED' && (
                  <div className="space-y-0.5 text-[#A6FFD2]">
                    <div className="text-[10px] font-bold">PUNCH VERIFIED</div>
                    <div className="text-[9px]">{selectedWorker?.fullName}</div>
                    <div className="text-[8px] opacity-80">08:02 AM · Pier 24 Site</div>
                  </div>
                )}

                {phoneState === 'SMS_RECEIVED' && (
                  <div className="text-left text-[8px] leading-tight space-y-0.5 overflow-hidden">
                    <div className="font-bold flex items-center justify-between border-b border-[#A7E8BD]/30 pb-0.5">
                      <span>SMS (BuildEase)</span>
                      <span>Now</span>
                    </div>
                    <p className="line-clamp-4 pt-0.5 opacity-90">{smsMessage}</p>
                  </div>
                )}

                {phoneState === 'CALL_FAILED' && (
                  <div className="text-[#FF8A8A] space-y-1">
                    <div className="text-[10px] font-bold">ACCESS DENIED</div>
                    <div className="text-[8px] leading-tight">PIN Mismatch · Retry</div>
                  </div>
                )}
              </div>

              {/* Bottom LCD Softkeys */}
              <div className="flex items-center justify-between text-[9px] border-t border-[#A7E8BD]/30 pt-0.5 opacity-80 font-bold">
                <span>{phoneState === 'IDLE' ? 'Menu' : 'Mute'}</span>
                <span>{phoneState === 'SMS_RECEIVED' ? 'Inbox' : 'Speaker'}</span>
              </div>
            </div>

            {/* D-Pad and Soft Action Keys */}
            <div className="grid grid-cols-3 gap-2 pt-1 items-center">
              <button
                type="button"
                onClick={handleInitiateCall}
                disabled={phoneState === 'CALLING' || phoneState === 'CONNECTED_ENTER_PIN'}
                className="h-9 rounded-lg bg-[#2E6B47] hover:bg-[#387D54] active:bg-[#245838] text-white flex items-center justify-center font-bold text-xs shadow-md border border-[#3E8B5E] cursor-pointer disabled:opacity-50"
                title="Green Call Key"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Center D-Pad */}
              <div className="h-9 rounded-full bg-[#35332C] border-2 border-[#51483D] flex items-center justify-center text-[10px] font-bold text-[#D8CCB9]">
                OK
              </div>

              <button
                type="button"
                onClick={handleEndCall}
                className="h-9 rounded-lg bg-[#8E2E2E] hover:bg-[#A63737] active:bg-[#722323] text-white flex items-center justify-center font-bold text-xs shadow-md border border-[#B34343] cursor-pointer"
                title="Red End Key"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>

            {/* 12-Key Physical Keypad (1-9, *, 0, #) */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { key: '1', sub: 'oo' },
                { key: '2', sub: 'abc' },
                { key: '3', sub: 'def' },
                { key: '4', sub: 'ghi' },
                { key: '5', sub: 'jkl' },
                { key: '6', sub: 'mno' },
                { key: '7', sub: 'pqrs' },
                { key: '8', sub: 'tuv' },
                { key: '9', sub: 'wxyz' },
                { key: '*', sub: 'P' },
                { key: '0', sub: '+' },
                { key: '#', sub: 'W' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleKeyPress(item.key)}
                  className="h-9 rounded-lg bg-[#302D27] hover:bg-[#3E3A33] active:scale-95 border border-[#51483D] text-[#F4F0E8] flex flex-col items-center justify-center transition-transform cursor-pointer"
                >
                  <span className="font-bold text-xs leading-none">{item.key}</span>
                  <span className="text-[7px] text-[#96938B] uppercase tracking-tighter leading-none mt-0.5">
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick 1-Click Simulation Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  handleInitiateCall();
                  setTimeout(() => {
                    verifyGatePin(currentGateInfo.code);
                  }, 1800);
                }}
                className="w-full py-1.5 rounded-lg bg-[#A77B50]/20 hover:bg-[#A77B50]/30 border border-[#A77B50]/40 text-[#A77B50] font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#A77B50]" />
                <span>1-Click Auto Dial & Enter PIN ({currentGateInfo.code})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
