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
    [this.ROLES.PASSENGER]: 2,
    [this.ROLES.INSTALLMENT]: 1
  };

  static getPredominantRole(roles) {
    if (!roles || !Array.isArray(roles)) return this.ROLES.PASSENGER;

    const sortedRoles = roles
      .map(role => ({ role, priority: this.PRIORITY[role] || 0 }))
      .sort((a, b) => b.priority - a.priority);

    return sortedRoles[0]?.role || this.ROLES.PASSENGER;
  }

  static canAcceptRides(role) {
    return role === this.ROLES.RIDER;
  }

  static canBookRides(role) {
    return [this.ROLES.PASSENGER, this.ROLES.INSTALLMENT].includes(role);
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



