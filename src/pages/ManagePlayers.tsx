import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, deleteUser, updateUser } from '../store/userSlice';
import { logPizza, getPizzaHistory } from '../services/pizzaService';
import { User, Pizza } from '../types';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../components/ui/use-toast';

const ManagePlayers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [pizzaHistory, setPizzaHistory] = React.useState<Pizza[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuyPizza = async () => {
    if (selectedUser) {
      if (selectedUser.coins >= 50) {
        try {
          await dispatch(updateUser({ id: selectedUser.id, userData: { coins: selectedUser.coins - 50 } })).unwrap();
          toast({
            title: "Pizza Purchased",
            description: "Pizza has been successfully purchased.",
          });
        } catch (error) {
          console.error('Error buying pizza:', error);
          toast({
            title: "Error",
            description: "Failed to buy pizza. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Insufficient Coins",
          description: "Not enough coins to buy a pizza!",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogPizza = async (userId: string) => {
    try {
      await logPizza(userId);
      dispatch(fetchUsers());
      toast({
        title: "Pizza Logged",
        description: "Pizza has been successfully logged.",
      });
    } catch (error) {
      console.error('Error logging pizza:', error);
      toast({
        title: "Error",
        description: "Failed to log pizza. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowPizzaHistory = async (userId: string) => {
    try {
      const history = await getPizzaHistory(userId);
      setPizzaHistory(history);
      setSelectedUser(users.find(user => user.id === userId) || null);
    } catch (error) {
      console.error('Error fetching pizza history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pizza history. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Players</h1>
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Age: {user.age}</p>
            <p>Gender: {user.gender}</p>
            <p>Coins: {user.coins}</p>
            <p>Rank: {user.rank}</p>
            <div className="mt-4 space-x-2">
              <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedUser(user)}>Buy a Pizza</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buy a Pizza</DialogTitle>
                  </DialogHeader>
                  <div>
                    <p>Available coins: {selectedUser?.coins}</p>
                    <p>Cost: 50 coins</p>
                    <Button onClick={handleBuyPizza}>Buy</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => handleLogPizza(user.id)}>Log a Pizza</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => handleShowPizzaHistory(user.id)}>Pizza History</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pizza History for {selectedUser?.name}</DialogTitle>
                  </DialogHeader>
                  <div>
                    {pizzaHistory.map((pizza) => (
                      <p key={pizza.id}>{new Date(pizza.timestamp).toLocaleString()}</p>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManagePlayers;

