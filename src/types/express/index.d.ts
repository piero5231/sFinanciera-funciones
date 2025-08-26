import express from 'express';
export { };
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}
