import React, { useEffect, useRef, useState } from 'react'
import { Copy, MoveUp, Plus, SquarePen } from 'lucide-react';

const STORAGE_KEY = "pdfChatSession";

const defaultSession = { fileName: "", isFileUploaded: false, chat: [] };

const getSavedSession = () => {
  if (typeof window === "undefined") return defaultSession;

  try {
    const saved = JSON.parse(localStorage.getItem("pdfChatSession"));
    return { ...defaultSession, ...saved };
  } catch {
    return defaultSession;
  }
};
const Home = () => {
  const [savedSession] = useState(() => getSavedSession());
  const fileInputRef = useRef(null)
  const bottomRef = useRef(null)
  const [fileName, setFileName] = useState(savedSession.fileName);
  const [files, setFiles] = React.useState([]);
  const [isFileUploaded, setIsFileUploaded] = React.useState(savedSession.isFileUploaded);
  const [question, setQuestion] = React.useState("");
  const [chat, setChat] = React.useState(savedSession.chat);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [uploadStatus, setUploadStatus] = React.useState("idle");
  const [copiedMessageIndex, setCopiedMessageIndex] = React.useState(null);

  useEffect(()=>{
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        fileName,
        isFileUploaded,
        chat,
      })
    );
  },[chat, fileName, isFileUploaded])
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat, isLoading, error])

  const uploadBtn = () => {
    fileInputRef.current?.click()
  }
  const userInputQuestion = (e) => {
    setQuestion(e)
  }
  const uploadPDF = async () => {
    setError("")

    if (!files.length){
      alert("Attach a file")
      return
    }

    try{
      setIsLoading(true)
      setUploadStatus("uploading")
      const formData = new FormData()
      files.forEach((selectedFile) => {
        formData.append("pdf", selectedFile)
      })
      const response = await fetch("http://localhost:3000/api/uploadPDF", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("PDF upload failed")
      }

      setIsFileUploaded(true)
      setUploadStatus("done")
      setChat([
        {
          role: "assistant",
          message: `PDF uploaded successfully. You can now ask questions from ${files.map((selectedFile) => selectedFile.name).join(", ")}.`,
          references: []
        }
      ])
    }
    catch(err){
      console.log("Error while uploading file",err)
      setError("Unable to upload the PDF. Please try again.")
      setUploadStatus("idle")
    }
    finally {
      setIsLoading(false)
    }
  }
  const sendBtn = async () => {
    setError("")

    if (!isFileUploaded){
      await uploadPDF()
      return
    }

    if (!question.trim()) {
      setError("Enter a question first.")
      return
    }

    const currentQuestion = question
    setQuestion("")
    setChat((prev) => [
      ...prev,
      {
        role: "user",
        message: currentQuestion,
        references: []
      }
    ])

    try {
      setIsLoading(true)
      const getData = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      })

      if (!getData.ok) {
        throw new Error("Question request failed")
      }

      const data = await getData.json()
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          message: data.message || "No response received.",
          references: Array.isArray(data.references) ? data.references : []
        }
      ])
    }
    catch (err) {
      console.log("Error while asking question", err)
      setError("Unable to get an answer right now.")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      await fetch("http://localhost:3000/api/clear-chat", {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Error while clearing chat", err);
    }

    setFiles([])
    setFileName("")
    setChat([])
    setIsFileUploaded(false)
    setQuestion("")
    setError("")
    setUploadStatus("idle")
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  const copyToClipboard = async (text, index) => {
    if (!text?.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);

      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
        return;
      }
    }

    setCopiedMessageIndex(index);
    window.setTimeout(() => {
      setCopiedMessageIndex((currentIndex) => (
        currentIndex === index ? null : currentIndex
      ));
    }, 1200);
  }

  
  return (
    <div className='h-screen w-full overflow-hidden bg-black text-white'>
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          <h1 className="text-2xl font-semibold text-white">
            PDF Chat
          </h1>
          <p className="text-sm text-white/45">
            {isFileUploaded ? "Ready" : "Upload a PDF first"}
          </p>
          <div onClick={handleNewChat} className='flex gap-3 hover:cursor-pointer bg-white/30 rounded-full w-fit h-fit p-2 justify-center items-center'>
            <SquarePen />
            <h1>New Chat</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-48 pt-2">
          {chat.length === 0 && (
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-2xl px-6 text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Want to know everything about your PDF?<span className='text-xl text-blue-500'>Just upload your PDF</span> </h2>
                <p className="mt-4 text-sm leading-7 text-white/50">
                  Upload your PDF first. The input unlocks only after the file is processed.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {chat.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${item.role === "user" ? "max-w-2xl rounded-4xl bg-[#2f7cf6] px-5 py-4 text-white" : "w-full max-w-3xl px-1 py-1 text-white sm:px-2"}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">
                      {item.role === "user" ? "You" : "Assistant"}
                      
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/90 sm:text-[15px]">
                    {item.message}
                  </p>

                  {item.role === "assistant" && (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.message, index)}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-sm text-blue-200 transition hover:bg-blue-500/25"
                      >
                        <Copy size={15} />
                        <span>{copiedMessageIndex === index ? "Copied" : "Copy text"}</span>
                      </button>
                    </div>
                  )}
                  

                  {item.references && item.references.length > 0 && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                        References
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {item.references.map((reference) => (
                          <div key={reference.id} className="rounded-4xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/80">
                            <p className="font-medium text-white/90">{reference.documentName}</p>
                            {(reference.section || reference.startPage) && (
                              <p className="mt-1 text-white/55">
                                {reference.section || `Page ${reference.startPage}${reference.endPage && reference.endPage !== reference.startPage ? `-${reference.endPage}` : ""}`}
                              </p>
                            )}
                            <p className="mt-1 line-clamp-3 text-white/65">{reference.excerpt}</p>
                            <p className="mt-1 text-white/55">Score: {Number(reference.score).toFixed(3)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-2xl rounded-4xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
              
            </div>
          )}

          {isLoading && (
            <div className="mt-6 flex justify-start">
              <div className="rounded-[1.75rem] bg-white/[0.05] px-5 py-4 text-sm text-white/70">
                {isFileUploaded ? "Thinking..." : "Uploading and preparing your PDF..."}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-10">
          <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <div className='rounded-[3rem] border border-white/10 bg-[#1f1f1f] p-3'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
                <button
                  type="button"
                  onClick={uploadBtn}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-4xl bg-transparent transition hover:bg-white/6"
                >
                  <Plus color='white' size={20} />
                </button>
                <input accept='.pdf' type="file" multiple ref={fileInputRef} hidden onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    if (selectedFiles.length) {
                      setFiles(selectedFiles);
                      setFileName(selectedFiles.map((selectedFile) => selectedFile.name).join(", "));
                      setIsFileUploaded(false);
                      setUploadStatus("idle");
                      setQuestion("");
                      setChat([]);
                      setError("");
                    }
                  }} />
                <div className="min-w-0 flex-1">
                  <textarea
                  onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendBtn();
                      }
                    }}
                    onChange={(e)=>userInputQuestion(e.target.value)}
                    type="text"
                    value={question}
                    disabled={!isFileUploaded || isLoading}
                    placeholder={isFileUploaded ? "Ask anything from your PDF" : "Upload your PDF first to unlock chat"}
                    className="w-full bg-transparent px-2 py-3 text-base text-white outline-none placeholder:text-white/45 disabled:cursor-not-allowed disabled:text-white/35"
                  />
                  <div className="flex items-center justify-between px-2 pb-1">
                    <p className="truncate text-xs bg-blue-500 p-2 rounded text-white">
                      {isFileUploaded
                        ? `PDF uploaded: ${fileName}`
                        : uploadStatus === "uploading"
                        ? "Uploading and preparing PDF..."
                        : fileName || "Choose a PDF, then click send to upload it"}
                    </p>
                    <p className="text-xs text-blue-200/80">
                      {!isFileUploaded ? "Locked" : "Ready"}
                    </p>
                  </div>
                </div>
                <div className='flex justify-end pr-1'>
                  <button
                    type="button"
                    onClick={sendBtn}
                    disabled={isLoading}
                    className='flex h-12 w-12 items-center justify-center rounded-4xl bg-[#2f7cf6] transition hover:bg-[#3f86f7] disabled:cursor-not-allowed disabled:bg-[#2f7cf6]/50 cursor-pointer'
                  >
                    <MoveUp color="white" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
