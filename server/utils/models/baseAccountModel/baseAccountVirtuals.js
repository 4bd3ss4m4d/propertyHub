// Get the user's full name by combining firstName and lastName
export const fullName = {
    get: function () {
      return `${this.profile.firstName} ${this.profile.lastName}`;
    }
};
  
// Check if the account is currently locked
export const lockedStatus = {
    get: function () {
      return Boolean(this.lockUntil && this.lockUntil > Date.now());
    }
};
