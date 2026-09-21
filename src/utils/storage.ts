import { UserProfile, PaymentTransaction, SubscriptionPlanId } from '../types';

const USER_STORAGE_KEY = 'predict_mindset_user_v1';
const TRANSACTIONS_STORAGE_KEY = 'predict_mindset_transactions_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_guest_8271',
  name: 'Patrick Joseph',
  email: 'patrickjoseph01123@gmail.com',
  phone: '+234 812 345 6789',
  currentPlan: 'free',
  planExpiresAt: null,
  joinedAt: '2026-09-01T10:00:00.000Z',
  bankroll: 50000,
  notificationsEnabled: true,
};

export function getStoredUser(): UserProfile {
  try {
    const item = localStorage.getItem(USER_STORAGE_KEY);
    if (!item) return DEFAULT_USER;
    const parsed = JSON.parse(item);
    return { ...DEFAULT_USER, ...parsed };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to storage:', e);
  }
}

export function getStoredTransactions(): PaymentTransaction[] {
  try {
    const item = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!item) return [];
    return JSON.parse(item);
  } catch {
    return [];
  }
}

export function recordTransaction(tx: PaymentTransaction): void {
  try {
    const existing = getStoredTransactions();
    const updated = [tx, ...existing];
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save transaction:', e);
  }
}

export function updateUserPlan(planId: SubscriptionPlanId, durationDays: number): UserProfile {
  const current = getStoredUser();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const updated: UserProfile = {
    ...current,
    currentPlan: planId,
    planExpiresAt: expiresAt,
  };

  saveStoredUser(updated);
  return updated;
}
