import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: '', avatar: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        setFormData({
          name: res.data.name || '',
          avatar: res.data.avatar || '',
        });
        setPreviewUrl(res.data.avatar || '');
      } catch (err) {
        console.error('Failed to load profile:', err);
        alert('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = formData.avatar;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploadRes = await API.put('/users/profile/avatar', uploadData);
        avatarUrl = uploadRes.data;
      }

      const updatedRes = await API.put('/users/profile', {
        name: formData.name,
        avatar: avatarUrl,
      });

      setUser({ name: formData.name, avatar: avatarUrl });
      alert('Profile updated successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Change Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">
              Leave blank to keep current avatar.
            </p>
          </div>

          {previewUrl && (
            <div className="pt-2">
              <Label className="block mb-2 text-sm text-muted-foreground">Preview</Label>
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={previewUrl} alt="Avatar Preview" />
                <AvatarFallback>{formData.name.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          )}

          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;

