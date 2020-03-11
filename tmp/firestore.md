# Questions

## Q: How do security rules work? Can they lock down our data allowing us to have Firestore publicly available?
- The intro to the vid [here](https://firebase.google.com/docs/firestore/security/get-started) claims yes.

## Q: Can firestore rules allow only specific fields within a doc to be accessed?
No. Doc's are all or nothing. Options for protecting PII like email are:
1. Have an aggregated commitment counts doc with no PII that is publically read-accessable. And individual commitment docs
   reads are forbidden.
1. Have sub-collection for PII fields. For example, the commitment doc could have a subcollection field called
   pii that is an object with name, email, etc

## Q: Does firestore have schemas?
- [Firestore is schemaless](https://firebase.google.com/docs/firestore/data-model#collections)
- Hierarchy and [subcollections](https://firebase.google.com/docs/firestore/data-model#subcollections): Collections have documents, which can have references to other collections.0

## Q: 'Expressive querying'. Does that apply to both the SDKs and the REST API?

## Q: Public REST access where only specific queries are allowed, or API gateway?
- [Firestore 'Rules can constrain queries: If a query's results might contain data the user doesn't have access to, the entire query fails.'](https://firebase.google.com/docs/firestore/rtdb-vs-firestore#security)

## Q: If I allow direct access to firestore, is the javascript SDK client library REQUIRED to be authorized?
No, I've tested with the [unauthorized web (javascript) SDK](https://firebase.google.com/docs/reference/js/firebase.firestore)

## Q: Should we store a user's representatives in the DB along with their commitments, or just the zip?

I think just the zip. We only need to look up a user's representives when they first fill out the form
and when we generate their email (maybe not even the latter if we sent the email right as they submit the form).
Since its so infrequent, we can just do the lookup on-demand - no need to store the result (a list of representative
names) in the database.

## Q: What type of queries do we need to support?

**Admin (via firebase console)**

  - [R] Pull all data including PII for email blasts / marketing
  - [R] Pull all emails

**Web app (unauthenticated)**

  - [W] User submitted data: PII and commitments
  - [R] Pull all commitments (no PII, aggregated would be fine)

  - [R] Pull aggregate counts:
    - Counts by commitment
    - Counts by commitment and zip

## Q: What queries won't we support?

**Web app (unauthenticated)**

  - [W] Edit existing commitment
  - [R] Read individual commitment

# Possible Data struct

```
domoench@gmail.com  // Or userID_i7dhg97x
{
  name: 'David Ouyang Moench',
  email: 'domoench@gmail.com',
  zip: '11104',
  timestamp: '2020-03-07T05:26:51Z',
  commitments: {
    call_bank: {
      committed: true,
      metadata: {}
    },
    talk_to_friends: {
      committed: false,
      metadata: {}
    }
    call_elected_rep: {
      committed: true,
      metadata: {
        reps: {
          local: [],
          state: [],
          federal: ['Alexandria Ocasio-Cortez']
        }
      }
    }
  }
}
```

Or perhaps we don't need to store any metadata about commitments. Just booleans:
```
{
  name: 'David Ouyang Moench',
  email: 'domoench@gmail.com',
  zip: '11104',
  timestamp: '2020-03-07T05:26:51Z',
  commitments: {
    call_bank: true,
    talk_to_friends: false,
    call_elected_rep: true,
  }
```

We could maintain a separate aggregate counts document. [Firestore supports atomic incrementing](https://firebase.googleblog.com/2019/03/increment-server-side-cloud-firestore.html)
That document would power the visualization in 1 DB read, and firestore would cache it:

```
{
  callBank: 213,
  talkToFriends: 488,
  callElectedRep: 1001,
}
```

Or by commitment + zip:
```
{
  callBank: {
    total: 213,
    21286: 200,
    11104: 13,
  },
  talkToFriends: {
    total: 488,
    11216: 320,
    21286: 168,
  }
  callElectedRep: {
    total: 1001,
    11104: 500,
    06459: 500,
    21286: 1,
  }
}
```

## Cost vs flexibility of data structure

- Structure: Cheapest (fewest doc reads) is shove everything into a single doc
- Flexible: Root level collections. EG could have a representatives collection

# Testing steps
- `firebase setup:emulators:firestore` [docs](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- upgrade JDK version to deal with `java.lang.UnsupportedClassVersionError: com/google/cloud/datastore/emulator/firestore/CloudFirestore : Unsupported major.minor version 52.0`
- Run the emulator
- Run the jest tests: `yarn test`

Note [3/8] I've been trying to set up a jest + firestore emulator test suite like [this](https://medium.com/flutter-community/firestore-security-rules-and-tests-for-firebase-e195bdbea198)
for a few hours today. It's led me down a long and annoying path of configuring babel, jest, and now the Java SDK. Might give up on this soon
and worry about an automated test suite later. For now its probably better to actually get a prototype working.

Yes let's forget it for now. [The emulator is still in beta mode](https://firebase.google.com/docs/rules/emulator-setup),
so even if we figure out how to get it working it's still not ready to be relied upon.


# Additional Reading
- https://medium.com/firebase-developers/should-i-query-my-firebase-database-directly-or-use-cloud-functions-fbb3cd14118c
- Firebase has [service emulators](https://firebase.google.com/docs/emulator-suite) we could use for local dev and unit test suites.
  - [Article on setting up emulators and test suites](https://medium.com/flutter-community/firestore-security-rules-and-tests-for-firebase-e195bdbea198)
