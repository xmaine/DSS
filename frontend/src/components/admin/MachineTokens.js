import React, { useState, useEffect } from 'react';
import { removeMachineToken, toHex } from '../../utils/machineToken';

const MachineTokens = ({ currentUser }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // In a real implementation, this would fetch tokens from the backend
  // For now, we'll simulate with localStorage data
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        // Simulate fetching tokens from backend
        const tokenData = localStorage.getItem('dss_machine_token');
        if (tokenData) {
          const parsedToken = JSON.parse(tokenData);
          setTokens([{
            id: 'local-token-1',
            username: parsedToken.username,
            machineId: parsedToken.machineId,
            createdAt: parsedToken.createdAt,
            expiresAt: parsedToken.expiresAt,
            location: 'Local Machine',
            hexUsername: toHex(parsedToken.username)
          }]);
        } else {
          setTokens([]);
        }
      } catch (err) {
        setError('Error fetching machine tokens');
        console.error('Error fetching tokens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleRemoveToken = async (tokenId, username) => {
    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // For now, we'll use our utility function
      const success = await removeMachineToken(currentUser.role);
      
      if (success) {
        // Remove from local state
        setTokens(tokens.filter(token => token.id !== tokenId));
        alert(`Machine token for user ${username} has been removed successfully.\n\nIn a real system, this would also remove the token file from:\nC:\\Users\\Default\\AppData\\Local\\DSS\\746f6b656e\\${username}.token`);
      } else {
        setError('You are not authorized to remove machine tokens.');
      }
    } catch (err) {
      setError('Error removing machine token');
      console.error('Error removing token:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Machine Tokens</h1>
        <p className="text-gray-600 mt-2">
          Manage machine tokens for employee users. Only System Administrators and Senior Department Heads can remove tokens.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active Machine Tokens</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            List of currently active machine tokens for employee users.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            </div>
          ) : tokens.length === 0 ? (
            <div className="px-4 py-5 sm:px-6">
              <p className="text-gray-500 text-center">No active machine tokens found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hex Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Machine ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokens.map((token) => (
                  <tr key={token.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {token.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {token.hexUsername}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {token.machineId.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(token.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(token.expiresAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {token.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRemoveToken(token.id, token.username)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h4 className="text-md font-medium text-blue-800">Directory Structure Information</h4>
        <p className="mt-2 text-sm text-blue-700">
          In a real Electron application, machine tokens are stored in:<br/>
          <code className="bg-gray-100 p-1 rounded">C:\Users\Default\AppData\Local\DSS\</code>
        </p>
        <p className="mt-2 text-sm text-blue-700">
          The directory structure uses hexadecimal encoding for security:
        </p>
        <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
          <li><code>746f6b656e</code> (hex for 'token') - Contains machine token files</li>
          <li><code>6469726563746f7279</code> (hex for 'directory') - Contains user directories</li>
        </ul>
        <p className="mt-2 text-sm text-blue-700">
          Token files are named after the machine ID and contain user binding information.
        </p>
      </div>

      <div className="mt-4 bg-yellow-50 p-4 rounded-md">
        <h4 className="text-md font-medium text-yellow-800">Security Information</h4>
        <p className="mt-2 text-sm text-yellow-700">
          Machine tokens ensure that only one employee user can be logged in per machine. 
          Tokens are automatically created when an employee logs in for the first time on a machine.
          Only System Administrators and Senior Department Heads can remove tokens from the system.
        </p>
        <p className="mt-2 text-sm text-yellow-700">
          For system administration, use the batch scripts in the <code>.bat</code> directory:
        </p>
        <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
          <li><code>setup_dss_directory.bat</code> - Creates the required directory structure</li>
          <li><code>dss_token_manager.bat</code> - Comprehensive token management tool</li>
        </ul>
      </div>
    </div>
  );
};

export default MachineTokens;