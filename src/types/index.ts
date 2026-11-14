export type UserRole = 'contractor' | 'project_manager' | 'site_supervisor' | 'worker';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'as' | 'bn';

export type NavItemKey =
  | 'overview'
  | 'projects'
  | 'workforce'
  | 'attendance'
  | 'tasks'
  | 'payroll'
  | 'documents'
  | 'reports';

export interface ProjectSite {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  supervisor: string;
  status: 'active' | 'scheduled' | 'on_hold' | 'completed';
  workforceCount: number;
  progressPercent: number;
  startDate: string;
  targetDate: string;
  budgetAllocated: number;
  criticalAlertsCount: number;
  geoCoordinates?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
}

export type WorkerTrade =
  | 'mason'
  | 'steel_fixer'
  | 'carpenter'
  | 'electrician'
  | 'plumber'
  | 'equipment_operator'
  | 'welder'
  | 'general_helper';

export interface WorkerProfile {
  id: string;
  workerId: string;
  fullName: string;
  trade: WorkerTrade;
  assignedSiteId: string;
  assignedSiteName: string;
  dailyWageRate: number;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  safetyCertified: boolean;
  phone: string;
  joinedDate: string;
}

export type AttendanceVerificationStatus = 'raw_checkin' | 'supervisor_verified' | 'flagged';

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  trade: WorkerTrade;
  siteId: string;
  siteName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  hoursWorked: number;
  overtimeHours: number;
  status: 'present' | 'half_day' | 'absent' | 'overtime';
  verificationStatus: AttendanceVerificationStatus;
  verifiedBy?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  siteId: string;
  siteName: string;
  title: string;
  trade: WorkerTrade;
  targetQuantity: number;
  completedQuantity: number;
  unit: string;
  assignedWorkersCount: number;
  deadline: string;
  status: 'in_progress' | 'review_required' | 'completed' | 'delayed';
  leadSupervisor: string;
  assignedWorkerIds?: string[];
}

export interface MaterialStock {
  id: string;
  siteId: string;
  siteName: string;
  itemName: string;
  category: 'cement' | 'steel' | 'aggregates' | 'masonry' | 'timber' | 'safety';
  currentStock: number;
  reorderLevel: number;
  unit: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'critical';
}

export type PayrollStatus = 'calculated' | 'supervisor_approved' | 'disbursed';

export interface PayrollRecord {
  id: string;
  workerId: string;
  workerName: string;
  trade: WorkerTrade;
  siteName: string;
  period: string;
  daysPresent: number;
  overtimeHours: number;
  dailyRate: number;
  grossPay: number;
  deductions: number;
  netPayable: number;
  status: PayrollStatus;
  paymentRef?: string;
}

export interface SiteDocument {
  id: string;
  title: string;
  category: 'safety_permit' | 'drawing_blueprint' | 'inspection_log' | 'delivery_chit';
  siteName: string;
  fileFormat: 'PDF' | 'DWG' | 'DOCX';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
}

export interface OperationalAlert {
  id: string;
  siteName: string;
  type: 'attendance_discrepancy' | 'material_shortage' | 'milestone_risk' | 'safety_compliance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

export type LocationPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported' | 'checking';

export interface DeviceLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  isMocked?: boolean;
}
