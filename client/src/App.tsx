"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Send, FileText, Trash2 } from "lucide-react"
import "./App.css"
interface SentimentResult {
  id: string
  text: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  timestamp: Date
}

// Mock sentiment analysis function
const analyzeSentiment = (text: string): { sentiment: "positive" | "negative" | "neutral"; confidence: number } => {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "happy",
    "joy",
    "perfect",
    "awesome",
    "brilliant",
  ]
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "hate",
    "sad",
    "angry",
    "worst",
    "disgusting",
    "disappointing",
    "annoying",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let positiveScore = 0
  let negativeScore = 0

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveScore++
    if (negativeWords.some((nw) => word.includes(nw))) negativeScore++
  })

  if (positiveScore > negativeScore) {
    return { sentiment: "positive", confidence: Math.min(0.95, 0.6 + (positiveScore - negativeScore) * 0.1) }
  } else if (negativeScore > positiveScore) {
    return { sentiment: "negative", confidence: Math.min(0.95, 0.6 + (negativeScore - positiveScore) * 0.1) }
  } else {
    return { sentiment: "neutral", confidence: 0.7 + Math.random() * 0.2 }
  }
}

export default function App() {
  const [inputText, setInputText] = useState("")
  const [results, setResults] = useState<SentimentResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [batchTexts, setBatchTexts] = useState<string[]>([])
  const [currentBatchText, setCurrentBatchText] = useState("")
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)

  const handleTextAnalysis = async () => {
    if (!isBatchMode) {
      // Single text analysis (existing functionality)
      if (!inputText.trim()) return

      setIsAnalyzing(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const analysis = analyzeSentiment(inputText)
      const result: SentimentResult = {
        id: Date.now().toString(),
        text: inputText,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        timestamp: new Date(),
      }

      setResults((prev) => [result, ...prev])
      setInputText("")
      setIsAnalyzing(false)
    } else {
      // Batch analysis
      if (batchTexts.length === 0) return

      setIsAnalyzing(true)
      setBatchProgress(0)

      const batchResults: SentimentResult[] = []

      for (let i = 0; i < batchTexts.length; i++) {
        const text = batchTexts[i]
        if (text.trim()) {
          // Simulate processing delay
          await new Promise((resolve) => setTimeout(resolve, 800))

          const analysis = analyzeSentiment(text)
          const result: SentimentResult = {
            id: `${Date.now()}-${i}`,
            text: text,
            sentiment: analysis.sentiment,
            confidence: analysis.confidence,
            timestamp: new Date(),
          }

          batchResults.push(result)
          setBatchProgress(((i + 1) / batchTexts.length) * 100)
        }
      }

      setResults((prev) => [...batchResults, ...prev])
      setBatchTexts([])
      setIsAnalyzing(false)
      setBatchProgress(0)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/plain") {
      alert("Please upload a text file (.txt)")
      return
    }

    setIsAnalyzing(true)

    try {
      const text = await file.text()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const analysis = analyzeSentiment(text)
      const result: SentimentResult = {
        id: Date.now().toString(),
        text: text.length > 200 ? text.substring(0, 200) + "..." : text,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        timestamp: new Date(),
      }

      setResults((prev) => [result, ...prev])
    } catch (error) {
      alert("Error reading file")
    }

    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addToBatch = () => {
    if (currentBatchText.trim()) {
      setBatchTexts((prev) => [...prev, currentBatchText.trim()])
      setCurrentBatchText("")
    }
  }

  const removeBatchText = (index: number) => {
    setBatchTexts((prev) => prev.filter((_, i) => i !== index))
  }

  const clearBatch = () => {
    setBatchTexts([])
    setCurrentBatchText("")
  }

  const clearResults = () => {
    setResults([])
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#10b981"
      case "negative":
        return "#ef4444"
      case "neutral":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="sentiment-classifier">
      <div className="header">
        <h1>Sentiment Classifier</h1>
        <p>Analyze the sentiment of your text using machine learning</p>
      </div>

      <div className="input-section">
        <div className="mode-toggle">
          <button onClick={() => setIsBatchMode(false)} className={`mode-button ${!isBatchMode ? "active" : ""}`}>
            Single Text
          </button>
          <button onClick={() => setIsBatchMode(true)} className={`mode-button ${isBatchMode ? "active" : ""}`}>
            Batch Analysis
          </button>
        </div>

        {!isBatchMode ? (
          <>
            <div className="text-input-container">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here to analyze its sentiment..."
                className="text-input"
                rows={4}
              />
              <button
                onClick={handleTextAnalysis}
                disabled={!inputText.trim() || isAnalyzing}
                className="analyze-button"
              >
                <Send size={16} />
                {isAnalyzing ? "Analyzing..." : "Analyze Text"}
              </button>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="file-upload-container">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <Upload size={20} />
                Upload Text File (.txt)
              </label>
            </div>
          </>
        ) : (
          <div className="batch-container">
            <div className="batch-input-container">
              <textarea
                value={currentBatchText}
                onChange={(e) => setCurrentBatchText(e.target.value)}
                placeholder="Enter text to add to batch..."
                className="text-input"
                rows={3}
              />
              <button onClick={addToBatch} disabled={!currentBatchText.trim()} className="add-batch-button">
                Add to Batch
              </button>
            </div>

            {batchTexts.length > 0 && (
              <div className="batch-list">
                <div className="batch-header">
                  <h3>Batch Queue ({batchTexts.length} texts)</h3>
                  <button onClick={clearBatch} className="clear-batch-button">
                    Clear All
                  </button>
                </div>
                <div className="batch-items">
                  {batchTexts.map((text, index) => (
                    <div key={index} className="batch-item">
                      <span className="batch-number">{index + 1}</span>
                      <span className="batch-text">{text.length > 100 ? text.substring(0, 100) + "..." : text}</span>
                      <button onClick={() => removeBatchText(index)} className="remove-batch-button">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleTextAnalysis}
                  disabled={batchTexts.length === 0 || isAnalyzing}
                  className="analyze-batch-button"
                >
                  <Send size={16} />
                  {isAnalyzing
                    ? `Analyzing... (${Math.round(batchProgress)}%)`
                    : `Analyze Batch (${batchTexts.length} texts)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className="loading">
          <div className="loading-spinner"></div>
          {isBatchMode ? (
            <div className="batch-progress">
              <p>Analyzing batch... ({Math.round(batchProgress)}%)</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${batchProgress}%` }}></div>
              </div>
            </div>
          ) : (
            <p>Analyzing sentiment...</p>
          )}
        </div>
      )}

      <div className="results-section">
        <div className="results-header">
          <h2>
            <FileText size={20} />
            Analysis Results ({results.length})
          </h2>
          {results.length > 0 && (
            <button onClick={clearResults} className="clear-button">
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <p>No analysis results yet. Enter some text or upload a file to get started!</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <div className="sentiment-badge" style={{ backgroundColor: getSentimentColor(result.sentiment) }}>
                    {result.sentiment.toUpperCase()}
                  </div>
                  <div className="confidence">{Math.round(result.confidence * 100)}% confidence</div>
                  <div className="timestamp">{result.timestamp.toLocaleTimeString()}</div>
                </div>
                <div className="result-text">{result.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <center><p>Made by Juan Camilo Ortiz G - 2023921</p></center>
    </div>
  )
}
