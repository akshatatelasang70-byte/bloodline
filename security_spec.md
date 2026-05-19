# Security Specification for Blood Donation Management System

## 1. Data Invariants
- A user can only access and modify their own `users` and `donors` profile documents.
- A `donor` application must be approved by an `admin` (or can be self-managed if allowed, but for this system, admins manage donors).
- `blood_requests` can be created by any authenticated user (Hospital or Patient).
- Only `admins` can update the overall `inventory`.
- `blood_requests` can only be fulfilled/cancelled by the requester or an admin.

## 2. Dirty Dozen Payloads (Potential Attacks)
1. User A tries to read User B's PII in `/users/UserB`.
2. User A tries to update User B's role to 'admin' in `/users/UserB`.
3. An unauthenticated user tries to search donors.
4. User A tries to create a donor profile for User B.
5. User A tries to delete a blood request created by User B.
6. User A tries to increment blood inventory units manually.
7. User A tries to bypass `isApproved` status for their own donor profile.
8. Injecting a 2MB string as `city` in a blood request.
9. Setting `createdAt` of a request to a date in the future.
10. Creating a request for a blood group like "X+".
11. Updating a request status from 'Fulfilled' back to 'Pending'.
12. User A tries to list ALL users PII.

## 3. Rules Implementation Plan
We will use standard RBAC based on the `/users/{uid}` document.
`isAdmin()` will check if `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'`.
