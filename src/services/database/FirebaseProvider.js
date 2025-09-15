import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { DatabaseInterface } from './DatabaseInterface'

export class FirebaseProvider extends DatabaseInterface {
  constructor(config) {
    super()
    console.log('🔥 Initializing Firebase...')
    
    this.app = initializeApp(config)
    this.auth = getAuth(this.app)
    this.db = getFirestore(this.app)
    this.googleProvider = new GoogleAuthProvider()
    
    console.log('✅ Firebase initialized successfully')
  }

  // 🎯 NEW: Helper method to serialize Firebase data for Redux
  serializeFirebaseData(data) {
    if (!data) return data
    
    const serialized = { ...data }
    
    // Convert Firebase Timestamps to ISO strings
    Object.keys(serialized).forEach(key => {
      const value = serialized[key]
      
      // Handle Firebase Timestamp objects
      if (value && typeof value === 'object' && value.seconds !== undefined) {
        serialized[key] = new Date(value.seconds * 1000).toISOString()
      }
      
      // Handle nested objects (like profile data)
      if (value && typeof value === 'object' && value.seconds === undefined) {
        serialized[key] = this.serializeFirebaseData(value)
      }
    })
    
    return serialized
  }

  // Authentication Methods
  async signUp(email, password, userData = {}) {
    try {
      console.log('🔐 Creating user account for:', email)
      
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      const user = userCredential.user
      
      // Update display name if provided
      if (userData.displayName) {
        await updateProfile(user, { displayName: userData.displayName })
      }
      
      // Create initial user profile in database
      await this.createUserProfile(user.uid, {
        email: user.email,
        displayName: userData.displayName || '',
        createdAt: serverTimestamp(),
        profile: {
          investmentCapital: 20000,
          riskTolerance: 'low',
          favoriteMarketSectors: [],
          setupCompleted: false
        }
      })
      
      console.log('✅ User account created successfully')
      return this.formatUser(user)
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw this.formatError(error)
    }
  }

  async signIn(email, password) {
    try {
      console.log('🔐 Signing in user:', email)
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      const user = userCredential.user
      
      console.log('✅ User signed in successfully')
      return this.formatUser(user)
    } catch (error) {
      console.error('❌ Error signing in:', error)
      throw this.formatError(error)
    }
  }

  async signInWithGoogle() {
    try {
      console.log('🔐 Signing in with Google...')
      
      const result = await signInWithPopup(this.auth, this.googleProvider)
      const user = result.user
      
      // Check if this is a new user
      const userProfile = await this.getUserProfile(user.uid)
      if (!userProfile) {
        // Create profile for new Google user
        await this.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || '',
          createdAt: serverTimestamp(),
          profile: {
            investmentCapital: 20000,
            riskTolerance: 'low',
            favoriteMarketSectors: [],
            setupCompleted: false
          }
        })
      }
      
      console.log('✅ Google sign in successful')
      return this.formatUser(user)
    } catch (error) {
      console.error('❌ Error with Google sign in:', error)
      throw this.formatError(error)
    }
  }

  async signOut() {
    try {
      console.log('🔐 Signing out user...')
      await signOut(this.auth)
      console.log('✅ User signed out successfully')
    } catch (error) {
      console.error('❌ Error signing out:', error)
      throw this.formatError(error)
    }
  }

  async getCurrentUser() {
    return this.auth.currentUser ? this.formatUser(this.auth.currentUser) : null
  }

  async sendPasswordResetEmail(email) {
    try {
      console.log('📧 Sending password reset email to:', email)
      await sendPasswordResetEmail(this.auth, email)
      console.log('✅ Password reset email sent')
    } catch (error) {
      console.error('❌ Error sending password reset email:', error)
      throw this.formatError(error)
    }
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, (user) => {
      callback(user ? this.formatUser(user) : null)
    })
  }

  // User Profile Methods
  async createUserProfile(userId, profileData) {
    try {
      console.log('📝 Creating user profile for:', userId)
      
      const userRef = doc(this.db, 'users', userId)
      await setDoc(userRef, profileData)
      
      console.log('✅ User profile created')
      return this.serializeFirebaseData(profileData)
    } catch (error) {
      console.error('❌ Error creating user profile:', error)
      throw this.formatError(error)
    }
  }

  async getUserProfile(userId) {
    try {
      console.log('👤 Getting user profile for:', userId)
      
      const userRef = doc(this.db, 'users', userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log('✅ User profile retrieved')
        
        // 🎯 SERIALIZE FIREBASE DATA FOR REDUX
        return this.serializeFirebaseData(data)
      } else {
        console.log('❌ No user profile found')
        return null
      }
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      throw this.formatError(error)
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      console.log('📝 Updating user profile for:', userId)
      
      const userRef = doc(this.db, 'users', userId)
      
      // Add update timestamp
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(userRef, updateData)
      
      console.log('✅ User profile updated')
      
      // 🎯 SERIALIZE FIREBASE DATA FOR REDUX
      return this.serializeFirebaseData(updateData)
    } catch (error) {
      console.error('❌ Error updating user profile:', error)
      throw this.formatError(error)
    }
  }

  // Positions Methods
  async createPosition(userId, positionData) {
    try {
      console.log('📊 Creating position for user:', userId)
      
      const positionsRef = collection(this.db, 'positions', userId, 'positions')
      const docRef = await addDoc(positionsRef, {
        ...positionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      console.log('✅ Position created with ID:', docRef.id)
      
      // 🎯 RETURN SERIALIZED DATA
      return this.serializeFirebaseData({ 
        id: docRef.id, 
        ...positionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error creating position:', error)
      throw this.formatError(error)
    }
  }

  async getUserPositions(userId) {
    try {
      console.log('📊 Getting positions for user:', userId)
      
      const positionsRef = collection(this.db, 'positions', userId, 'positions')
      const q = query(positionsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const positions = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        // 🎯 SERIALIZE EACH POSITION
        positions.push(this.serializeFirebaseData({
          id: doc.id,
          ...data
        }))
      })
      
      console.log(`✅ Retrieved ${positions.length} positions`)
      return positions
    } catch (error) {
      console.error('❌ Error getting user positions:', error)
      throw this.formatError(error)
    }
  }

  async updatePosition(userId, positionId, positionData) {
    try {
      console.log('📊 Updating position:', positionId)
      
      const positionRef = doc(this.db, 'positions', userId, 'positions', positionId)
      const updateData = {
        ...positionData,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(positionRef, updateData)
      
      console.log('✅ Position updated')
      
      // 🎯 RETURN SERIALIZED DATA
      return this.serializeFirebaseData(updateData)
    } catch (error) {
      console.error('❌ Error updating position:', error)
      throw this.formatError(error)
    }
  }

  async deletePosition(userId, positionId) {
    try {
      console.log('📊 Deleting position:', positionId)
      
      const positionRef = doc(this.db, 'positions', userId, 'positions', positionId)
      await deleteDoc(positionRef)
      
      console.log('✅ Position deleted')
    } catch (error) {
      console.error('❌ Error deleting position:', error)
      throw this.formatError(error)
    }
  }

  // Alerts Methods
  async createAlert(userId, alertData) {
    try {
      console.log('🔔 Creating alert for user:', userId)
      
      const alertsRef = collection(this.db, 'alerts', userId, 'alerts')
      const docRef = await addDoc(alertsRef, {
        ...alertData,
        isRead: false,
        createdAt: serverTimestamp()
      })
      
      console.log('✅ Alert created with ID:', docRef.id)
      
      // 🎯 RETURN SERIALIZED DATA
      return this.serializeFirebaseData({
        id: docRef.id, 
        ...alertData,
        isRead: false,
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error creating alert:', error)
      throw this.formatError(error)
    }
  }

  async getUserAlerts(userId) {
    try {
      console.log('🔔 Getting alerts for user:', userId)
      
      const alertsRef = collection(this.db, 'alerts', userId, 'alerts')
      const q = query(alertsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const alerts = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        // 🎯 SERIALIZE EACH ALERT
        alerts.push(this.serializeFirebaseData({
          id: doc.id,
          ...data
        }))
      })
      
      console.log(`✅ Retrieved ${alerts.length} alerts`)
      return alerts
    } catch (error) {
      console.error('❌ Error getting user alerts:', error)
      throw this.formatError(error)
    }
  }

  async markAlertAsRead(userId, alertId) {
    try {
      console.log('🔔 Marking alert as read:', alertId)
      
      const alertRef = doc(this.db, 'alerts', userId, 'alerts', alertId)
      await updateDoc(alertRef, { 
        isRead: true,
        updatedAt: serverTimestamp()
      })
      
      console.log('✅ Alert marked as read')
    } catch (error) {
      console.error('❌ Error marking alert as read:', error)
      throw this.formatError(error)
    }
  }

  async deleteAlert(userId, alertId) {
    try {
      console.log('🔔 Deleting alert:', alertId)
      
      const alertRef = doc(this.db, 'alerts', userId, 'alerts', alertId)
      await deleteDoc(alertRef)
      
      console.log('✅ Alert deleted')
    } catch (error) {
      console.error('❌ Error deleting alert:', error)
      throw this.formatError(error)
    }
  }

  // Helper Methods
  formatUser(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
  }

  formatError(error) {
    // Convert Firebase errors to generic error format
    const errorMap = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    }

    return {
      code: error.code,
      message: errorMap[error.code] || error.message
    }
  }
}