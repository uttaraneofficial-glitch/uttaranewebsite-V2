import React, { useState, useEffect } from 'react';

const AboutPage = () => {
  const [content, setContent] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      role: 'CEO & Founder',
      imageUrl: '',
      linkedinUrl: '',
    },
    { id: '2', name: 'Jane Smith', role: 'CTO', imageUrl: '', linkedinUrl: '' },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Head of Operations',
      imageUrl: '',
      linkedinUrl: '',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/public/about');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContent(data.data?.html || '');

      // Load team members if they exist
      if (data.data?.teamMembers && data.data.teamMembers.length > 0) {
        setTeamMembers(data.data.teamMembers);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load about content: ' + err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      // Save HTML content
      const htmlResponse = await fetch('/api/admin/site-content/about_html', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ value: content }),
      });

      if (!htmlResponse.ok) {
        throw new Error(`Failed to save HTML content`);
      }

      // Save team members
      const teamResponse = await fetch('/api/admin/site-content/team_members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ value: JSON.stringify(teamMembers) }),
      });

      if (!teamResponse.ok) {
        throw new Error(`Failed to save team members`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save about content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeamMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      imageUrl: '',
      linkedinUrl: '',
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveTeamMember = id => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleTeamMemberChange = (id, field, value) => {
    setTeamMembers(
      teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleImageUpload = async (file, memberId) => {
    if (!file) return;

    // In a real implementation, you would upload to Cloudinary or another service
    // For now, we'll create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      handleTeamMemberChange(memberId, 'imageUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;

  return (
    <div className="about-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">
          About Content Management
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-6">
          Content saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">
            Editor
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium contrast-text-gray mb-1">
              About Content
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              rows="20"
              placeholder="Enter HTML content for the about page"
            />
            <p className="text-xs contrast-text-gray mt-1">
              You can use HTML tags to format the content. Content will be
              sanitized before saving.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">
            Preview
          </h2>
          <div className="border border-gray-700 rounded p-4 min-h-[400px] bg-gray-800">
            {content ? (
              <div
                className="prose max-w-none contrast-text-light"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="contrast-text-gray">No content to preview</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Members Management */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold contrast-text-light">
            Team Members
          </h2>
          <button
            onClick={handleAddTeamMember}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Add Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-gray-700 p-4 rounded-md">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium contrast-text-light">Team Member</h3>
                <button
                  onClick={() => handleRemoveTeamMember(member.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-xs contrast-text-gray mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={member.name}
                  onChange={e =>
                    handleTeamMemberChange(member.id, 'name', e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-600 contrast-text-light"
                  placeholder="Member name"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs contrast-text-gray mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={member.role}
                  onChange={e =>
                    handleTeamMemberChange(member.id, 'role', e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-600 contrast-text-light"
                  placeholder="Member role"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs contrast-text-gray mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    handleImageUpload(e.target.files[0], member.id)
                  }
                  className="w-full text-xs contrast-text-gray"
                />
                {member.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={member.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-xs contrast-text-gray mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={member.linkedinUrl}
                  onChange={e =>
                    handleTeamMemberChange(
                      member.id,
                      'linkedinUrl',
                      e.target.value
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-600 contrast-text-light"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
