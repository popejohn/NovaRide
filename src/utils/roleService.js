// Role service to centralize role determination logic
// Single source of truth for role calculations
class RoleService {
  static ROLES = {
    ADMIN: 'admin',
    RIDER: 'rider',
    PASSENGER: 'passenger',
    INSTALLMENT: 'installment'
  };

  static PRIORITY = {
    [this.ROLES.ADMIN]: 4,
    [this.ROLES.RIDER]: 3,
    [this.ROLES.INSTALLMENT]: 2,
    [this.ROLES.PASSENGER]: 1
  };

  static getPredominantRole(roles) {
    const sortedRoles = this.getRoles(roles)
      .filter(role => this.PRIORITY[role])
      .map(role => ({ role, priority: this.PRIORITY[role] || 0 }))
      .sort((a, b) => b.priority - a.priority);

    return sortedRoles[0]?.role || this.ROLES.PASSENGER;
  }

  static getRoles(roles) {
    return (Array.isArray(roles) ? roles : [roles])
      .filter(Boolean)
      .map(role => role === 'partner' ? this.ROLES.INSTALLMENT : role);
  }

  static hasRole(roles, role) {
    return this.getRoles(roles).includes(role);
  }

  static getDashboardPath(roles) {
    const predominantRole = this.getPredominantRole(this.getRoles(roles));

    if (predominantRole === this.ROLES.RIDER) return '/riderdashboard';
    if (predominantRole === this.ROLES.INSTALLMENT) return '/installment-dashboard';
    return '/bookride';
  }

  static isProfileCompleted(user, role) {
    if (role === this.ROLES.RIDER) {
      return typeof user?.riderProfileCompleted === 'boolean'
        ? user.riderProfileCompleted
        : Boolean(user?.profileCompleted);
    }
    if (role === this.ROLES.INSTALLMENT) {
      return typeof user?.installmentProfileCompleted === 'boolean'
        ? user.installmentProfileCompleted
        : Boolean(user?.profileCompleted);
    }
    return true;
  }

  static getLoginDestination(user) {
    const role = this.getPredominantRole(user?.role);

    if (role === this.ROLES.RIDER) {
      return this.isProfileCompleted(user, role) ? '/riderdashboard' : '/rider-profile-setup';
    }

    if (role === this.ROLES.INSTALLMENT) {
      return this.isProfileCompleted(user, role) ? '/installment-dashboard' : '/installment-profile-setup';
    }

    return '/bookride';
  }

  static canAcceptRides(roles) {
    return this.hasRole(roles, this.ROLES.RIDER);
  }

  static canBookRides() {
    return true;
  }

  static hasPermission(role, action) {
    const permissions = {
      [this.ROLES.ADMIN]: ['all'],
      [this.ROLES.RIDER]: ['accept_rides', 'view_dashboard'],
      [this.ROLES.PASSENGER]: ['book_rides', 'view_history'],
      [this.ROLES.INSTALLMENT]: ['book_rides', 'view_installments']
    };

    return permissions[role]?.includes(action) || permissions[role]?.includes('all') || false;
  }
}

export default RoleService;



