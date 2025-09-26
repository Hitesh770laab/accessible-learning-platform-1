"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CaptionsPage() {
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [lang, setLang] = React.useState<string>("en-IN");
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  const startListening = React.useCallback(() => {
    const SR: typeof window & { webkitSpeechRecognition?: any } = window as any;
    const SpeechRecognition = SR.SpeechRecognition || SR.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        finalText += res[0].transcript;
        if (!res.isFinal) finalText += " ";
      }
      setTranscript((prev) => (prev + " " + finalText).trim());
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      toast.error(e.error || "Speech recognition error");
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang]);

  const stopListening = React.useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const downloadTxt = () => {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture-transcript-${lang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-8 space-y-6" aria-labelledby="captions-heading">
      <h1 id="captions-heading" className="text-2xl font-semibold">Live speech-to-text captions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-sm">Recognition language</label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger aria-label="Select recognition language">
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-IN">English (India)</SelectItem>
                  <SelectItem value="hi-IN">Hindi (India)</SelectItem>
                  <SelectItem value="bn-IN">Bengali (India)</SelectItem>
                  <SelectItem value="ta-IN">Tamil (India)</SelectItem>
                  <SelectItem value="te-IN">Telugu (India)</SelectItem>
                  <SelectItem value="mr-IN">Marathi (India)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              {!listening ? (
                <Button onClick={startListening} size="lg" aria-pressed={listening} aria-label="Start live captions">Start</Button>
              ) : (
                <Button onClick={stopListening} variant="destructive" size="lg" aria-label="Stop live captions">Stop</Button>
              )}
              <Button onClick={() => setTranscript("")} variant="outline" size="lg">Clear</Button>
              <Button onClick={downloadTxt} variant="secondary" size="lg">Download transcript</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section aria-live="polite" aria-atomic="false">
        <Textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="min-h-[40vh]" aria-label="Live transcript" />
      </section>
    </main>
  );
}