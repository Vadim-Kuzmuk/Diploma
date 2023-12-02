export const getExpirationDate = (jwtToken) => {
  if (!jwtToken) {
    return null;
  }
  const jwt = JSON.parse(atob(jwtToken.split(".")[1]));
  return jwt && jwt.exp && jwt.exp * 1000 || null;
};

export const isExpired = (exp) => {
  if (!exp) {
    return false;
  }
  return Date.now() > exp;
};