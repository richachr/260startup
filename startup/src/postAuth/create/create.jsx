<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAPPT - Create Appointment</title>
    <link rel="icon" href="RapptLogo.ico">
    <link rel="stylesheet" href="common.css">
    <link rel="stylesheet" href="after_login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="leftContent">
            <a href="index.html" class="logo"><img src="RapptLogo.png" alt="Logo" class="logo"><h2 class="logo">Rappt</h2></a>
        </div>
        <div class="rightContent">
            <nav>
                <button class="secondary"><i class="fa-regular fa-bell"></i>
                    <aside class="notifications">
                        <h5>Notifications</h5>
                        <table>
                            <tr><td><span>Dr. Smithfield</span> <span>scheduled</span> an appointment for <span>James Haskell</span> on <span>February 25th, 2025</span>.</td></tr>
                            <tr><td><span>Dr. Jenkins</span> <span>cancelled</span> an appointment for <span>Emily Haskell</span> on <span>March 14th, 2025</span>.</td></tr>
                        </table>
                    </aside>
                </button>
                <a href='index.html'><button class="danger"><i class="fa-solid fa-arrow-right-from-bracket"></i></button></a>
            </nav>
            <h5 style="text-wrap: none;">James Haskell</h5>
        </div>
    </header>
    <main>
        <div class="mainContent">
            <img src="papers.png" alt="Person doing paperwork">
            <h1>Appointment, you say?</h1>
            <h3>Let's get the forms filled out.</h3>
            <form action="scheduler.html" method="post">
                <div class="formItem">
                    <label for="patientName">What's the full name of the patient?</label>
                    <input type="text" name="patientName" id="patientName" placeholder="John Doe">
                </div>
                <div class="formItem">
                    <label for="dob">What's the patient's date of birth?</label>
                    <input type="date" name="dob" id="dob" placeholder="1/1/1970">
                </div>
                <div class="formItem">
                    <label for="gender">What's the patient's gender?</label>
                    <select name="gender" id="gender">
                        <option></option>
                        <option value="f">Female</option>
                        <option value="m">Male</option>
                    </select>
                </div>
                <div class="formItem">
                    <label for="phone">What's the best phone number for contacting the patient?</label>
                    <input type="tel" name="phone" id="phone" placeholder="(801) 555-2039">
                </div>
                <div class="formItem">
                    <label for="address">What's the patient's address?</label>
                    <input type="text" name="address" id="address">
                </div>
                <div class="formItem">
                    <label for="doctor">Which doctor are you looking to see?</label>
                    <select name="doctor" id="doctor">
                        <option></option>
                        <option value="1">Dr. Andrew Smithfield</option>
                        <option value="2">Dr. Sandra Martinez</option>
                        <option value="3">Dr. Michael Jenkins</option>
                    </select>
                </div>
                <div class="formItem">
                    <label for="purpose">What's the purpose of the appointment?</label>
                    <select name="purpose" id="purpose">
                        <option></option>
                        <option value="regular">Regular Check-up</option>
                        <option value="followUp">Follow-up Appointment</option>
                        <option value="consult">Consultation</option>
                        <option value="urgent">Urgent Treatment</option>
                        <option value="nonUrgent">Non-urgent Treatment</option>
                        <option value="test">Testing/Diagnosis</option>
                    </select>
                </div>
                <div class="formItem">
                    <label for="pain">How would you rate your pain on a scale of 1-10?</label>
                    <input type="number" name="pain" id="pain" min="1" max="10">
                </div>
                <div class="formItem">
                    <label for="urgency">How would you rate the urgency of your appointment on a scale of 1-10?</label>
                    <input type="number" name="urgency" id="urgency" min="1" max="10">
                </div>
                <div class="formItem">
                    <label for="symptoms">What are your symptoms?</label>
                    <input type="text" name="symptoms" id="symptoms">
                </div>
            </form>
            <nav>
                <a href="appointments.html"><button type="button" class="danger"><span>Back</span></button></a>
                <a href="scheduler.html"><button type="button" class="primary"><i class="fa-solid fa-arrow-right"></i></button></a>
            </nav>
        </div>
    </main>
    <footer>
        <h4>Created by Christian Richardson</h4>
        <a href="https://github.com/richachr/260startup"><i class="fa-brands fa-github"></i><span>GitHub</span></a>
    </footer>
</body>
</html>