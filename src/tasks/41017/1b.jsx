import React, { useState, useEffect } from 'react';
//import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { format } from 'date-fns';

const initialBalance = 0;

function App() {
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '' });
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const itemsPerPage = 5;

  const addTransaction = (e) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount !== '') {
      const amount = parseFloat(newTransaction.amount);
      const transaction = {
        description: newTransaction.description,
        amount: amount,
        date: new Date(),
      };
      setTransactions([...transactions, transaction]);
      setBalance(balance + amount);
      setNewTransaction({ description: '', amount: '' });
    }
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + transactions.map(t => `${t.date.toISOString()},${t.description},${t.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_tracker.csv");
    document.body.appendChild(link);
    link.click();
  };

  const paginatedTransactions = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
          <Button onClick={() => setIsDrawerOpen(true)} className="sm:hidden">Menu</Button>
          <Button onClick={exportToCSV} className="hidden sm:inline-block">Export CSV</Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">Balance: ${balance.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-green-600">Income: ${transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</div>
            <div className="text-red-600">Expense: ${Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTransaction} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Description" 
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} 
              required 
            />
            <Input 
              type="number" 
              placeholder="Amount" 
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} 
              required 
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedTransactions.map((t, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${t.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <div>{t.description}</div>
              <div className="text-sm text-gray-600">{format(t.date, 'PPpp')} - ${t.amount}</div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button onClick={() => setPage(page => Math.max(page - 1, 1))} disabled={page === 1}>Previous</Button>
            <Button onClick={() => setPage(page => page + 1)} disabled={page * itemsPerPage >= transactions.length}>Next</Button>
          </div>
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Button onClick={exportToCSV} className="w-full">Export CSV</Button>
      </Drawer>
    </div>
  );
}

export default App;