export function getToken(): string {
  return localStorage.getItem("token") || '';
}

export function setToken(value: string) {
  localStorage.setItem("token", value);
}

export function deleteToken() {
  localStorage.removeItem("token");
}





