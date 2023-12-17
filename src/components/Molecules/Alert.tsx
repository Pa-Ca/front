import { useState, useEffect, useRef, FC } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AlertType, AlertProps, alertService, ALERT_DEFAULT_ID } from "@services";

export const Alert: FC<AlertProps> = ({ id = ALERT_DEFAULT_ID, fade = true }) => {
  const mounted = useRef(false);
  const location = useLocation();
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  function omit(arr: AlertProps[], key: keyof AlertProps) {
    return arr.map((obj) => {
      const { [key]: _, ...rest } = obj;
      return rest;
    });
  }

  function removeAlert(alert: AlertProps) {
    if (!mounted.current) return;

    if (fade) {
      // fade out alert
      setAlerts((alerts) =>
        alerts.map((x) =>
          x.itemId === alert.itemId ? { ...x, fade: true, closing: true } : x
        )
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
    }
  }

  function cssClasses(alert: AlertProps) {
    if (!alert) return;

    const classes = [
      "relative w-auto px-4 border rounded-lg shadow-lg overflow-hidden transition-all duration-250 animate-height-bottom",
    ];

    const alertTypeClass = {
      [AlertType.SUCCESS]: "bg-green-100 border-green-400 text-green-700",
      [AlertType.INFO]: "bg-blue-100 border-blue-400 text-blue-700",
      [AlertType.WARNING]: "bg-yellow-100 border-yellow-400 text-yellow-700",
      [AlertType.ERROR]: "bg-red-100 border-red-400 text-red-700",
    };

    classes.push(alertTypeClass[alert.type!]);

    if (alert.fade) {
      classes.push("fade");
    }

    return classNames(classes);
  }

  function xMarkCss(alert: AlertProps) {
    if (!alert) return;

    const alertTypeClass = {
      [AlertType.SUCCESS]: "text-green-500",
      [AlertType.INFO]: "text-blue-500",
      [AlertType.WARNING]: "text-yellow-500",
      [AlertType.ERROR]: "text-red-500",
    };

    return alertTypeClass[alert.type!];
  }

  useEffect(() => {
    mounted.current = true;

    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message && !alert.title) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          return omit(filteredAlerts, "keepAfterRouteChange");
        });
      } else {
        // add alert to array with unique id
        alert.itemId = Math.random();
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), alert.autoCloseDelay);
        }
      }
    });

    // clean up function that runs when the component unmounts
    return () => {
      mounted.current = false;

      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // clear alerts on location change
    alertService.clear(id);
  }, [location, id]);

  if (!alerts.length) return null;

  return (
    <div
      style={{
        left: "50%",
        maxWidth: "min(30rem, 90vw)",
        transform: "translateX(-50%)",
      }}
      className="flex flex-col items-center gap-1 fixed z-90 bottom-12"
    >
      {alerts.map((alert) => (
        <div
          key={alert.itemId}
          className={classNames(
            cssClasses(alert),
            alert.closing ? "opacity-0" : "opacity-1"
          )}
          style={{ maxWidth: "100%" }}
          role="alert"
        >
          <div className="flex my-3 items-center gap-4">
            <div className="flex flex-col">
              <strong className="font-bold">{alert.title}</strong>
              <span className="block text-sm">{alert.message}</span>
            </div>

            <div className="cursor-pointer" onClick={() => removeAlert(alert)}>
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon
                className={classNames("h-4 w-4", xMarkCss(alert))}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: "default-alert",
  fade: true,
};
