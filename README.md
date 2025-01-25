# Rappt

[My Notes](notes.md)

A website to help medical professionals schedule appointments more intelligently, allowing emergency appointments to be accommodated by giving consideration to symptoms and urgency when scheduling appointments, instead of simply using a first-come-first-serve scheduling system and cancellation list.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Have you ever tried to schedule an urgent doctor's appointment, only to be met with a months long wait because nothing was available sooner? Are you a medical professional looking for a better way to triage patients before they come to the office? Rappt is the tool for you! With Rappt, patients can easily schedule appointments from the web, and our systems will use a custom algorithm to give them a scheduling window that is consistent with the urgency of their symptoms. Medical staff can see the schedule update in real time and make adjustments if necessary.

### Design

![Design image](design.jpg)

This sequence diagram shows sample interactions between patients, staff, and the website, and the associated WebSocket service providing notifications.

```mermaid
sequenceDiagram
    actor Patient
    actor Staff
    Patient->>Website: Schedule/edit appointment
    Website -->>Staff: Notification
    Staff->>Website: Edit appointment
    Website -->>Patient: Notification
```

### Key features

- Single, secure HTTPS login for patients and healthcare workers.
- Ability for patients and healthcare workers to view relevant appointments and form information.
- Appointment scheduling based on weighted factors, giving users an appropriate window for appointments.
- Suggested diagnosis from public API (PubMedGPT) based on provided symptoms.
- Notifications for patients and healthcare professionals when appointment changes are made.

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Webpages for login, submitting information (patients), scheduling an appointment (patients), and viewing/editing the schedule (patients and healthcare workers).
- **CSS** - Create a good looking website with modern design, animations, and responsive design that doesn't look as dreary as most medical websites.
- **React** - Login and form submission for appointments. Calculating severity based on weighted factors/information.
- **Service** - Save and fetch available appointments from database. Query PudMedGPT for severity analysis and possible diagnosis.
- **DB/Login** - Store and create entries for appointments and login information. Store sensetive medical information securely and authenticate to limit content access.
- **WebSocket** - Realtime notifications for changes in appointments from the patient or healthcare professional.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://rappt.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [x] **3rd party API placeholder** - I added 'inferred diagnosis' and 'severity' to the appointments, which will come from a call to PubMedGPT.
- [ ] **Images** - I did not complete this part of the deliverable.
- [x] **Login placeholder** - The index.html is the login page, and users cannot access their data without logging in.
- [x] **DB data placeholder** - The tables on the appointment page represent data pulled from the databse.
- [ ] **WebSocket placeholder** - The notification icon in the header and notifications div are a placeholder for WebSocket notifications.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
