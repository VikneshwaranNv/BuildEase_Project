import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  NavItemKey,
  ProjectSite,
  WorkerProfile,
  AttendanceRecord,
  WorkerTrade,
  TaskItem,
  MaterialStock,
  PayrollRecord,
  SiteDocument,
  OperationalAlert,
  LocationPermissionStatus,
  DeviceLocationCoordinates,
} from '../types';
import { AttendanceSession } from '../types/biometrics';
import { getTranslation } from '../i18n/translations';
import { BiometricsService } from '../services/biometricsService';
import { UserAccount, LoginCredentials, SignUpPayload } from '../types/auth';
import { AuthService, DEMO_USERS } from '../services/authService';

const STORAGE_KEY_LANG = 'buildease_preferred_language';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeNav: NavItemKey;
  setActiveNav: (nav: NavItemKey) => void;
  t: (key: string, params?: Record<string, string | number>) => string;

  // Authentication State & Handlers
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (payload: SignUpPayload) => Promise<void>;
  logout: () => void;
  demoLogin: (role: UserRole) => Promise<void>;

  // Site Location Security Gate & GPS Telemetry
  locationPermissionStatus: LocationPermissionStatus;
  deviceLocation: DeviceLocationCoordinates | null;
  locationError: string | null;
  requestLocationAccess: () => Promise<boolean>;
  overrideLocationWithDemoSite: (siteId?: string) => void;

  projects: ProjectSite[];
  workers: WorkerProfile[];
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  refreshBiometricAttendance: () => Promise<void>;
  tasks: TaskItem[];
  materials: MaterialStock[];
  payrollRecords: PayrollRecord[];
  documents: SiteDocument[];
  alerts: OperationalAlert[];

  // Functional interactive handlers
  verifyAttendanceRecord: (id: string) => void;
  flagAttendanceRecord: (id: string, note?: string) => void;
  verifyAllPendingAttendance: () => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateTaskProgress: (id: string, newCompletedQuantity: number) => void;
  assignWorkersToTask: (taskId: string, workerIds: string[]) => void;
  createTask: (newTask: Omit<TaskItem, 'id' | 'completedQuantity' | 'status'>) => void;
  consumeMaterialStock: (id: string, quantity: number) => void;
  approvePayrollBatch: () => void;
  addWorker: (worker: Omit<WorkerProfile, 'id' | 'workerId'>) => void;
  addProject: (project: Omit<ProjectSite, 'id' | 'code' | 'criticalAlertsCount'>) => void;
}

const INITIAL_PROJECTS: ProjectSite[] = [
  {
    id: 'proj-1',
    code: 'METRO-L4-P24',
    name: 'Metro Elevated Corridor - Pier 24–40',
    location: 'Eastern Expressway, Sector 7',
    manager: 'Rajesh Sharma',
    supervisor: 'Aniket Patil',
    status: 'active',
    workforceCount: 142,
    progressPercent: 68,
    startDate: '2025-08-15',
    targetDate: '2026-12-30',
    budgetAllocated: 48000000,
    criticalAlertsCount: 2,
    geoCoordinates: {
      latitude: 19.0760,
      longitude: 72.8777,
      radiusMeters: 250,
    },
  },
  {
    id: 'proj-2',
    code: 'HZ-COMM-TWR-B',
    name: 'Horizon Commercial Hub - Tower B',
    location: 'MIDC Industrial Zone, Pune',
    manager: 'Sunita Sen',
    supervisor: 'Vikram Joshi',
    status: 'active',
    workforceCount: 94,
    progressPercent: 42,
    startDate: '2026-01-10',
    targetDate: '2027-04-15',
    budgetAllocated: 32000000,
    criticalAlertsCount: 0,
    geoCoordinates: {
      latitude: 18.5204,
      longitude: 73.8567,
      radiusMeters: 200,
    },
  },
  {
    id: 'proj-3',
    code: 'HW-BYPASS-K32',
    name: 'Greenfield Bypass Km 18–32',
    location: 'Outer Ring Highway, Nagpur',
    manager: 'Rajesh Sharma',
    supervisor: 'Devendra Das',
    status: 'active',
    workforceCount: 180,
    progressPercent: 81,
    startDate: '2025-04-01',
    targetDate: '2026-11-20',
    budgetAllocated: 65000000,
    criticalAlertsCount: 1,
    geoCoordinates: {
      latitude: 21.1458,
      longitude: 79.0882,
      radiusMeters: 500,
    },
  },
  {
    id: 'proj-4',
    code: 'RIV-LOG-PARK',
    name: 'Riverside Logistics Park - Phase 1',
    location: 'Nashik Industrial Corridor',
    manager: 'Sunita Sen',
    supervisor: 'Ramesh Gaikwad',
    status: 'on_hold',
    workforceCount: 0,
    progressPercent: 15,
    startDate: '2026-02-01',
    targetDate: '2027-08-30',
    budgetAllocated: 18000000,
    criticalAlertsCount: 1,
    geoCoordinates: {
      latitude: 19.9975,
      longitude: 73.7898,
      radiusMeters: 300,
    },
  },
];

const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-101',
    workerId: 'W-0418',
    fullName: 'Rameshwar Yadav',
    trade: 'mason',
    assignedSiteId: 'proj-1',
    assignedSiteName: 'Metro Elevated Corridor - Pier 24–40',
    dailyWageRate: 750,
    verificationStatus: 'verified',
    safetyCertified: true,
    phone: '+91 98230 44102',
    joinedDate: '2025-08-20',
  },
  {
    id: 'w-102',
    workerId: 'W-0422',
    fullName: 'Mohammad Shahid Khan',
    trade: 'steel_fixer',
    assignedSiteId: 'proj-1',
    assignedSiteName: 'Metro Elevated Corridor - Pier 24–40',
    dailyWageRate: 850,
    verificationStatus: 'verified',
    safetyCertified: true,
    phone: '+91 94220 81920',
    joinedDate: '2025-08-22',
  },
  {
    id: 'w-103',
    workerId: 'W-0435',
    fullName: 'Santosh Baburao Shinde',
    trade: 'carpenter',
    assignedSiteId: 'proj-1',
    assignedSiteName: 'Metro Elevated Corridor - Pier 24–40',
    dailyWageRate: 800,
    verificationStatus: 'pending',
    safetyCertified: true,
    phone: '+91 98600 31254',
    joinedDate: '2025-09-01',
  },
  {
    id: 'w-104',
    workerId: 'W-0450',
    fullName: 'Bikramjit Barman',
    trade: 'electrician',
    assignedSiteId: 'proj-2',
    assignedSiteName: 'Horizon Commercial Hub - Tower B',
    dailyWageRate: 900,
    verificationStatus: 'verified',
    safetyCertified: true,
    phone: '+91 98540 12890',
    joinedDate: '2026-01-15',
  },
  {
    id: 'w-105',
    workerId: 'W-0461',
    fullName: 'Subhash Chandra Mondal',
    trade: 'welder',
    assignedSiteId: 'proj-3',
    assignedSiteName: 'Greenfield Bypass Km 18–32',
    dailyWageRate: 950,
    verificationStatus: 'verified',
    safetyCertified: true,
    phone: '+91 94330 98711',
    joinedDate: '2025-04-10',
  },
  {
    id: 'w-106',
    workerId: 'W-0478',
    fullName: 'Prakash Mahato',
    trade: 'general_helper',
    assignedSiteId: 'proj-1',
    assignedSiteName: 'Metro Elevated Corridor - Pier 24–40',
    dailyWageRate: 550,
    verificationStatus: 'verified',
    safetyCertified: false,
    phone: '+91 97710 45623',
    joinedDate: '2025-10-05',
  },
  {
    id: 'w-107',
    workerId: 'W-0485',
    fullName: 'Ajay Kumar Maurya',
    trade: 'equipment_operator',
    assignedSiteId: 'proj-3',
    assignedSiteName: 'Greenfield Bypass Km 18–32',
    dailyWageRate: 1100,
    verificationStatus: 'verified',
    safetyCertified: true,
    phone: '+91 98390 67120',
    joinedDate: '2025-05-18',
  },
];

function mapSessionToAttendanceRecord(sess: AttendanceSession): AttendanceRecord {
  return {
    id: sess.id,
    workerId: sess.workerId,
    workerName: sess.workerName,
    trade: (sess.trade as WorkerTrade) || 'general_helper',
    siteId: sess.siteId,
    siteName: sess.siteName,
    date: sess.date,
    checkInTime: sess.checkInTime,
    checkOutTime: sess.checkOutTime,
    hoursWorked: sess.hoursWorked ?? 8.0,
    overtimeHours: sess.overtimeHours ?? 0,
    status: (sess.overtimeHours ?? 0) > 0 ? 'overtime' : 'present',
    verificationStatus:
      sess.supervisorReviewStatus === 'verified'
        ? 'supervisor_verified'
        : sess.supervisorReviewStatus === 'disputed'
        ? 'flagged'
        : 'raw_checkin',
    verifiedBy: sess.verifiedBy,
    notes: sess.flagReason ? `Review: ${sess.flagReason}` : undefined,
  };
}

const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    title: 'Pier 28 Cap Beam Concrete Pouring',
    trade: 'mason',
    targetQuantity: 280,
    completedQuantity: 210,
    unit: 'm³',
    assignedWorkersCount: 18,
    deadline: '2026-10-18',
    status: 'in_progress',
    leadSupervisor: 'Aniket Patil',
    assignedWorkerIds: ['w-101'],
  },
  {
    id: 'task-2',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    title: 'Pier 29 & 30 Rebar Cage Binding',
    trade: 'steel_fixer',
    targetQuantity: 45,
    completedQuantity: 42,
    unit: 'MT',
    assignedWorkersCount: 22,
    deadline: '2026-10-15',
    status: 'in_progress',
    leadSupervisor: 'Aniket Patil',
    assignedWorkerIds: ['w-102'],
  },
  {
    id: 'task-3',
    siteId: 'proj-2',
    siteName: 'Horizon Commercial Hub',
    title: 'Floor 6 Timber Shuttering & Formwork',
    trade: 'carpenter',
    targetQuantity: 850,
    completedQuantity: 810,
    unit: 'sq.m',
    assignedWorkersCount: 14,
    deadline: '2026-10-14',
    status: 'review_required',
    leadSupervisor: 'Vikram Joshi',
    assignedWorkerIds: ['w-103'],
  },
  {
    id: 'task-4',
    siteId: 'proj-3',
    siteName: 'Greenfield Bypass',
    title: 'Culvert Section C-4 Subgrade Compaction',
    trade: 'equipment_operator',
    targetQuantity: 1200,
    completedQuantity: 1050,
    unit: 'cu.m',
    assignedWorkersCount: 8,
    deadline: '2026-10-20',
    status: 'in_progress',
    leadSupervisor: 'Devendra Das',
    assignedWorkerIds: ['w-107'],
  },
  {
    id: 'task-5',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    title: 'Ground Earthing & Conduiting Span 14',
    trade: 'electrician',
    targetQuantity: 360,
    completedQuantity: 360,
    unit: 'm',
    assignedWorkersCount: 6,
    deadline: '2026-10-12',
    status: 'completed',
    leadSupervisor: 'Aniket Patil',
    assignedWorkerIds: ['w-104'],
  },
];

const INITIAL_MATERIALS: MaterialStock[] = [
  {
    id: 'mat-1',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    itemName: 'OPC 53 Grade Cement (Ultratech)',
    category: 'cement',
    currentStock: 480,
    reorderLevel: 600,
    unit: 'Bags',
    lastRestocked: '2026-10-09',
    status: 'low_stock',
  },
  {
    id: 'mat-2',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    itemName: 'TMT Rebar Fe500D (16mm)',
    category: 'steel',
    currentStock: 24.5,
    reorderLevel: 15.0,
    unit: 'MT',
    lastRestocked: '2026-10-11',
    status: 'in_stock',
  },
  {
    id: 'mat-3',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    itemName: 'Crushed Basalt Aggregate 20mm',
    category: 'aggregates',
    currentStock: 52,
    reorderLevel: 60,
    unit: 'm³',
    lastRestocked: '2026-10-08',
    status: 'low_stock',
  },
  {
    id: 'mat-4',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    itemName: 'River Sand (Washed & Screened)',
    category: 'aggregates',
    currentStock: 14,
    reorderLevel: 35,
    unit: 'm³',
    lastRestocked: '2026-10-04',
    status: 'critical',
  },
  {
    id: 'mat-5',
    siteId: 'proj-2',
    siteName: 'Horizon Commercial Hub',
    itemName: 'Waterproof Shuttering Plywood 18mm',
    category: 'timber',
    currentStock: 320,
    reorderLevel: 100,
    unit: 'Sheets',
    lastRestocked: '2026-10-07',
    status: 'in_stock',
  },
  {
    id: 'mat-6',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    itemName: 'ISI Certified Safety Helmets (Class E)',
    category: 'safety',
    currentStock: 110,
    reorderLevel: 40,
    unit: 'Units',
    lastRestocked: '2026-09-28',
    status: 'in_stock',
  },
];

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-1',
    workerId: 'W-0418',
    workerName: 'Rameshwar Yadav',
    trade: 'mason',
    siteName: 'Metro Elevated Corridor',
    period: 'Oct 01 – Oct 15, 2026',
    daysPresent: 12,
    overtimeHours: 6.5,
    dailyRate: 750,
    grossPay: 9609,
    deductions: 500,
    netPayable: 9109,
    status: 'calculated',
  },
  {
    id: 'pay-2',
    workerId: 'W-0422',
    workerName: 'Mohammad Shahid Khan',
    trade: 'steel_fixer',
    siteName: 'Metro Elevated Corridor',
    period: 'Oct 01 – Oct 15, 2026',
    daysPresent: 12,
    overtimeHours: 4.0,
    dailyRate: 850,
    grossPay: 10625,
    deductions: 0,
    netPayable: 10625,
    status: 'calculated',
  },
  {
    id: 'pay-3',
    workerId: 'W-0435',
    workerName: 'Santosh Baburao Shinde',
    trade: 'carpenter',
    siteName: 'Metro Elevated Corridor',
    period: 'Oct 01 – Oct 15, 2026',
    daysPresent: 11,
    overtimeHours: 0,
    dailyRate: 800,
    grossPay: 8800,
    deductions: 800,
    netPayable: 8000,
    status: 'calculated',
  },
  {
    id: 'pay-4',
    workerId: 'W-0450',
    workerName: 'Bikramjit Barman',
    trade: 'electrician',
    siteName: 'Horizon Commercial Hub',
    period: 'Oct 01 – Oct 15, 2026',
    daysPresent: 12,
    overtimeHours: 8.0,
    dailyRate: 900,
    grossPay: 11700,
    deductions: 0,
    netPayable: 11700,
    status: 'supervisor_approved',
  },
  {
    id: 'pay-5',
    workerId: 'W-0461',
    workerName: 'Subhash Chandra Mondal',
    trade: 'welder',
    siteName: 'Greenfield Bypass Km 18–32',
    period: 'Sep 16 – Sep 30, 2026',
    daysPresent: 14,
    overtimeHours: 12.0,
    dailyRate: 950,
    grossPay: 14725,
    deductions: 0,
    netPayable: 14725,
    status: 'disbursed',
    paymentRef: 'NEFT-AXIS-99214',
  },
];

const INITIAL_DOCUMENTS: SiteDocument[] = [
  {
    id: 'doc-1',
    title: 'Metro Pier 28-30 Structural Beam Drawing',
    category: 'drawing_blueprint',
    siteName: 'Metro Elevated Corridor',
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    uploadedBy: 'Rajesh Sharma (PM)',
    uploadDate: '2026-10-02',
    version: 'v4.2',
  },
  {
    id: 'doc-2',
    title: 'Hot Work & Overhead Rigging Safety Permit',
    category: 'safety_permit',
    siteName: 'Metro Elevated Corridor',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    uploadedBy: 'Aniket Patil (Supervisor)',
    uploadDate: '2026-10-12',
    version: 'v1.0',
  },
  {
    id: 'doc-3',
    title: 'RMC Batch Quality & Slump Test Certificate #810',
    category: 'inspection_log',
    siteName: 'Metro Elevated Corridor',
    fileFormat: 'PDF',
    fileSize: '840 KB',
    uploadedBy: 'Quality Assurance Lab',
    uploadDate: '2026-10-11',
    version: 'Final',
  },
  {
    id: 'doc-4',
    title: 'TMT Steel Delivery Chit & Mill Test Certificate',
    category: 'delivery_chit',
    siteName: 'Greenfield Bypass',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    uploadedBy: 'Devendra Das (Supervisor)',
    uploadDate: '2026-10-10',
    version: 'Chit #4892',
  },
];

const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alert-1',
    siteName: 'Metro Elevated Corridor',
    type: 'safety_compliance',
    severity: 'high',
    message: 'Pier 28 overhead rigging requires updated safety briefing for shift #2.',
    timestamp: '2 hours ago',
  },
  {
    id: 'alert-2',
    siteName: 'Metro Elevated Corridor',
    type: 'attendance_discrepancy',
    severity: 'medium',
    message: '3 raw check-in records for shift #1 require supervisor muster sign-off.',
    timestamp: 'Today, 08:30 AM',
  },
  {
    id: 'alert-3',
    siteName: 'Greenfield Bypass',
    type: 'milestone_risk',
    severity: 'medium',
    message: 'Culvert Section C-4 requires equipment operator check-in for tomorrow.',
    timestamp: 'Yesterday',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return AuthService.getCurrentSession();
  });
  const isAuthenticated = Boolean(currentUser);

  const [role, setRoleState] = useState<UserRole>(() => {
    const session = AuthService.getCurrentSession();
    return session ? session.role : 'contractor';
  });

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (currentUser) {
      const updated: UserAccount = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      AuthService.saveSession(updated, 'jwt_token', true);
    }
  }, [currentUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await AuthService.login(credentials);
    setCurrentUser(res.user);
    setRoleState(res.user.role);
    BiometricsService.setActiveAuth({
      role: res.user.role,
      userId: res.user.id,
      siteId: res.user.siteId || 'proj-1',
      userName: res.user.fullName,
    });
  }, []);

  const signup = useCallback(async (payload: SignUpPayload) => {
    const res = await AuthService.signup(payload);
    setCurrentUser(res.user);
    setRoleState(res.user.role);
    BiometricsService.setActiveAuth({
      role: res.user.role,
      userId: res.user.id,
      siteId: res.user.siteId || 'proj-1',
      userName: res.user.fullName,
    });
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setCurrentUser(null);
  }, []);

  const demoLogin = useCallback(async (demoRole: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === demoRole) || DEMO_USERS[0];
    const res = await AuthService.login({
      emailOrPhone: found.email,
      password: found.passwordHash,
      rememberMe: true,
    });
    setCurrentUser(res.user);
    setRoleState(res.user.role);
    BiometricsService.setActiveAuth({
      role: res.user.role,
      userId: res.user.id,
      siteId: res.user.siteId || 'proj-1',
      userName: res.user.fullName,
    });
  }, []);

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY_LANG);
        if (saved && ['en', 'hi', 'mr', 'as', 'bn'].includes(saved)) {
          return saved as LanguageCode;
        }
      }
    } catch {
      // ignore storage access issues
    }
    return 'en';
  });
  const [activeNav, setActiveNav] = useState<NavItemKey>('overview');

  const setLanguage = useCallback((newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LANG, newLang);
      }
    } catch {
      // ignore storage write issues
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  }, []);

  // Sync document lang on mount and language updates
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Sync BiometricsService active auth with current role
  useEffect(() => {
    let authContext = {
      role,
      userId: role === 'worker' ? 'W-0418' : 'SUP-PATIL-01',
      siteId: 'proj-1',
      userName: role === 'worker' ? 'Rameshwar Yadav' : 'Aniket Patil',
    };
    if (role === 'contractor') {
      authContext = {
        role: 'contractor',
        userId: 'ADMIN-01',
        siteId: 'proj-1',
        userName: 'Contractor Admin',
      };
    } else if (role === 'project_manager') {
      authContext = {
        role: 'project_manager',
        userId: 'PM-SHARMA-01',
        siteId: 'proj-1',
        userName: 'Rajesh Sharma',
      };
    }
    BiometricsService.setActiveAuth(authContext);
  }, [role]);

  const [projects, setProjects] = useState<ProjectSite[]>(INITIAL_PROJECTS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [materials, setMaterials] = useState<MaterialStock[]>(INITIAL_MATERIALS);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  const [documents] = useState<SiteDocument[]>(INITIAL_DOCUMENTS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);

  // Site Location Security Gate State & Geolocation Telemetry
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<LocationPermissionStatus>('checking');
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocationAccess = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        setLocationPermissionStatus('unsupported');
        setLocationError('Geolocation API is not supported on this device/browser');
        resolve(false);
        return;
      }

      setLocationPermissionStatus('checking');
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            timestamp: pos.timestamp,
            isMocked: false,
          });
          setLocationPermissionStatus('granted');
          setLocationError(null);
          resolve(true);
        },
        (err) => {
          console.warn('[AppContext] Geolocation error:', err.code, err.message);
          let errMsg = err.message;
          if (err.code === 1) {
            setLocationPermissionStatus('denied');
            errMsg = 'Location permission was denied by user or browser policy.';
          } else if (err.code === 2) {
            setLocationPermissionStatus('denied');
            errMsg = 'Device position unavailable. Please enable device location / GPS hardware.';
          } else if (err.code === 3) {
            setLocationPermissionStatus('prompt');
            errMsg = 'Location acquisition timed out. Please retry.';
          } else {
            setLocationPermissionStatus('denied');
          }
          setLocationError(errMsg);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  }, []);

  const overrideLocationWithDemoSite = useCallback((siteId = 'proj-1') => {
    const site = INITIAL_PROJECTS.find((p) => p.id === siteId) || INITIAL_PROJECTS[0];
    const geo = site.geoCoordinates || { latitude: 19.0760, longitude: 72.8777, radiusMeters: 250 };
    setDeviceLocation({
      latitude: geo.latitude + 0.0001,
      longitude: geo.longitude + 0.00008,
      accuracy: 12,
      timestamp: Date.now(),
      isMocked: true,
    });
    setLocationPermissionStatus('granted');
    setLocationError(null);
  }, []);

  // Check initial permission status on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationPermissionStatus('unsupported');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            requestLocationAccess();
          } else if (permissionStatus.state === 'denied') {
            setLocationPermissionStatus('denied');
          } else {
            setLocationPermissionStatus('prompt');
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              requestLocationAccess();
            } else if (permissionStatus.state === 'denied') {
              setLocationPermissionStatus('denied');
              setDeviceLocation(null);
            } else {
              setLocationPermissionStatus('prompt');
            }
          };
        })
        .catch(() => {
          setLocationPermissionStatus('prompt');
        });
    } else {
      setLocationPermissionStatus('prompt');
    }
  }, [requestLocationAccess]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return getTranslation(language, key, params);
    },
    [language]
  );

  // Functional handlers
  const verifyAttendanceRecord = (id: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              verificationStatus: 'supervisor_verified',
              verifiedBy: role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil (Site Supervisor)',
            }
          : rec
      )
    );
  };

  const flagAttendanceRecord = (id: string, note?: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              verificationStatus: 'flagged',
              notes: note || 'Discrepancy flagged during site muster check',
            }
          : rec
      )
    );
  };

  const verifyAllPendingAttendance = () => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.verificationStatus === 'raw_checkin'
          ? {
              ...rec,
              verificationStatus: 'supervisor_verified',
              verifiedBy: 'Aniket Patil (Site Supervisor)',
            }
          : rec
      )
    );
    // Remove the attendance alert
    setAlerts((prev) => prev.filter((a) => a.type !== 'attendance_discrepancy'));
  };

  // Load real biometric attendance records from server
  const refreshBiometricAttendance = useCallback(async () => {
    try {
      const sessions = await BiometricsService.fetchSessions();
      if (Array.isArray(sessions)) {
        const mapped = sessions.map(mapSessionToAttendanceRecord);
        setAttendanceRecords(mapped);
      }
    } catch (err) {
      console.warn('[AppContext] Could not fetch live biometric sessions:', err);
    }
  }, []);

  useEffect(() => {
    refreshBiometricAttendance();
  }, [refreshBiometricAttendance, role]);

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id || (r.workerId === record.workerId && r.date === record.date));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...record };
        return copy;
      }
      return [record, ...prev];
    });
  };

  const updateTaskProgress = (id: string, newCompletedQuantity: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const isDone = newCompletedQuantity >= task.targetQuantity;
          return {
            ...task,
            completedQuantity: newCompletedQuantity,
            status: isDone ? 'completed' : 'in_progress',
          };
        }
        return task;
      })
    );
  };

  const assignWorkersToTask = (taskId: string, workerIds: string[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            assignedWorkerIds: workerIds,
            assignedWorkersCount: workerIds.length,
          };
        }
        return t;
      })
    );
  };

  const createTask = (newTask: Omit<TaskItem, 'id' | 'completedQuantity' | 'status'>) => {
    const id = `task-${Date.now()}`;
    const task: TaskItem = {
      ...newTask,
      id,
      completedQuantity: 0,
      status: 'in_progress',
      assignedWorkersCount: newTask.assignedWorkerIds?.length || newTask.assignedWorkersCount || 0,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const consumeMaterialStock = (id: string, quantity: number) => {
    setMaterials((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.currentStock - quantity);
          let newStatus: 'in_stock' | 'low_stock' | 'critical' = 'in_stock';
          if (newStock <= item.reorderLevel * 0.4) {
            newStatus = 'critical';
          } else if (newStock <= item.reorderLevel) {
            newStatus = 'low_stock';
          }
          return {
            ...item,
            currentStock: newStock,
            status: newStatus,
          };
        }
        return item;
      })
    );
  };

  const approvePayrollBatch = () => {
    setPayrollRecords((prev) =>
      prev.map((pay) =>
        pay.status === 'calculated'
          ? {
              ...pay,
              status: 'supervisor_approved',
            }
          : pay
      )
    );
  };

  const addWorker = (workerData: Omit<WorkerProfile, 'id' | 'workerId'>) => {
    const newId = `w-${Date.now()}`;
    const newWorkerId = `W-0${Math.floor(100 + Math.random() * 900)}`;
    setWorkers((prev) => [
      {
        ...workerData,
        id: newId,
        workerId: newWorkerId,
      },
      ...prev,
    ]);
  };

  const addProject = (projectData: Omit<ProjectSite, 'id' | 'code' | 'criticalAlertsCount'>) => {
    const newId = `proj-${Date.now()}`;
    const code = projectData.name.substring(0, 4).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    setProjects((prev) => [
      {
        ...projectData,
        id: newId,
        code,
        criticalAlertsCount: 0,
      },
      ...prev,
    ]);
  };

  const contextValue = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      login,
      signup,
      logout,
      demoLogin,
      role,
      setRole,
      language,
      setLanguage,
      activeNav,
      setActiveNav,
      t,
      projects,
      workers,
      attendanceRecords,
      setAttendanceRecords,
      refreshBiometricAttendance,
      tasks,
      materials,
      payrollRecords,
      documents,
      alerts,
      verifyAttendanceRecord,
      flagAttendanceRecord,
      verifyAllPendingAttendance,
      addAttendanceRecord,
      updateTaskProgress,
      assignWorkersToTask,
      createTask,
      consumeMaterialStock,
      approvePayrollBatch,
      addWorker,
      addProject,
      locationPermissionStatus,
      deviceLocation,
      locationError,
      requestLocationAccess,
      overrideLocationWithDemoSite,
    }),
    [
      currentUser,
      isAuthenticated,
      login,
      signup,
      logout,
      demoLogin,
      role,
      setRole,
      language,
      activeNav,
      projects,
      workers,
      attendanceRecords,
      tasks,
      materials,
      payrollRecords,
      documents,
      alerts,
      t,
      setLanguage,
      refreshBiometricAttendance,
      locationPermissionStatus,
      deviceLocation,
      locationError,
      requestLocationAccess,
      overrideLocationWithDemoSite,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
