import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import EnhancedMentalHealthDashboard from '../components/EnhancedMentalHealthDashboard';

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    // This shouldn't happen due to PrivateRoute, but added for safety
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div>
      {/* <h1>Dashboard</h1> */}
      <EnhancedMentalHealthDashboard userId={user.uid} />
    </div>
  );
}

export default Dashboard;