import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Enumeration of possible alert types.
 */
export enum AlertType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

/**
 * Interface representing an alert.
 */
export interface AlertProps {
  /**
   * Indicator of the component to which the alert is directed
   */
  id?: string;
  /**
   * The unique identifier for the alert.
   */
  itemId?: number;
  /**
   * Whether the alert should automatically close after a certain time.
   */
  autoClose?: boolean;
  /**
   * The number of milliseconds to wait before automatically closing the alert.
   */
  autoCloseDelay?: number;
  /**
   * The type of the alert.
   */
  type?: AlertType;
  /**
   * Alert title
   */
  title?: string;
  /**
   * The message to display in the alert.
   */
  message?: string;
  /**
   * Indicates if the alert should be kept after a route change.
   */
  keepAfterRouteChange?: boolean;
  /**
   * Indicates if the alert should fade out.
   */
  fade?: boolean;
  /**
   * Indicates if the alert is closing
   */
  closing?: boolean;
}

export const ALERT_DEFAULT_ID = "default-alert";
const alertSubject = new Subject<AlertProps>();

// enable subscribing to alerts observable
function onAlert(id: string = ALERT_DEFAULT_ID) {
  return alertSubject.asObservable().pipe(filter((x) => x && x.id === id));
}

// core alert method
function alert(alert: AlertProps) {
  alert.id = alert.id || ALERT_DEFAULT_ID;
  alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
  alert.autoCloseDelay = alert.autoCloseDelay || 5000;
  alertSubject.next(alert);
}

// convenience methods
function success(title: string, message?: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.SUCCESS, title, message });
}

function info(title: string, message?: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.INFO, title, message });
}

function warn(title: string, message?: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.WARNING, title, message });
}

function error(title: string, message?: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.ERROR, title, message });
}

// clear alerts
function clear(id: string = ALERT_DEFAULT_ID) {
  alertSubject.next({ id });
}

export const alertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
};
