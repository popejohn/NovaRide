// StorageService abstraction to invert dependency on localStorage
// High-level modules depend on this interface, not localStorage directly
// Only the JWT token is persisted — user data lives exclusively in Redux memory.

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

  static clearAll() {
    this.clearToken();
  }
}

export default StorageService;



