import express from 'express';
import session from 'express-session';

export default [
  express.json(),
  session({
    secret: process.env.SESSION_SECRET || 'default-secure-secret',
    resave: false,
    saveUninitialized: false
  })
];
