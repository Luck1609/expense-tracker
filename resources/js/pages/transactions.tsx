import { useForm, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import transactionRoute from "@/routes/transactions";
import { DatePicker } from "@/components/form/datepicker";
import { Textarea } from "@/components/ui/textarea";
import type { PopupContextConfig} from "@/contexts/popup-context";
import { usePopup } from "@/contexts/popup-context";


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
}: {
  transaction?: Transaction | null;
  categories: Category[];
  incomeSources: IncomeSource[];
}) {
  const {hide} = usePopup()
  const form = useForm({
    type: transaction?.type || "expense",
    amount: transaction?.amount || 0,
    category_id: transaction?.category?.id || "",
    income_source_id: transaction?.income_source?.id || "",
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: transaction?.notes || "",
    label_ids: transaction?.labels?.map(l => l.id) || [],
  }).withPrecognition(transaction ? transactionRoute.update(transaction.id) : transactionRoute.store());

  const type = form.data.type;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    form.transform((data) => ({
      ...data,
      category_id: type === 'expense' ? data.category_id : null,
      income_source_id: type === 'income' ? data.income_source_id : null,
    }))

    form.submit({
      onSuccess: () => {
        hide();
        form.reset();
      },
    });


  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          name="type"
          form={form}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
        />

        <Input name="amount" label="Amount" type="number" step="0.01" form={form} />

        <div className="grid grid-cols-2 gap-4">
          <DatePicker name="date" label="Date" form={form} />

          {type === 'expense' ? (
            <Select
              name="category_id"
              form={form}
              label="Category"
              placeholder="Select category"
              options={categories.filter(category => category.type === 'expense' || category.type === 'both').map(category => ({ value: category.id, label: category.name }))}
            />
          ) : (
            <Select
              name="income_source_id"
              form={form}
              label="Income Source"
              placeholder="Select source"
              options={incomeSources.map(source => ({ value: source.id, label: source.name }))}
            />
          )}
        </div>

        <Textarea name="notes" label="Notes (optional)" placeholder="Optional notes" form={form} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={hide}>Cancel</Button>
        <Button type="submit" disabled={form.processing}>
          {transaction ? "Update" : "Add"} Transaction
        </Button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const { transactions, categories, incomeSources } = usePage<PageProps>().props;
  const { show } = usePopup()

  const handleAction = (action: "submit" | "delete", transaction?: Transaction) => {
    const options = {
      submit: {
        type: "modal",
        title: transaction ? "Edit Transaction" : "Add Transaction",
        description: transaction ? "Edit the transaction details" : "Add a new transaction",
        content: <TransactionForm 
          transaction={transaction} 
          categories={categories} 
          incomeSources={incomeSources} 
        />
      } as PopupContextConfig,
      delete: {
        type: "notice",
        title: "Delete Transaction",
        description: "Are you sure you want to delete this transaction?",
      } as PopupContextConfig
    }
    show({...options[action]});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage your income and expenses.</p>
        </div>
        
        <Button onClick={() => handleAction("submit")}>
          <Plus className="w-4 h-4 mr-2" /> 
          Add Transaction
        </Button>
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
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={transaction.type === 'income' ? 'text-primary border-primary/20 bg-primary/5' : 'text-destructive border-destructive/20 bg-destructive/5'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'income' ? transaction.income_source?.name || "—" : transaction.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {transaction.notes || "—"}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${transaction.type === 'income' ? 'text-primary' : ''}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleAction("submit", transaction)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleAction("delete", transaction)}>
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

