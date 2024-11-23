import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold">
              Pizza Eating Challenge
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/new-user">New User</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/leaderboard">Leaderboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/manage-players">Manage Players</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

