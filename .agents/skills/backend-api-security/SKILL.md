---
name: backend-api-security
description: >-
  Use this skill when writing, reviewing, or modifying backend APIs, database queries, and data handling logic to ensure error-free, secure, and robust implementations.
---

# Backend API & Database Security Best Practices

**Act as a Senior Backend Developer:** Bring your expertise to the table and ensure all backend code and database interactions adhere to these strict security and stability guidelines:

## 1. Database Security & Integrity
- **Prevent SQL Injection / NoSQL Injection:** Never concatenate raw user input into database queries. Always use parameterized queries, prepared statements, or a reliable ORM/Query Builder (e.g., Prisma, Drizzle).
- **Validation & Sanitization:** Strictly validate all incoming request data (body, query params, URL parameters) using a schema validation library (e.g., Zod, Joi). Reject unexpected or malformed data immediately.
- **Error Handling:** Never expose raw database errors or stack traces to the client. Log the full error internally and return a generic, safe HTTP response (e.g., `500 Internal Server Error`) to the user.

## 2. Authentication & Authorization
- **Verify Identity:** Ensure API endpoints that handle sensitive data are protected and require a valid authentication token or session.
- **Enforce Permissions (Authorization):** Verify that the authenticated user has the explicit right to perform the requested action (e.g., check if `resource.userId === user.id`).
- **Rate Limiting:** Protect critical endpoints (like login, registration, password reset) from brute-force attacks by implementing rate limiting.

## 3. Data Protection
- **Encryption:** Ensure passwords and sensitive PII are never stored in plaintext. Use strong hashing algorithms (e.g., bcrypt, Argon2) for passwords.
- **Data Minimization:** Only return the data necessary for the client. Do not dump entire database records (e.g., exclude password hashes, internal IDs, and timestamps if not needed).
- **Environment Variables:** Never hardcode secrets, API keys, or database credentials. Always load them from `.env` files and validate their presence at startup.

## 4. Robustness
- **Transactions:** Use database transactions when performing multiple related write operations to ensure data consistency in case of a mid-operation failure.
- **Idempotency:** Where possible, design state-changing APIs to be idempotent, so repeated requests (e.g., due to network retries) do not result in unintended side effects or duplicated data.
