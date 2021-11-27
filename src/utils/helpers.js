export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@incedoinc\.com$/;
  return re.test(String(email).toLowerCase());
}

export function getCookie(cookie) {
  let match = document.cookie.match(new RegExp(cookie + '=([^;]+)'));
  if (match) return match[1];
  return;
}

export function validateIpv4(ip) {
  const re = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;
  return re.test(String(ip).toLowerCase());
}