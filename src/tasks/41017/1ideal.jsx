import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function formatCurrency(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

function formatDate(date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date);
}

function BalanceCard({ balance }) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Current Balance</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-4xl font-bold">{formatCurrency(balance)}</p>
			</CardContent>
		</Card>
	);
}

function SummaryCards({ income, expense }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-[#f7f7f7]">
			<Card className="bg-green-100">
				<CardHeader>
					<CardTitle>Income</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
				</CardContent>
			</Card>
			<Card className="bg-red-100">
				<CardHeader>
					<CardTitle>Expense</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-red-600">{formatCurrency(expense)}</p>
				</CardContent>
			</Card>
		</div>
	);
}

function TransactionForm({ onAddTransaction }) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (description.trim() && amount) {
			onAddTransaction({
				id: Date.now(),
				description: description.trim(),
				amount: parseFloat(amount),
				date: new Date(),
			});
			setDescription("");
			setAmount("");
		}
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Add New Transaction</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter transaction details"
						/>
					</div>
					<div>
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount (negative for expense)"
							step="0.01"
						/>
					</div>
					<Button type="submit">Add Transaction</Button>
				</form>
			</CardContent>
		</Card>
	);
}

function TransactionHistory({ transactions }) {
	const [currentPage, setCurrentPage] = useState(1);
	const transactionsPerPage = 5;

	const indexOfLastTransaction = currentPage * transactionsPerPage;
	const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
	const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

	const totalPages = Math.ceil(transactions.length / transactionsPerPage);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Transaction History</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{currentTransactions.map((transaction) => (
						<li
							key={transaction.id}
							className={`p-2 rounded ${transaction.amount >= 0 ? "bg-green-100" : "bg-red-100"
								}`}
						>
							<div className="flex justify-between items-center">
								<div>
									<p className="font-semibold">{transaction.description}</p>
									<p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
								</div>
								<p
									className={`font-bold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"
										}`}
								>
									{formatCurrency(transaction.amount)}
								</p>
							</div>
						</li>
					))}
				</ul>
				{totalPages > 1 && (
					<div className="flex justify-between items-center mt-4">
						<Button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<Button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ExportButton({ transactions }) {
	const exportToCSV = () => {
		const csvContent = [
			["Date", "Description", "Amount"],
			...transactions.map((t) => [
				formatDate(t.date),
				t.description,
				t.amount.toFixed(2),
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", "transaction_history.csv");
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<Button onClick={exportToCSV} className="w-full text-xl mb-4 bg-white text-black underline underline-offset-4 hover:text-white">
			Export CSV
		</Button>
	);
}

export default function App() {
	const [transactions, setTransactions] = useState([]);
	const [balance, setBalance] = useState(0);
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const newBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
		const newIncome = transactions
			.filter((t) => t.amount > 0)
			.reduce((acc, curr) => acc + curr.amount, 0);
		const newExpense = transactions
			.filter((t) => t.amount < 0)
			.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

		setBalance(newBalance);
		setIncome(newIncome);
		setExpense(newExpense);
	}, [transactions]);

	const addTransaction = (transaction) => {
		setTransactions([transaction, ...transactions]);
	};

	return (
		<div className="container mx-auto p-4 max-w-2xl bg-purple-100 rounded-xl">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Expense Tracker</h1>
				{isMobile ? (
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<Menu className="h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetTitle>Menu</SheetTitle>
							<ExportButton transactions={transactions} />
						</SheetContent>
					</Sheet>
				) : (
					<ExportButton transactions={transactions} />
				)}
			</div>
			<BalanceCard balance={balance} />
			<SummaryCards income={income} expense={expense} />
			<TransactionForm onAddTransaction={addTransaction} />
			<TransactionHistory transactions={transactions} />
		</div>
	);
}