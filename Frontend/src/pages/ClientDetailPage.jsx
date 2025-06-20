import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ClientDetailPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'PENDING', dueDate: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'PENDING', dueDate: '' });

  useEffect(() => {
    const fetchClientAndTasks = async () => {
      try {
        const resClient = await API.get(`/clients/${id}`);
        const resTasks = await API.get(`/clients/${id}/tasks`);
        setClient(resClient.data);
        setTasks(resTasks.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchClientAndTasks();
  }, [id]);

  const handleGenerateInvoice = async () => {
    try {
      const res = await API.get(`/invoices/client/${id}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_client_${id}.pdf`;
      link.click();
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/clients/${id}/tasks`, formData);
      setTasks([...tasks, res.data]);
      setFormData({ title: '', description: '', status: 'PENDING', dueDate: '' });
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/clients/${id}/tasks/${editingTaskId}`, editForm);
      setTasks(tasks.map((t) => (t.id === editingTaskId ? res.data : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/clients/${id}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (!client) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{client.name}</h2>
      <p className="text-muted-foreground mb-4">{client.email} | {client.company}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <Button onClick={handleGenerateInvoice} variant="outline">Generate Invoice PDF</Button>
        <Link to={`/clients/${id}/invoice`}>
          <Button variant="outline">View Invoice Page</Button>
        </Link>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleTaskSubmit} className="bg-white p-4 rounded shadow mb-6 w-full max-w-full dark:bg-zinc-900 text-black dark:text-white">
        <h3 className="text-lg font-semibold mb-2">Add Task</h3>
        <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mb-2" />
        <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mb-2" />
        <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="mb-2" />
        <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
          <SelectTrigger className="mb-4"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Add Task</Button>
      </form>

      {/* Sort and Filter */}
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-2 py-1"
          onChange={(e) => {
            const sortOption = e.target.value;
            let sorted = [...tasks];
            if (sortOption === 'due_asc') sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            else if (sortOption === 'due_desc') sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            setTasks(sorted);
          }}
        >
          <option value="">Sort by Due Date</option>
          <option value="due_asc">Oldest First</option>
          <option value="due_desc">Newest First</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          onChange={(e) => {
            const filter = e.target.value;
            if (filter === '') {
              API.get(`/clients/${id}/tasks`).then((res) => setTasks(res.data));
            } else {
              setTasks(tasks.filter((t) => t.status === filter));
            }
          }}
        >
          <option value="">Filter by Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded shadow relative dark:bg-zinc-900 text-black dark:text-white">
            <h4 className="font-semibold text-lg">{task.title}</h4>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
            <span className={`inline-block text-sm px-2 py-1 rounded ${
              task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
              task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
            }`}>{task.status}</span>

            <div className="absolute top-4 right-4 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button  variant="outline" onClick={() => startEdit(task)}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateTask}>
                    <div className="grid gap-4 py-2">
                      <div>
                        <Label>Title</Label>
                        <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="gap-2 mt-4">
                      <DialogClose asChild>
                        <Button type="submit" onClick={handleUpdateTask}>Save</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDetailPage;



