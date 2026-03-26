# AGENT.md — Topography — Full System Design

## 🎯 Project Goal

Build a full-stack web application for a **topography business** where clients can:

- Draw land on a map
- (Optionally) calculate area
- Submit a request with personal + land information
- Upload files (PDFs, images)
- Track their requests

The system must include:

- Public website
- AI chatbot (domain-restricted)
- Client dashboard
- Admin dashboard
- Request quota system

⚠️ Constraints:

- Budget: **0$**
- Must use **open-source / free tiers only**

---

## 🧱 Tech Stack

### Frontend

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Shadcn UI (optional)

### Backend

- Supabase
  - Postgres DB
  - Auth
  - Storage
  - Edge Functions (if needed)

### Maps (100% free)

- Leaflet
- Leaflet.draw
- OpenStreetMap tiles
- Turf.js (area calculation)

### AI Chatbot

- OpenAI-compatible API OR local fallback
- Must be **context-restricted to business domain**

---

## 🧩 Core Features

### 1. Public Website

Pages:

- Home
- Services (topography services)
- About
- Contact
- Request Page (main feature)

---

### 2. Request Flow (MAIN FEATURE)

User can:

1. Open map
2. Draw polygon (land)
3. (Optional) calculate area
4. Fill form:
   - Name
   - Phone
   - Email
   - City
   - Notes

5. Upload files:
   - PDF
   - Images

6. Submit request

System:

- Save polygon as **GeoJSON**
- Calculate area using Turf.js
- Store files in Supabase Storage
- Create request record in DB

---

### 3. Client Dashboard

Client can:

- View submitted requests
- See status:
  - pending
  - approved
  - rejected
  - completed

- View uploaded files
- View map drawing
- Track quota usage

---

### 4. Admin Dashboard

Admin can:

- View all requests
- Filter by status
- Open request:
  - see map polygon
  - see client info
  - see files

- Update status
- Delete requests
- Manage users
- Manage quotas

---

### 5. Request Quota System

Each user has:

- monthly_request_limit
- used_requests

Logic:

- On submit → check quota
- If exceeded → block request
- Reset monthly (cron or edge function)

---

### 6. AI Chatbot (STRICT MODE)

Chatbot MUST:

- Only answer about:
  - services
  - pricing (if defined)
  - how to submit request
  - company info

Chatbot MUST NOT:

- Answer unrelated questions (e.g. recipes, coding help, etc.)

Implementation:

- System prompt restriction
- Keyword filtering OR embedding-based retrieval (optional)

---

## 🗄️ Database Schema (Supabase)

### users (handled by Supabase Auth)

### profiles

- id (uuid, FK to auth.users)
- name
- role (client | admin)
- monthly_quota
- used_quota

---

### requests

- id
- user_id
- status (pending | approved | rejected | completed)
- geojson (jsonb)
- area (float)
- notes
- created_at

---

### request_files

- id
- request_id
- file_url
- file_type

---

## 🧠 AI Behavior Rules

### General Rules

- Prefer simple, clean solutions
- Avoid overengineering
- Use server components where possible
- Use client components only when needed (map, interactivity)

---

### Map Rules

- Always use Leaflet (not Mapbox)
- Store polygons as GeoJSON
- Use Turf.js for calculations
- Do NOT rely on Leaflet-only area

---

### Security Rules

- All writes must go through authenticated user
- Row Level Security (RLS) enforced:
  - Users can only see their data
  - Admin can see all

---

### File Upload Rules

- Validate file type
- Max size limit
- Store in Supabase Storage
- Save public URL in DB

---

### Chatbot Guardrails

If question is NOT related:
→ Respond:
"I'm here to help with our topography services. Please ask about land measurement, requests, or our services."

---

### MCP Tools — Supabase

The AI agent has access to **Supabase MCP** and MUST use it for all database operations:

**Database Operations:**

- `supabase_list_tables` — Inspect schema and table structure
- `supabase_execute_sql` — Run SQL queries directly
- `supabase_apply_migration` — Apply DDL migrations
- `supabase_list_migrations` — View existing migrations
- `supabase_list_extensions` — Check installed extensions

**Diagnostics:**

- `supabase_get_logs` — View logs (api, auth, postgres, storage)
- `supabase_get_advisors` — Check security/performance recommendations

**Edge Functions:**

- `supabase_list_edge_functions` — List deployed functions
- `supabase_deploy_edge_function` — Deploy functions

**Development Workflow:**

- `supabase_create_branch` — Create dev branches
- `supabase_generate_typescript_types` — Generate TS types from schema

**Rules:**

- Always use MCP for Supabase tasks instead of manual SQL files
- Check `supabase_get_advisors` after schema changes
- Generate types after migrations with `supabase_generate_typescript_types`
- Use branches for testing migrations before production

---

## ⚙️ API Design (Supabase-first)

Avoid custom backend unless necessary.

Use:

- Supabase client directly in Next.js
- Server Actions for secure mutations

---

## 🚀 Development Phases

### Phase 1 — MVP

- Auth (Supabase)
- Map drawing
- Request submission
- Basic dashboard

---

### Phase 2

- Admin dashboard
- File uploads
- Quota system

---

### Phase 3

- AI chatbot
- UX improvements
- Notifications (optional)

---

## 🧪 Testing Strategy

- Test drawing + GeoJSON correctness
- Test quota enforcement
- Test RLS policies
- Test file uploads

---

## 🧠 Future Improvements (NOT NOW)

- Payment integration
- Advanced GIS features
- Multi-language (FR / AR)
- Export to PDF
- Satellite imagery

---

## ❌ What NOT to Use

- Mapbox (cost)
- Google Maps API (cost)
- Complex microservices
- Over-engineered backend

---

## ✅ Success Criteria

- User can draw land and submit request
- Area is accurate
- Admin can manage requests
- System works with 0$

---

END OF SPEC
