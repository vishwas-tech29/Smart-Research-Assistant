import { useState } from "react";
import { Upload, Send, FileText, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [report, setReport] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Simulate API calls with delays for demonstration
  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus({ type: 'success', message: `PDF uploaded: ${file.name}` });
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      setReport(`Based on the uploaded document, here's what I found regarding "${question}":\n\nThis is a simulated response that would contain detailed analysis from your PDF. The actual implementation would process the document and provide relevant insights based on your question.\n\nKey findings:\n• Point 1: Relevant information extracted\n• Point 2: Additional context provided\n• Point 3: Summary of findings\n\nThis response demonstrates the enhanced UI with smooth animations and premium styling.`);
    } catch (error) {
      setReport("Error processing your question. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  // Cartoon Character Components
  const RobotAssistant = ({ isActive, mood = "happy" }) => (
    <div className={`transition-all duration-500 ${isActive ? 'animate-bounce' : ''}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
        {/* Robot Body */}
        <rect x="35" y="45" width="50" height="55" rx="15" fill="#4F46E5" className="animate-pulse"/>
        <rect x="32" y="42" width="56" height="61" rx="18" fill="none" stroke="#818CF8" strokeWidth="2"/>
        
        {/* Robot Head */}
        <circle cx="60" cy="35" r="25" fill="#6366F1"/>
        <circle cx="57" cy="32" r="28" fill="none" stroke="#A5B4FC" strokeWidth="2"/>
        
        {/* Eyes */}
        <circle cx="52" cy="30" r="4" fill="#FFF"/>
        <circle cx="68" cy="30" r="4" fill="#FFF"/>
        <circle cx="52" cy="30" r="2" fill={mood === "working" ? "#F59E0B" : "#10B981"} className={mood === "working" ? "animate-pulse" : ""}/>
        <circle cx="68" cy="30" r="2" fill={mood === "working" ? "#F59E0B" : "#10B981"} className={mood === "working" ? "animate-pulse" : ""}/>
        
        {/* Mouth */}
        <path d="M 50 40 Q 60 45 70 40" stroke="#FFF" strokeWidth="2" fill="none"/>
        
        {/* Antenna */}
        <line x1="60" y1="10" x2="60" y2="20" stroke="#818CF8" strokeWidth="3"/>
        <circle cx="60" cy="8" r="3" fill="#F59E0B" className="animate-ping"/>
        
        {/* Arms */}
        <rect x="20" y="55" width="15" height="8" rx="4" fill="#4F46E5" className="animate-pulse"/>
        <rect x="85" y="55" width="15" height="8" rx="4" fill="#4F46E5" className="animate-pulse"/>
        
        {/* Control Panel */}
        <rect x="45" y="55" width="30" height="20" rx="5" fill="#1E1B4B"/>
        <circle cx="52" cy="62" r="2" fill="#10B981"/>
        <circle cx="60" cy="62" r="2" fill="#F59E0B"/>
        <circle cx="68" cy="62" r="2" fill="#EF4444"/>
        <rect x="48" y="68" width="24" height="2" rx="1" fill="#6366F1"/>
      </svg>
    </div>
  );

  const BookCharacter = ({ isReading }) => (
    <div className={`transition-all duration-700 ${isReading ? 'animate-bounce' : ''}`}>
      <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-lg">
        {/* Book Body */}
        <rect x="25" y="30" width="50" height="40" rx="3" fill="#8B5CF6"/>
        <rect x="22" y="27" width="56" height="46" rx="5" fill="none" stroke="#A78BFA" strokeWidth="2"/>
        
        {/* Book Pages */}
        <rect x="30" y="35" width="40" height="30" rx="2" fill="#FFF"/>
        <line x1="35" y1="40" x2="65" y2="40" stroke="#D1D5DB" strokeWidth="1"/>
        <line x1="35" y1="45" x2="65" y2="45" stroke="#D1D5DB" strokeWidth="1"/>
        <line x1="35" y1="50" x2="55" y2="50" stroke="#D1D5DB" strokeWidth="1"/>
        <line x1="35" y1="55" x2="60" y2="55" stroke="#D1D5DB" strokeWidth="1"/>
        
        {/* Book Eyes */}
        <circle cx="40" cy="25" r="4" fill="#FFF"/>
        <circle cx="60" cy="25" r="4" fill="#FFF"/>
        <circle cx="40" cy="25" r="2" fill="#1F2937"/>
        <circle cx="60" cy="25" r="2" fill="#1F2937"/>
        
        {/* Book Smile */}
        <path d="M 45 20 Q 50 15 55 20" stroke="#6366F1" strokeWidth="2" fill="none"/>
        
        {/* Bookmark */}
        <rect x="48" y="15" width="4" height="20" fill="#EF4444"/>
        <polygon points="48,15 52,15 50,10" fill="#DC2626"/>
        
        {/* Arms holding glasses */}
        {isReading && (
          <g className="animate-pulse">
            <line x1="15" y1="35" x2="25" y2="30" stroke="#8B5CF6" strokeWidth="3"/>
            <line x1="85" y1="35" x2="75" y2="30" stroke="#8B5CF6" strokeWidth="3"/>
            <circle cx="12" cy="37" r="3" fill="#FbbF24"/>
            <circle cx="88" cy="37" r="3" fill="#FbbF24"/>
          </g>
        )}
        
        {/* Floating sparkles */}
        <circle cx="80" cy="20" r="1" fill="#F59E0B" className="animate-ping"/>
        <circle cx="20" cy="50" r="1" fill="#10B981" className="animate-ping" style={{animationDelay: '0.5s'}}/>
        <circle cx="85" cy="60" r="1" fill="#EF4444" className="animate-ping" style={{animationDelay: '1s'}}/>
      </svg>
    </div>
  );

  const SearchMagnifyingGlass = ({ isSearching }) => (
    <div className={`transition-all duration-500 ${isSearching ? 'animate-spin' : 'animate-pulse'}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
        {/* Magnifying Glass */}
        <circle cx="30" cy="30" r="20" fill="none" stroke="#06B6D4" strokeWidth="4"/>
        <circle cx="30" cy="30" r="15" fill="#ECFEFF" fillOpacity="0.3"/>
        <line x1="45" y1="45" x2="65" y2="65" stroke="#0891B2" strokeWidth="6" strokeLinecap="round"/>
        
        {/* Handle decoration */}
        <circle cx="67" cy="67" r="4" fill="#0891B2"/>
        
        {/* Eye in the lens */}
        <circle cx="30" cy="28" r="3" fill="#1F2937"/>
        <circle cx="30" cy="26" r="1" fill="#FFF"/>
        
        {/* Eyebrow */}
        <path d="M 24 22 Q 30 18 36 22" stroke="#374151" strokeWidth="2" fill="none"/>
        
        {/* Search rays */}
        {isSearching && (
          <g>
            <line x1="10" y1="30" x2="5" y2="30" stroke="#06B6D4" strokeWidth="2" className="animate-pulse"/>
            <line x1="30" y1="10" x2="30" y2="5" stroke="#06B6D4" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
            <line x1="50" y1="30" x2="55" y2="30" stroke="#06B6D4" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
            <line x1="30" y1="50" x2="30" y2="55" stroke="#06B6D4" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
          </g>
        )}
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Robot Assistant */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6 relative">
            <RobotAssistant isActive={isUploading || isAsking} mood={isAsking ? "working" : "happy"} />
            <div className="absolute -top-4 -right-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-purple-400 rounded-full blur-lg opacity-20 animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Smart Research Assistant
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Meet Alex, your AI research buddy! Upload PDFs and ask questions to get instant insights
          </p>
        </div>

        {/* Upload Section with Book Character */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Upload className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Upload Document</h2>
            </div>
            <BookCharacter isReading={isUploading} />
          </div>
          
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-purple-400 bg-purple-400/10 scale-105' 
                : 'border-slate-600 hover:border-purple-400/50 hover:bg-slate-800/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <FileText className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
              file ? 'text-green-400' : 'text-slate-400'
            }`} />
            
            <p className="text-slate-300 mb-2">
              {file ? file.name : 'Drag and drop your PDF here, or click to browse'}
            </p>
            <p className="text-slate-500 text-sm">PDF files only, up to 10MB</p>
            
            {file && (
              <div className="mt-4 p-3 bg-green-400/10 rounded-lg border border-green-400/30">
                <p className="text-green-400 text-sm font-medium">✓ File ready to upload</p>
              </div>
            )}
          </div>

          <button
            onClick={uploadFile}
            disabled={!file || isUploading}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Alex is reading your document...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload PDF
              </>
            )}
          </button>

          {/* Upload Status */}
          {uploadStatus && (
            <div className={`mt-4 p-4 rounded-lg border animate-slide-in ${
              uploadStatus.type === 'success' 
                ? 'bg-green-400/10 border-green-400/30 text-green-400' 
                : 'bg-red-400/10 border-red-400/30 text-red-400'
            }`}>
              <div className="flex items-center">
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                {uploadStatus.message}
              </div>
            </div>
          )}
        </div>

        {/* Question Section with Search Character */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Send className="w-6 h-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Ask Questions</h2>
            </div>
            <SearchMagnifyingGlass isSearching={isAsking} />
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What would you like to know about your document?"
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              onKeyPress={e => e.key === 'Enter' && askQuestion()}
              disabled={isAsking}
            />
            <button
              onClick={askQuestion}
              disabled={!question.trim() || isAsking}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {isAsking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Report Section */}
        {(report || isAsking) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Analysis Report</h2>
              </div>
              {isAsking && (
                <div className="animate-bounce">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl animate-pulse">🤖</span>
                  </div>
                </div>
              )}
            </div>
            
            {isAsking ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="flex justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-slate-300 text-lg">Alex is analyzing your document...</p>
                  <p className="text-slate-500 text-sm mt-2">Finding the best answers for you! 🔍</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-green-400 font-semibold mb-2">Alex's Analysis:</div>
                    <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                      {report}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Characters */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="animate-float">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl animate-pulse">💡</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;