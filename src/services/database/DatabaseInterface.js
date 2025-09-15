/** * Database Interface - Abstract class that all database providers must implement
 * This ensures we can easily swap between Firebase, Supabase, PostgreSQL, etc.
 */

export class DatabaseInterface {
  // Authentication Methods
  async signUp(email, password, userData = {}) {
    throw new Error('signUp method must be implemented')
  }

  async signIn(email, password) {
    throw new Error('signIn method must be implemented')
  }

  async signInWithGoogle() {
    throw new Error('signInWithGoogle method must be implemented')
  }

  async signOut() {
    throw new Error('signOut method must be implemented')
  }

  async getCurrentUser() {
    throw new Error('getCurrentUser method must be implemented')
  }

  async sendPasswordResetEmail(email) {
    throw new Error('sendPasswordResetEmail method must be implemented')
  }

  async onAuthStateChanged(callback) {
    throw new Error('onAuthStateChanged method must be implemented')
  }

  // User Profile Methods
  async createUserProfile(userId, profileData) {
    throw new Error('createUserProfile method must be implemented')
  }

  async getUserProfile(userId) {
    throw new Error('getUserProfile method must be implemented')
  }

  async updateUserProfile(userId, profileData) {
    throw new Error('updateUserProfile method must be implemented')
  }

  // Positions Methods
  async createPosition(userId, positionData) {
    throw new Error('createPosition method must be implemented')
  }

  async getUserPositions(userId) {
    throw new Error('getUserPositions method must be implemented')
  }

  async updatePosition(userId, positionId, positionData) {
    throw new Error('updatePosition method must be implemented')
  }

  async deletePosition(userId, positionId) {
    throw new Error('deletePosition method must be implemented')
  }

  // Alerts Methods
  async createAlert(userId, alertData) {
    throw new Error('createAlert method must be implemented')
  }

  async getUserAlerts(userId) {
    throw new Error('getUserAlerts method must be implemented')
  }

  async markAlertAsRead(userId, alertId) {
    throw new Error('markAlertAsRead method must be implemented')
  }

  async deleteAlert(userId, alertId) {
    throw new Error('deleteAlert method must be implemented')
  }
}