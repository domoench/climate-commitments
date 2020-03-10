import { setupTestFirestore, teardownTestFirestore } from './firebaseHelpers';

describe('Firestore security rules', () => {
  afterEach(async () => {
    await teardownTestFirestore();
  });

  test('', async () => {
    const db = await setupTestFirestore();
    expect(true).toBe(false);
  });
});
