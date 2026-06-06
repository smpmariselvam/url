import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [urls, setUrls] = useState([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const API_URL = 'https://url-backend-ip4f.onrender.com'

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/urls/all`)
      setUrls(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setShortUrl('')

    try {
      const res = await axios.post(`${API_URL}/api/urls/shorten`, {
        originalUrl,
        customAlias: customAlias || undefined
      })
      setShortUrl(res.data.shortUrl)
      setOriginalUrl('')
      setCustomAlias('')
      fetchUrls()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteUrl = async (shortId) => {
    try {
      await axios.delete(`${API_URL}/api/urls/${shortId}`)
      fetchUrls()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">URL Shortener</h1>
          <p className="mt-2 text-purple-200">Shorten your links in seconds</p>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-3xl">
        {/* Shorten Form */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter Long URL</label>
              <input
                type="url"
                placeholder="https://example.com/very-long-url..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Custom Alias (Optional)
              </label>
              <input
                type="text"
                placeholder="my-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Shorten URL
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success */}
          {shortUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium mb-2">Your shortened URL:</p>
              <div className="flex items-center gap-2">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium flex-1"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* URL History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Links</h2>

          {urls.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No links created yet</p>
          ) : (
            <div className="space-y-3">
              {urls.map(url => (
                <div key={url._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate mb-1">
                        {url.originalUrl}
                      </p>
                      <a 
                        href={url.shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 font-medium hover:underline"
                      >
                        {url.shortUrl}
                      </a>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>👆 {url.clicks} clicks</span>
                        <span>📅 {new Date(url.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteUrl(url.shortId)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
