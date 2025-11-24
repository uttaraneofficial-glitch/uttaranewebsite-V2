import React, { useState, useEffect } from 'react'

const AboutPage = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/public/about')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('About page data:', data) // Debug log
        setContent(data.data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to load content: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Add a timeout to ensure loading doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false)
        if (!content) {
          setError('Content loading timed out. Please refresh the page.')
        }
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timer)
  }, [loading, content])

  if (loading) return <div className="container py-8 contrast-text-light">Loading...</div>
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>

  return (
    <div className="about-page py-8">
      <div className="container">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 contrast-text-dark">About Us</h1>
          <div 
            className="prose max-w-none contrast-text-dark"
            dangerouslySetInnerHTML={{ 
              __html: content?.html || '<p>Welcome to our company. We are dedicated to providing excellent services.</p>' 
            }} 
          />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 contrast-text-dark">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content?.teamMembers && content.teamMembers.length > 0 ? (
                content.teamMembers.map((member) => (
                  <div key={member.id} className="team-member text-center">
                    <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg contrast-text-dark">{member.name}</h3>
                    <p className="text-gray-600 mb-2">{member.role}</p>
                    {member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center contrast-text-dark">No team members to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage