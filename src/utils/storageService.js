// StorageService abstraction to invert dependency on localStorage
// High-level modules depend on this interface, not localStorage directly

class StorageService {
  static getToken() {
    return localStorage.getItem('nvcr_tk');
  }

  static setToken(token) {
    if (token) {
      localStorage.setItem('nvcr_tk', token);
    } else {
      this.clearToken();
    }
  }

  static clearToken() {
    localStorage.removeItem('nvcr_tk');
  }

  static getUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  static setUser(user) {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      this.clearUser();
    }
  }

  static clearUser() {
    localStorage.removeItem('userData');
  }

  static clearAll() {
    this.clearToken();
    this.clearUser();
  }
}

export default StorageService;