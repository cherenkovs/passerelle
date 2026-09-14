/**
 * Firebase, loaded only when it is actually needed.
 *
 * The SDK is around 200 KB — comparable to the rest of the app — so it stays
 * out of the main bundle and is fetched when the app starts talking to the
 * account. Whether there is a session to resume is a question for Firebase
 * Auth, which knows: the app keeps no flag of its own to answer it.
 *
 * The config values are identifiers, not secrets. They are meant to ship in
 * client code and are safe in a public repository — access is controlled by the
 * Firestore rules in firestore.rules, which let an account touch its own
 * document and nothing else.
 */

const config = {
  apiKey: 'AIzaSyA-2SUS1k-sBQTJFJSbDr8n8dRP_jBnhiM',
  authDomain: 'passerelle-ua-fr.firebaseapp.com',
  projectId: 'passerelle-ua-fr',
  storageBucket: 'passerelle-ua-fr.firebasestorage.app',
  messagingSenderId: '1083270330492',
  appId: '1:1083270330492:web:06cf2179973b6913c3f1f9',
}

// Deliberately no getAnalytics(). The app tells the learner it does not track
// them, and that has to stay true.

export type FirebaseBits = Awaited<ReturnType<typeof loadFirebase>>

let pending: ReturnType<typeof init> | null = null

async function init() {
  const [{ initializeApp }, auth, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ])
  const app = initializeApp(config)

  // Firestore keeps its own cache and queues writes made offline. With the
  // profile no longer mirrored into localStorage, this is what lets a lesson
  // on a train finish and reach the account when the signal comes back.
  // Multi-tab so two open tabs share one cache instead of fighting over it.
  const db = firestore.initializeFirestore(app, {
    localCache: firestore.persistentLocalCache({
      tabManager: firestore.persistentMultipleTabManager(),
    }),
  })

  return { app, auth, firestore, authInstance: auth.getAuth(app), db }
}

export function loadFirebase() {
  pending ??= init()
  return pending
}
