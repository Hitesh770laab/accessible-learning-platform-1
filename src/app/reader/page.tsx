"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

export default function ReaderPage() {
  const [text, setText] = React.useState("");
  const [speaking, setSpeaking] = React.useState(false);
  const [ocrText, setOcrText] = React.useState("");
  const [status, setStatus] = React.useState<string>("");
  const [speakingOcr, setSpeakingOcr] = React.useState(false);

  const onPdfChange = async (file?: File) => {
    if (!file) return;
    setStatus("Processing PDF...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => (it.str ?? ""));
        fullText += strings.join(" ") + "\n";
      }
      setText(fullText.trim());
      setStatus("PDF processed");
    } catch (e) {
      console.error(e);
      setStatus("Failed to read PDF");
    }
  };

  const onImageChange = async (file?: File) => {
    if (!file) return;
    setStatus("Running OCR...");
    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        tessedit_pageseg_mode: 1,
      });
      setOcrText(data.text || "");
      setStatus("OCR complete");
    } catch (e) {
      console.error(e);
      setStatus("Failed to run OCR");
    }
  };

  const speak = () => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.onend = () => setSpeaking(false);
    speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speakOcr = () => {
    if (!ocrText) return;
    const utter = new SpeechSynthesisUtterance(ocrText);
    utter.lang = "en-IN";
    utter.onend = () => setSpeakingOcr(false);
    speechSynthesis.speak(utter);
    setSpeakingOcr(true);
  };

  const stopOcr = () => {
    speechSynthesis.cancel();
    setSpeakingOcr(false);
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-8 space-y-6" aria-labelledby="reader-heading">
      <h1 id="reader-heading" className="text-2xl font-semibold">Reader & OCR</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload study materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="pdf-input" className="text-sm">Upload PDF</label>
              <Input id="pdf-input" type="file" accept="application/pdf" onChange={(e) => onPdfChange(e.target.files?.[0] || undefined)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="img-input" className="text-sm">Upload image for OCR</label>
              <Input id="img-input" type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0] || undefined)} />
            </div>
          </div>
          {status && <p className="text-sm text-muted-foreground" aria-live="polite">{status}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            {!speaking ? (
              <Button onClick={speak} aria-label="Start reading text">Read aloud</Button>
            ) : (
              <Button onClick={stop} variant="destructive" aria-label="Stop reading text">Stop</Button>
            )}
            <Button variant="outline" onClick={() => setText("")}>Clear</Button>
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[30vh]" aria-label="Extracted PDF text" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OCR result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            {!speakingOcr ? (
              <Button onClick={speakOcr} aria-label="Read OCR text aloud">Read aloud</Button>
            ) : (
              <Button onClick={stopOcr} variant="destructive" aria-label="Stop reading OCR text">Stop</Button>
            )}
            <Button variant="outline" onClick={() => setOcrText("")}>Clear</Button>
          </div>
          <Textarea value={ocrText} onChange={(e) => setOcrText(e.target.value)} className="min-h-[30vh]" aria-label="OCR text" />
        </CardContent>
      </Card>
    </main>
  );
}