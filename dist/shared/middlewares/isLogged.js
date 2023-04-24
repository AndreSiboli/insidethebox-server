"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
function verifyAuth(req, res, next) {
    console.log(req.isAuthenticated(), 'auth');
    if (!req.isAuthenticated()) {
        return res.json({ restrict: false });
    }
    next();
}
exports.verifyAuth = verifyAuth;
