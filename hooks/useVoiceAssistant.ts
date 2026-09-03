"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseVoiceAssistantOptions {
  onSpeechResult?: (transcript: string) => void;
  lang?: string;
}

export const useVoiceAssistant = ({
  onSpeechResult,
  lang = "bn-BD",
}: UseVoiceAssistantOptions = {}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [hasSupport, setHasSupport] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const recognitionRef = useRef<any>(null);
  const onSpeechResultRef = useRef(onSpeechResult);
  onSpeechResultRef.current = onSpeechResult;

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalTrans = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTrans) {
          const cleanFinal = finalTrans.trim();
          setTranscript(cleanFinal);
          setInterimTranscript("");
          setIsListening(false);
          if (onSpeechResultRef.current) {
            onSpeechResultRef.current(cleanFinal);
          }
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error / status:", err.error || err);
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error("SpeechRecognition initialization failed:", e);
      setHasSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [lang]);

  // Load and configure Bengali Female voice
  const findFemaleBanglaVoice = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Look for Bangla specific voices
    const banglaVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().includes("bn") ||
        v.lang.toLowerCase().includes("bengali") ||
        v.name.toLowerCase().includes("bengali") ||
        v.name.toLowerCase().includes("bangla")
    );

    // 2. Prioritize female identifiers
    const femaleBangla = banglaVoices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("kalpana") ||
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("google") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("sangeeta")
    );

    if (femaleBangla) return femaleBangla;
    if (banglaVoices.length > 0) return banglaVoices[0];

    // Fallback female voice in any language if no Bangla voice installed on OS
    const generalFemale = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("natural")
    );

    return generalFemale || voices[0] || null;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voice = findFemaleBanglaVoice();
      setSelectedVoice(voice);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [findFemaleBanglaVoice]);

  // Start Voice Listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই। গুগল ক্রোম বা এজ ব্রাউজার ব্যবহার করুন।");
      return;
    }

    // Stop speaking if currently speaking
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started, restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 150);
      } catch (_) {}
    }
  }, []);

  // Stop Voice Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
  }, []);

  // Text to Speech (Female Bangla Tone)
  const speakText = useCallback(
    (textToSpeak: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !textToSpeak) {
        return;
      }

      window.speechSynthesis.cancel();

      // Clean text of markdown characters before speaking
      const cleanText = textToSpeak
        .replace(/[*#_`~>[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "bn-BD";

      const voice = selectedVoice || findFemaleBanglaVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Tuned parameters for natural, cheerful female voice
      utterance.pitch = 1.18; // Slightly elevated pitch for female resonance
      utterance.rate = 0.95;  // Comfortable conversational tempo
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice, findFemaleBanglaVoice]
  );

  // Stop Speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    hasSupport,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
};
