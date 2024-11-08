import bcrypt from 'bcrypt';

// Utility function to convert string to title case
function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase()).replace(/\B\w/g, char => char.toLowerCase());
}

// Update the preSave hook to normalize fields before saving
export async function preSave(next) {
    // Hash password if modified
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    // Normalize email
    if (this.email) {
        this.email = this.email.trim().toLowerCase();
    }

    // Normalize firstName and lastName in profile
    if (this.profile) {
        if (this.profile.firstName) {
            this.profile.firstName = toTitleCase(this.profile.firstName.trim());
        }
        if (this.profile.lastName) {
            this.profile.lastName = toTitleCase(this.profile.lastName.trim());
        }
    }

    // Remove '+' from phone number if present
    if (this.phoneNumber) {
        this.phoneNumber = this.phoneNumber.replace(/^\+/, '');
    }

    next();
}

// Find user by email or username and return only active accounts
export function preFind(next) {
    if (!this.getQuery().accountStatus) {
        this.where({ accountStatus: 'active' });
    }
    next();
}
