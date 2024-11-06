import React from "react";
import { Button } from "./ui/button";

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 space-y-3 rounded shadow-lg">
          <p>{message}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
};

export default Alert;
