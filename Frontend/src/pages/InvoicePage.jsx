import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const InvoicePage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resClient = await API.get(`/clients/${id}`);
      const resTasks = await API.get(`/clients/${id}/tasks`);
      setClient(resClient.data);
      setTasks(resTasks.data);
    };
    fetchData();
  }, [id]);

  const DownloadInvoice = async () => {
  try {
    const res = await API.get(`/invoices/client/${id}`, {
      responseType: 'blob', // important for binary data
    });

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

  if (!client) return <p>Loading...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white shadow-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoice</h1>
        <p><strong>Client:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Company:</strong> {client.company}</p>
        <p className="mt-2 text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => window.print()}
        >
          Print Invoice
        </button>

        <button
        onClick={DownloadInvoice}
        className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
        Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
