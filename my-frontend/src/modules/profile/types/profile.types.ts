// types/profile.ts

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  avatar: string;
  role: UserRole;
  joinDate: string;
  settings: UserSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export type UserRole = 'Basic User' | 'Premium User' | 'Admin';

export interface UserSettings {
  language: Language;
  theme: Theme;
  timezone: Timezone;
  currency: Currency;
}

export type Language = 'id' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type Timezone = 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';
export type Currency = 'IDR' | 'USD' | 'EUR';

export interface NotificationSettings {
  email: EmailNotifications;
  push: PushNotifications;
}

export interface EmailNotifications {
  promotions: boolean;
  security: boolean;
  newsletter: boolean;
}

export interface PushNotifications {
  mentions: boolean;
  comments: boolean;
  updates: boolean;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  showOnlineStatus: boolean;
  allowTagging: boolean;
  searchEngineIndex: boolean;
}

export type ProfileVisibility = 'public' | 'followers' | 'private';

export interface Tab {
  id: string;
  label: string;
  icon: {
    name: string;
    color: string;
  };
}

export interface ThemeOption {
  value: Theme;
  label: string;
  sidebar: string;
  content: string;
}
