import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularFireModule } from '@angular/fire/compat';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'clinica-online-63224',
        appId: '1:291457698259:web:f13380a733dd538fa78726',
        storageBucket: 'clinica-online-63224.appspot.com',
        // locationId: 'us-central',
        apiKey: 'AIzaSyCVdXx5rh-dg_9YDFcCoVGIfEOPjvzqKLY',
        authDomain: 'clinica-online-63224.firebaseapp.com',
        messagingSenderId: '291457698259',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),

    importProvidersFrom(
      AngularFireModule.initializeApp({
        projectId: 'clinica-online-63224',
        appId: '1:291457698259:web:f13380a733dd538fa78726',
        storageBucket: 'clinica-online-63224.appspot.com',
        // locationId: 'us-central',
        apiKey: 'AIzaSyCVdXx5rh-dg_9YDFcCoVGIfEOPjvzqKLY',
        authDomain: 'clinica-online-63224.firebaseapp.com',
        messagingSenderId: '291457698259',
      })
    ),
  ],
};
