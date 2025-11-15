"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.InterviewStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["INTERVIEWER"] = "INTERVIEWER";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "SCHEDULED";
    InterviewStatus["IN_PROGRESS"] = "IN_PROGRESS";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["CANCELLED"] = "CANCELLED";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditAction["PASSWORD_RESET_REQUEST"] = "PASSWORD_RESET_REQUEST";
    AuditAction["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditAction["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditAction["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    AuditAction["ACCOUNT_UNLOCKED"] = "ACCOUNT_UNLOCKED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
