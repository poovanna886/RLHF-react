import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Drawer } from "@/components/ui/drawer";

function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const addTransaction = (description, amount) => {
    const newTransaction = {
      id: Date.now(),
      description,
      amount,
      date: new Date().toLocaleString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    setBalance(newBalance);
  }, [transactions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8," 
      + transactions.map(t => `${t.date},${t.description},${t.amount}`).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardContent>$ {balance.toFixed(2)}</CardContent>
        </CardHeader>
      </Card>
      <IncomeExpenseDisplay transactions={transactions} />
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionHistory transactions={currentTransactions} />
      <div className="flex justify-between mt-4">
        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= transactions.length}>
          Next
        </Button>
      </div>
      <ExportButton onExport={downloadCSV} />
      <MobileMenu onExport={downloadCSV} />
    </div>
  );
}

function IncomeExpenseDisplay({ transactions }) {
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  return (
    <Card className="mb-4">
      <CardContent className="flex justify-between">
        <span className="text-green-600">Income: ${income.toFixed(2)}</span>
        <span className="text-red-600">Expense: ${Math.abs(expense).toFixed(2)}</span>
      </CardContent>
    </Card>
  );
}

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Card className="mb-4">
      <CardContent>
        <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
        <Button onClick={() => { onAddTransaction(description, Number(amount)); setDescription(''); setAmount(''); }}>
          Add Transaction
        </Button>
      </CardContent>
    </Card>
  );
}

function TransactionHistory({ transactions }) {
  return transactions.map(t => (
    <Card key={t.id} className="mb-2">
      <CardContent className={`flex justify-between ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
        <div>{t.description}</div>
        <div>{t.date}</div>
        <div>${t.amount.toFixed(2)}</div>
      </CardContent>
    </Card>
  ));
}

function ExportButton({ onExport }) {
  return <Button className="mt-4" onClick={onExport}>Export CSV</Button>;
}

function MobileMenu({ onExport }) {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="outline">Menu</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Item onClick={onExport}>Export CSV</Drawer.Item>
      </Drawer.Content>
    </Drawer>
  );
}

export default App;