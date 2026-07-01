import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Category = {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

type IncomeSource = {
  id: string;
  name: string;
}

type Label = {
  id: string;
  name: string;
  color: string;
}

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  notes: string | null;
  category: Category | null;
  income_source: IncomeSource | null;
  labels: Label[];
}

type PageProps = {
  transactions: Transaction[];
  categories: Category[];
  incomeSources: IncomeSource[];
  labels: Label[];
}

function TransactionForm({
  transaction,
  categories,
  incomeSources,
  onClose
}: {
  transaction?: Transaction | null;
  categories: Category[];
  incomeSources: IncomeSource[];
  onClose: () => void;
}) {
  const { post, put, data, setData, processing, errors, reset } = useForm({
    type: transaction?.type || "expense",
    amount: transaction?.amount || 0,
    category_id: transaction?.category?.id || "",
    income_source_id: transaction?.income_source?.id || "",
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: transaction?.notes || "",
    label_ids: transaction?.labels?.map(l => l.id) || [],
  });

  const type = data.type;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...data,
      category_id: type === 'expense' ? data.category_id : null,
      income_source_id: type === 'income' ? data.income_source_id : null,
    };

    if (transaction) {
      put(`/transactions/${transaction.id}`, {
        data: payload,
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    } else {
      post('/transactions', {
        data: payload,
        onSuccess: () => {
          
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={data.type} onValueChange={(value) => setData('type', value)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" value={data.amount} onChange={(e) => setData('amount', parseFloat(e.target.value))} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>

        {type === 'expense' ? (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.filter(c => c.type === 'expense' || c.type === 'both').map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="income_source">Income Source</Label>
            <Select value={data.income_source_id} onValueChange={(value) => setData('income_source_id', value)}>
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                {incomeSources.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.income_source_id && <p className="text-sm text-destructive">{errors.income_source_id}</p>}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optional notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={processing}>
          {transaction ? "Update" : "Add"} Transaction
        </Button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const { transactions, categories, incomeSources } = usePage<PageProps>().props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      router.delete(`/transactions/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage your income and expenses.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingTx(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTx ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
            </DialogHeader>
            <TransactionForm transaction={editingTx} categories={categories} incomeSources={incomeSources} onClose={() => { setIsDialogOpen(false); setEditingTx(null); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category/Source</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No transactions found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tx.type === 'income' ? 'text-primary border-primary/20 bg-primary/5' : 'text-destructive border-destructive/20 bg-destructive/5'}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tx.type === 'income' ? tx.income_source?.name || "—" : tx.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {tx.notes || "—"}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${tx.type === 'income' ? 'text-primary' : ''}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleEdit(tx)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(tx.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
