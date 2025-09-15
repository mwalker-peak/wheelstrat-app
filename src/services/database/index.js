import { FirebaseProvider } from './FirebaseProvider'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// 🎯 DATABASE ABSTRACTION - Easy to switch!
class DatabaseService {
  constructor() {
    this.provider = null
    this.initialize()
  }

  initialize() {
    const dbType = import.meta.env.VITE_DATABASE_TYPE || 'firebase'
    
    switch (dbType) {
      case 'firebase':
        this.provider = new FirebaseProvider(firebaseConfig)
        break
      case 'supabase':
        // this.provider = new SupabaseProvider(supabaseConfig)
        console.log('🚧 Supabase provider not implemented yet')
        break
      case 'postgresql':
        // this.provider = new PostgreSQLProvider(pgConfig)
        console.log('🚧 PostgreSQL provider not implemented yet')
        break
      default:
        throw new Error(`Unsupported database type: ${dbType}`)
    }

    console.log(`✅ Database service initialized with ${dbType} provider`)
  }

  // 🔄 Switch database provider at runtime
  switchProvider(providerType, config) {
    switch (providerType) {
      case 'firebase':
        this.provider = new FirebaseProvider(config)
        break
      // Add other providers as needed
      default:
        throw new Error(`Unsupported provider: ${providerType}`)
    }
    
    console.log(`🔄 Switched to ${providerType} provider`)
  }

  // Proxy all methods to the current provider
  async signUp(email, password, userData) {
    return this.provider.signUp(email, password, userData)
  }

  async signIn(email, password) {
    return this.provider.signIn(email, password)
  }

  async signInWithGoogle() {
    return this.provider.signInWithGoogle()
  }

  async signOut() {
    return this.provider.signOut()
  }

  async getCurrentUser() {
    return this.provider.getCurrentUser()
  }

  async sendPasswordResetEmail(email) {
    return this.provider.sendPasswordResetEmail(email)
  }

  onAuthStateChanged(callback) {
    return this.provider.onAuthStateChanged(callback)
  }

  async createUserProfile(userId, profileData) {
    return this.provider.createUserProfile(userId, profileData)
  }

  async getUserProfile(userId) {
    return this.provider.getUserProfile(userId)
  }

  async updateUserProfile(userId, profileData) {
    return this.provider.updateUserProfile(userId, profileData)
  }

  async createPosition(userId, positionData) {
    return this.provider.createPosition(userId, positionData)
  }

  async getUserPositions(userId) {
    return this.provider.getUserPositions(userId)
  }

  async updatePosition(userId, positionId, positionData) {
    return this.provider.updatePosition(userId, positionId, positionData)
  }

  async deletePosition(userId, positionId) {
    return this.provider.deletePosition(userId, positionId)
  }

  async createAlert(userId, alertData) {
    return this.provider.createAlert(userId, alertData)
  }

  async getUserAlerts(userId) {
    return this.provider.getUserAlerts(userId)
  }

  async markAlertAsRead(userId, alertId) {
    return this.provider.markAlertAsRead(userId, alertId)
  }

  async deleteAlert(userId, alertId) {
    return this.provider.deleteAlert(userId, alertId)
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
export default databaseService