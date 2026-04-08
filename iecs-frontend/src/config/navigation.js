import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ClipboardCheck, 
  Bell, 
  Briefcase,
  UserCircle,
  History,
  MessageSquare
} from 'lucide-react';

export const navConfig = {
  ADMIN: [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Caseworkers', path: '/admin/caseworkers', icon: Users },
    { name: 'Plans Management', path: '/admin/plans', icon: ShieldCheck },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
  ],
  CASEWORKER: [
    { name: 'Dashboard', path: '/caseworker', icon: LayoutDashboard },
    { name: 'Applications', path: '/caseworker/applications', icon: ClipboardCheck },
    { name: 'Eligibility', path: '/caseworker/eligibility', icon: ShieldCheck },
    { name: 'Review History', path: '/caseworker/history', icon: History },
    { name: 'Messenger', path: '/caseworker/messenger', icon: MessageSquare },
    { name: 'Benefits', path: '/caseworker/benefits', icon: Briefcase },
    { name: 'Notifications', path: '/caseworker/notifications', icon: Bell },
  ],
  CITIZEN: [
    { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Apply for Plan', path: '/dashboard/apply', icon: FileText },
    { name: 'My Applications', path: '/dashboard/status', icon: ClipboardCheck },
    { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ],
};
