import React, { useState } from 'react';

const EmployeeWorkflowsPage = () => {
  // Mock data - in a real app, this would come from your API
  const [workflows, setWorkflows] = useState([
    { 
      id: 1, 
      documentName: 'Q3 Financial Report', 
      workflowName: 'Document Approval', 
      currentStep: 'Review', 
      status: 'PENDING', 
      assignedOn: '2025-10-10', 
      dueDate: '2025-10-20', 
      completedOn: null,
      actionTaken: null,
      comment: null
    },
    { 
      id: 2, 
      documentName: 'Marketing Campaign Brief', 
      workflowName: 'Content Review', 
      currentStep: 'Feedback', 
      status: 'PENDING', 
      assignedOn: '2025-10-12', 
      dueDate: '2025-10-18', 
      completedOn: null,
      actionTaken: null,
      comment: null
    },
    { 
      id: 3, 
      documentName: 'Project Alpha Specs', 
      workflowName: 'Technical Review', 
      currentStep: 'Approval', 
      status: 'COMPLETED', 
      assignedOn: '2025-10-01', 
      dueDate: '2025-10-10', 
      completedOn: '2025-10-09',
      actionTaken: 'APPROVED',
      comment: 'Specifications look good, approved for implementation.'
    },
  ]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [actionTaken, setActionTaken] = useState('');
  const [comment, setComment] = useState('');

  const handleCompleteTask = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowCompleteModal(true);
  };

  const handleRequestClarification = (workflowId) => {
    console.log(`Requesting clarification for workflow ${workflowId}`);
    // In a real app, this would call your API
  };

  const handleSubmitTask = () => {
    console.log(`Completing task for workflow ${selectedWorkflow.id} with action: ${actionTaken} and comment: ${comment}`);
    // In a real app, this would call your API
    setShowCompleteModal(false);
    setActionTaken('');
    setComment('');
    setSelectedWorkflow(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'COMPLETED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'REJECTED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getDueDateClass = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'text-red-600 font-bold'; // Overdue
    } else if (diffDays <= 3) {
      return 'text-yellow-600 font-medium'; // Due soon
    }
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Workflows</h2>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search by document or workflow name"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Step</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workflow.documentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workflow.workflowName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workflow.currentStep}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(workflow.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workflow.assignedOn}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDueDateClass(workflow.dueDate)}`}>{workflow.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workflow.completedOn || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleRequestClarification(workflow.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Document
                  </button>
                  {workflow.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleCompleteTask(workflow)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Complete Task
                      </button>
                      <button 
                        onClick={() => handleRequestClarification(workflow.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Request Clarification
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complete Task Modal */}
      {showCompleteModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Task for "{selectedWorkflow.documentName}"</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Action</label>
                <p className="text-sm text-gray-600">Please review the document and provide your feedback.</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken *</label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select an action</option>
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="EDIT_AND_COMPLETE">Edit & Complete</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="Add any comments or feedback..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTask}
                  disabled={!actionTaken}
                  className={`px-4 py-2 rounded-md ${actionTaken ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedWorkflow && !showCompleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Name</label>
                  <p className="text-sm text-gray-900">{selectedWorkflow.documentName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Workflow Name</label>
                  <p className="text-sm text-gray-900">{selectedWorkflow.workflowName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Step</label>
                  <p className="text-sm text-gray-900">{selectedWorkflow.currentStep}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedWorkflow.status}</p>
                </div>
                
                {selectedWorkflow.actionTaken && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action Taken</label>
                    <p className="text-sm text-gray-900">{selectedWorkflow.actionTaken}</p>
                  </div>
                )}
                
                {selectedWorkflow.comment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                    <p className="text-sm text-gray-900">{selectedWorkflow.comment}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedWorkflow(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeWorkflowsPage;