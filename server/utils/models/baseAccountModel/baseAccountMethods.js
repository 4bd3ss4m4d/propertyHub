import bcrypt from 'bcrypt';
import crypto from 'crypto';

 // Compare password for login
export async function comparePassword(candidatePassword) {
    try {
        // Need to select password since it's not included by default
        const user = await this.constructor.findById(this._id).select('+password');
        return await bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}

// Update last login timestamp
export async function updateLastLogin() {
    this.security.lastLogin = new Date();
    await this.save();
}

// Increment failed login attempts and lock account if necessary
export async function incrementFailedLogins() {
    const MAX_ATTEMPTS = 5;
    const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
    
    this.security.failedLoginAttempts = (this.security.failedLoginAttempts || 0) + 1;
    if (this.security.failedLoginAttempts >= MAX_ATTEMPTS) {
      this.security.lockUntil = new Date(Date.now() + LOCK_TIME);
    }
    await this.save();
}

// Reset failed login attempts and lock status
export async function resetFailedLogins() {
    this.security.failedLoginAttempts = 0;
    this.security.lockUntil = null;
    await this.save();
}

// Check if account is locked
export function isLocked() {
    return this.security.lockUntil && this.security.lockUntil > Date.now();
}

// Generate email verification token
export async function generateEmailVerificationToken() {
    const token = crypto.randomBytes(32).toString('hex');
    this.security.emailVerificationToken = token;
    await this.save();
    return token;
}

// Verify email 
export async function verifyEmail(token) {
    if (this.security.emailVerificationToken !== token) {
        throw new Error('Invalid verification token');
    }
    this.security.isEmailVerified = true;
    this.security.emailVerificationToken = undefined;
    await this.save();
    return this;
}

// Add login history to account
export async function addLoginHistory(loginData) {
    // Define the max length for the loginHistory array (e.g., last 10 entries)
    const MAX_HISTORY_LENGTH = 10;

    // Append the new login data to the beginning of the array
    this.loginHistory.unshift(loginData);

    // Ensure loginHistory length does not exceed MAX_HISTORY_LENGTH
    if (this.loginHistory.length > MAX_HISTORY_LENGTH) {
        this.loginHistory = this.loginHistory.slice(0, MAX_HISTORY_LENGTH);
    }

    // Save the document after updating the login history
    await this.save();
}
