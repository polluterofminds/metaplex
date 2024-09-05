export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: any[] = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }

  return null; // Return null if the cookie is not found
}

export function storeCookie(name: string, value: string) {
  const daysToExpire = 7;
  const date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ` + expires + "; path=/";
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}