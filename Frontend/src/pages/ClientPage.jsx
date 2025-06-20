import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/clients', formData);
      setClients((prev) => [...prev, res.data]);
      setFormData({ name: '', email: '', company: '' });
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Client
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Client List</h2>
        <Separator />
        <div className="grid gap-4 mt-4">
          {clients.length > 0 ? (
            clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><span className="font-medium">Email:</span> {client.email}</p>
                  <p><span className="font-medium">Company:</span> {client.company}</p>
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-blue-600 hover:underline text-sm inline-block mt-2"
                  >
                    View Tasks →
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No clients added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
