/**
 * Determines the predominant role from an array or string of roles.
 * Priority: rider > installment > passenger
 * 
 * @param {string|string[]} roles - The role(s) to check
 * @returns {string} - The predominant role
 */
export const getPredominantRole = (roles) => {
    if (!roles) return 'passenger';

    const roleArray = Array.isArray(roles) ? roles : [roles];

    if (roleArray.includes('rider')) {
        return 'rider';
    }

    if (roleArray.includes('installment')) {
        return 'installment';
    }

    return 'passenger';
};
