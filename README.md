# Daniel's Solar Employee Application Backend

## Setup

1. **Configure Gmail (.env):**
```
NODEMAILER_EMAIL=tayyebmalikrehan314@gmail.com
NODEMAILER_PASS=your_16_char_app_password
PORT=3000
```
Generate App Password: Google Account > Security > App passwords

2. **Install:**
```
npm install
```

3. **Start server:**
```
npm start
```
Server: http://localhost:3000

4. **Test form:** Open `NEW EMPLOYEE APPLICATION FORM.html`

## Files
- `server.js` - Express + Nodemailer API
- `NEW EMPLOYEE APPLICATION FORM.html` - Form → POST /api/submit
- Frontend validation + rich HTML emails
