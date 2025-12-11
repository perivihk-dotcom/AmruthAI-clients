# AmruthAI Business Leads CRM

## Original Problem Statement
Build a business leads tracking CRM application for AmruthAI with:
- Tabular view with columns: S.No, Business Name, Website (yes/no), Mobile Number, Status
- Status options: Interest, Not Interest, Will Call Back, 1st/2nd/3rd Call No Respond, Switchoff
- Black and Yellow theme matching AmruthAI branding
- MongoDB integration

## Architecture & Implementation

### Backend (FastAPI)
- **Server**: `/app/backend/server.py`
- **Database**: MongoDB Atlas (user-provided connection string)
- **Endpoints**:
  - `GET /api/leads` - Fetch all leads
  - `GET /api/leads/stats` - Dashboard statistics
  - `POST /api/leads` - Create new lead
  - `PUT /api/leads/{id}` - Update lead
  - `DELETE /api/leads/{id}` - Delete lead

### Frontend (React)
- **Main App**: `/app/frontend/src/App.js`
- **Styling**: `/app/frontend/src/index.css`, `/app/frontend/src/App.css`
- **Components**: Shadcn UI (Table, Dialog, Select, Switch, Button, Input)

### Features Implemented
- [x] Dashboard with 6 stat cards (Total, Interested, Not Interested, Callbacks, No Response, Switched Off)
- [x] Leads table with all required columns
- [x] Add Lead dialog with form validation
- [x] Edit Lead dialog
- [x] Delete confirmation dialog
- [x] Inline status change via dropdown in table
- [x] Inline website toggle via switch in table
- [x] Search by business name or mobile number
- [x] Filter by status
- [x] Toast notifications for all actions
- [x] Responsive design
- [x] Black and Yellow industrial theme

## Next Action Items
1. **Export to CSV**: Add ability to export leads data to CSV file
2. **Bulk Actions**: Select multiple leads and change status or delete in bulk
3. **Call History Tracking**: Log status changes with timestamps
4. **Pagination**: Add pagination for large datasets
5. **Notes Field**: Add notes/comments field for each lead
6. **Mobile App**: Consider PWA for field sales team

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn UI, Lucide Icons
- Backend: FastAPI, Motor (async MongoDB), Pydantic
- Database: MongoDB Atlas
- Fonts: Chivo (headings), Manrope (body), JetBrains Mono (numbers)
