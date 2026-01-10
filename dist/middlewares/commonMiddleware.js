import express from 'express';
import session from 'express-session';

export default [
  express.json(),
  session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
  })
];
