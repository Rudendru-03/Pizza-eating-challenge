import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to Pizza Challenge</CardTitle>
          <CardDescription>
            Compete with others in this exciting pizza eating challenge!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/new-user">New User</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/leaderboard">Leaderboard</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/manage-players">Manage Players</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

