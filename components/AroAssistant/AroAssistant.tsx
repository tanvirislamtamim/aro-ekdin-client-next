"use client";

import React, { useState } from "react";
import AroFloatingButton from "./AroFloatingButton";
import AroAssistantModal from "./AroAssistantModal";

export const AroAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AroFloatingButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      <AroAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AroAssistant;
