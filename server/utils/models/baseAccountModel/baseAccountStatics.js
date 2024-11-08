// Find an account by email, limited to active accounts
export async function findByEmail(email) {
    return this.findOne({ email, accountStatus: 'active' });
}

// Find an account by username, limited to active accounts
export async function findByUsername(username) {
    return this.findOne({ username, accountStatus: 'active' });
}

// Find an account by ID, but only if the account is active
export async function findByIdActiveOnly(id) {
    return this.findOne({ _id: id, accountStatus: 'active' });
}

// Find an account by either email or username
export async function findByEmailOrUsername(identifier) {
    return this.findOne({
        $or: [{ email: identifier }, { username: identifier }],
        accountStatus: 'active'
    });
}

export async function searchUser(query) {
    return this.find({
        accountStatus: 'active',
        $or: [
          { 'profile.firstName': new RegExp(query, 'i') },
          { 'profile.lastName': new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') }
        ]
    });
}

export async function lockUserById(id) {
    return this.findByIdAndUpdate(id, { accountStatus: 'suspended' }, { new: true });
  }

// Soft delete an account based on the query
export async function softDelete(query) {
    const doc = await this.findOne(query);
    if (!doc) {
        throw new Error('Document not found');
    }

    doc.accountStatus = 'deactivated';
    doc.deletedAt = new Date();
    await doc.save();
    return doc;
}
