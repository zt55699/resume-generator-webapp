import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdate: (users: User[]) => void;
  isLoading: boolean;
  error: string | null;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onUpdate,
  isLoading,
  error,
}) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const roles: UserRole[] = [
    {
      id: 'admin',
      name: 'Administrator',
      permissions: ['admin:all'],
    },
    {
      id: 'editor',
      name: 'Editor',
      permissions: ['admin:read', 'admin:fields', 'admin:templates'],
    },
    {
      id: 'viewer',
      name: 'Viewer',
      permissions: ['admin:read'],
    },
    {
      id: 'user',
      name: 'User',
      permissions: [],
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.id === filterRole;
    return matchesSearch && matchesRole;
  });

  const createNewUser = (): User => ({
    id: `user_${Date.now()}`,
    email: '',
    name: '',
    role: roles.find(role => role.id === 'user') || roles[0],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  const handleAddUser = () => {
    const newUser = createNewUser();
    setEditingUser(newUser);
    setIsAddingUser(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsAddingUser(false);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    let updatedUsers;
    if (isAddingUser) {
      updatedUsers = [...users, editingUser];
    } else {
      updatedUsers = users.map(user =>
        user.id === editingUser.id ? editingUser : user
      );
    }

    onUpdate(updatedUsers);
    setEditingUser(null);
    setIsAddingUser(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsAddingUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      onUpdate(updatedUsers);
    }
  };

  const handleUserPropertyChange = (property: keyof User, value: any) => {
    if (!editingUser) return;

    if (property === 'role') {
      const selectedRole = roles.find(role => role.id === value);
      if (selectedRole) {
        setEditingUser({
          ...editingUser,
          role: selectedRole,
        });
      }
    } else {
      setEditingUser({
        ...editingUser,
        [property]: value,
      });
    }
  };

  const getRoleBadgeClass = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return 'user-role-badge admin';
      case 'editor':
        return 'user-role-badge editor';
      default:
        return 'user-role-badge';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEditUser = (user: User) => {
    return currentUser.role.permissions.includes('admin:all') || 
           (currentUser.role.permissions.includes('admin:users') && user.id !== currentUser.id);
  };

  const canDeleteUser = (user: User) => {
    return currentUser.role.permissions.includes('admin:all') && user.id !== currentUser.id;
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h3>User Management</h3>
        {currentUser.role.permissions.includes('admin:users') && (
          <button className="add-user-button" onClick={handleAddUser}>
            <span>+</span>
            Add New User
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="user-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {editingUser && (
        <div className="user-editor-modal">
          <div className="user-editor">
            <div className="user-editor-header">
              <h4>{isAddingUser ? 'Add New User' : `Edit User: ${editingUser.name}`}</h4>
              <button className="close-editor-button" onClick={handleCancelEdit}>
                ×
              </button>
            </div>

            <div className="user-editor-content">
              <div className="user-editor-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => handleUserPropertyChange('name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => handleUserPropertyChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editingUser.role.id}
                    onChange={(e) => handleUserPropertyChange('role', e.target.value)}
                    disabled={editingUser.id === currentUser.id}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  {editingUser.id === currentUser.id && (
                    <small className="form-help">You cannot change your own role</small>
                  )}
                </div>

                <div className="role-permissions">
                  <label>Role Permissions</label>
                  <div className="permissions-list">
                    {editingUser.role.permissions.map(permission => (
                      <span key={permission} className="permission-badge">
                        {permission}
                      </span>
                    ))}
                    {editingUser.role.permissions.length === 0 && (
                      <span className="no-permissions">No admin permissions</span>
                    )}
                  </div>
                </div>

                <div className="user-editor-actions">
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button
                    className="save-button"
                    onClick={handleSaveUser}
                    disabled={!editingUser.name || !editingUser.email}
                  >
                    {isAddingUser ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      {user.id === currentUser.id && (
                        <span className="current-user-badge">(You)</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role.id)}>
                    {user.role.name}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>
                  <span className="user-status-badge active">Active</span>
                </td>
                <td>
                  <div className="user-actions">
                    {canEditUser(user) && (
                      <button
                        className="user-action-button edit"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        ✏️
                      </button>
                    )}
                    {canDeleteUser(user) && (
                      <button
                        className="user-action-button delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !isLoading && (
          <div className="empty-state">
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        .user-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .search-input,
        .role-filter {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .search-input {
          width: 300px;
        }

        .user-editor-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .user-editor {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .user-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-editor-header h4 {
          margin: 0;
          color: #1e293b;
        }

        .close-editor-button {
          padding: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .user-editor-content {
          flex: 1;
          overflow-y: auto;
        }

        .user-editor-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-help {
          color: #6b7280;
          font-size: 0.8rem;
          font-style: italic;
        }

        .role-permissions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .role-permissions label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .permissions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .permission-badge {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .no-permissions {
          color: #6b7280;
          font-style: italic;
          font-size: 0.875rem;
        }

        .user-editor-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .cancel-button,
        .save-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cancel-button {
          background: #6b7280;
          color: white;
        }

        .cancel-button:hover {
          background: #4b5563;
        }

        .save-button {
          background: #3b82f6;
          color: white;
        }

        .save-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .save-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .users-table-container {
          overflow-x: auto;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .user-name {
          font-weight: 500;
          color: #1e293b;
        }

        .current-user-badge {
          background: #10b981;
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .add-user-button {
          padding: 0.75rem 1.5rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-user-button:hover {
          background: #059669;
        }

        .user-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .user-management-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .user-filters {
            flex-direction: column;
            align-items: start;
          }

          .search-input {
            width: 100%;
          }

          .users-table {
            font-size: 0.875rem;
          }

          .user-info {
            flex-direction: column;
            align-items: start;
            gap: 0.5rem;
          }

          .user-management-header {
            flex-direction: column;
            gap: 1rem;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;