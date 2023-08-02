import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies['Authorization'];
    console.log(req);
    if (!cookies || !cookies.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthorized' });

    const token = cookies.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      req['users'] = payload;
      next();
    } catch (error) {}
  }
}
