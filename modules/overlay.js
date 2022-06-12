import "./Overlay/CreateOverlay.js";
import {NotificationPlugin, CNotification} from "./Overlay/Notification/notification.js";
// debugger;
// globalThis.CNotification = CNotification;

Overlay.AddPlugin("Notifications", NotificationPlugin("/modules/Overlay/Notification/notification.css"))