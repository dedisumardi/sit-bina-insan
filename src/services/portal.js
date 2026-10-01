export const portalRole = (path = window.location.pathname) => /(?:^|\/)admin(?:\/|\.|$)|login-admin/.test(path) ? 'admin' : 'pegawai';
export const loginUrl = role => '/login-' + role + '.html';
export const dashboardUrl = role => '/' + role + '.html';
export function readSession(role) {
  try {
    const session = JSON.parse(sessionStorage.getItem('sit_session_' + role));
    return session?.role === role && (role === 'admin' || session.employeeId) ? session : null;
  } catch { return null; }
}
export function saveSession(role, employee) {
  sessionStorage.setItem('sit_session_' + role, JSON.stringify({ role, employeeId: employee?.id || null }));
}
export function clearSession(role) { sessionStorage.removeItem('sit_session_' + role); }
