import * as jwt from 'jsonwebtoken';
import * as express from 'express';

let adminRights = ["read:*", "create:*", "update:*", "delete:*"];
let gerantRights = ["read:*", "create:*", "update:*", "delete:BookCopy"];
let userRights = [ "read:*", "create:Book"];

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === 'jwt') {
        const token = request.headers["authorization"]
        console.log(request.headers);
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error('No token provided'));
            } else {
                jwt.verify(token, 'your_secret_key',
                    function(err: any, decoded: any) {
                        if (scopes !== undefined) {
                            if (decoded.username === 'admin') {
                                if (
                                    !scopes.every((s) => adminRights.includes(s)) &&
                                    !scopes.every((s) => adminRights.includes(s.split(':')[0] + ':*'))
                                ) {
                                    return reject(new Error('Insufficient rights'));
                                }
                            } else if (decoded.username === 'gerant') {
                                if (
                                    !scopes.every((s) => gerantRights.includes(s)) &&
                                    !scopes.every((s) => gerantRights.includes(s.split(':')[0] + ':*'))
                                ) {
                                    return reject(new Error('Insufficient rights'));
                                }
                            } else if (decoded.username === 'user') {
                                if (
                                    !scopes.every((s) => userRights.includes(s)) &&
                                    !scopes.every((s) => userRights.includes(s.split(':')[0] + ':*'))
                                ) {
                                    return reject(new Error('Insufficient rights'));
                                }
                            } else {
                                return reject(new Error('User not recognized'));
                            }
                        }
                        resolve(decoded);
                    }
                );
            }
        });
    } else {
        throw new Error('Only support JWT authentication');
    }
}
