export interface AccountAndId {
  id: number;
  accountNumber: string;
  initials: string;
}
export function createAccountAndidInterface(account) {
  const initials = '';
  const fullName = account.user.fullName
    .split(' ')
    .map((word) => word[0])
    .join('.')
    .toUpperCase();
  const accountAndId = {
    id: account.id,
    accountNumber: account.accountNumber,
    initials: fullName,
  };
  return accountAndId;
}
