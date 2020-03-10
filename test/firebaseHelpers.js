import { apps, initializeTestApp, loadFirestoreRules } from '@firebase/testing';
import fs from 'fs';

export const setupTestFirestore = async (auth, data) => {
  console.log('here', 0);
  const projectId = `test-${Date.now()}`;
  console.log('here', 1);

  const app = await initializeTestApp({
    projectId,
    auth
  });

  console.log('here', 2);

  // Get the db linked to the new firebase app that we creted
  const db = app.firestore();
  console.log('here', 3);

  // Apply permissive test rules to write dummy data
  await loadFirestoreRules({
    projectId,
    rules: fs.readFileSync('test/firestoreTestSetup.rules', 'utf8')
  });

  // Write test documents
  if (data) {
    for (const key in data) {
      console.log(key);
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply the real security rules
  await loadFirestoreRules({
    projectId,
    rules: fs.readFileSync('firestore.rules', 'utf8')
  });

  return db;
};

export const teardownTestFirestore = async () => {
  Promise.all(apps().map(app => app.delete()));
};
