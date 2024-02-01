import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Replace the path below with the actual path to your service account key JSON file
import serviceAccount from './firebase-notify.json' assert { type: 'json' };


const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

const firebaseApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'onbo-dev-a43e3', // Replace with your actual project ID
});

const messaging = getMessaging(firebaseApp);

app.post('/send', (req, res) => {
  const receivedToken = req.body.fcmToken;

  const message = {
    notification: {
      title: 'Onbo',
      body: 'This is a Test Notification',
    },
    tokens: ['fGABSY71RKeZJ90T2nlK9_:APA91bEosZXNTaaPhWU2zaHxRrNL-nexC-y3oWkkUQv-6ixE_1IhBkI9VD1WJjeaPdIBe_vYn-sdYxN3OKLHwFk-D9ssG_SUXdRhazQPXrUl5hdkiFShJ8iiKY_vBbho4oMg0ucuzhwx'],
    // tokens: 'fGABSY71RKeZJ90T2nlK9_:APA91bEosZXNTaaPhWU2zaHxRrNL-nexC-y3oWkkUQv-6ixE_1IhBkI9VD1WJjeaPdIBe_vYn-sdYxN3OKLHwFk-D9ssG_SUXdRhazQPXrUl5hdkiFShJ8iiKY_vBbho4oMg0ucuzhwx'],
  };

  messaging
    .sendEachForMulticast(message)
    .then((response) => {
      res.status(200).json({
        message: 'Successfully sent message',
        token: receivedToken,
      });
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      res.status(400).json({
        error: 'Error sending message',
        details: error,
      });
      console.log('Error sending message:', error);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
