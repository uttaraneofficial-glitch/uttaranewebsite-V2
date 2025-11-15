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
        setContent(data.data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to load content: ' + err.message)
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) return <div className="container py-8">Loading...</div>
  if (error) return <div className="container py-8">Error: {error}</div>

  return (
    <div className="about-page py-8">
      <div className="container">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content?.html || '<p>Welcome to our company. We are dedicated to providing excellent services.</p>' 
            }} 
          />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content?.teamMembers?.map((member) => (
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
                  <h3 className="font-semibold text-lg">{member.name}</h3>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage