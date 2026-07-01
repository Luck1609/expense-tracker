import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface PageProps {
  categories: Category[];
  labels: Label[];
}

function CategoryForm({ cat, onClose }: { cat?: Category | null; onClose: () => void }) {
  const { post, put, data, setData, processing, errors, reset } = useForm({
    name: cat?.name || "",
    color: cat?.color || "#3B82F6",
    type: cat?.type || "expense",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cat) {
      put(`/categories/${cat.id}`, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    } else {
      post('/categories', {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            <Input id="color" type="color" className="w-12 p-1 h-10" value={data.color} onChange={(e) => setData('color', e.target.value)} />
            <Input value={data.color} onChange={(e) => setData('color', e.target.value)} />
          </div>
          {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={data.type} onValueChange={(value) => setData('type', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={processing}>Save</Button>
      </div>
    </form>
  );
}

function LabelForm({ label, onClose }: { label?: Label | null; onClose: () => void }) {
  const { toast } = useToast();
  const { post, put, data, setData, processing, errors, reset } = useForm({
    name: label?.name || "",
    color: label?.color || "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label) {
      put(`/labels/${label.id}`, {
        onSuccess: () => {
          toast({ title: "Updated" });
          onClose();
          reset();
        },
      });
    } else {
      post('/labels', {
        onSuccess: () => {
          toast({ title: "Created" });
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label-name">Name</Label>
        <Input id="label-name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="label-color">Color</Label>
        <div className="flex gap-2">
          <Input id="label-color" type="color" className="w-12 p-1 h-10" value={data.color} onChange={(e) => setData('color', e.target.value)} />
          <Input value={data.color} onChange={(e) => setData('color', e.target.value)} />
        </div>
        {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={processing}>Save</Button>
      </div>
    </form>
  );
}

export default function Categories() {
  const { categories, labels } = usePage<PageProps>().props;
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [labDialogOpen, setLabDialogOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Label | null>(null);

  const handleDeleteCategory = (id: string) => {
    if (confirm("Delete?")) {
      router.delete(`/categories/${id}`, {
      });
    }
  };

  const handleDeleteLabel = (id: string) => {
    if (confirm("Delete?")) {
      router.delete(`/labels/${id}`, {
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories & Labels</h1>
        <p className="text-muted-foreground mt-1">Organize your transactions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Main grouping for transactions</CardDescription>
            </div>
            <Dialog open={catDialogOpen} onOpenChange={(open) => { setCatDialogOpen(open); if (!open) setEditingCat(null); }}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle>{editingCat ? "Edit" : "Add"} Category</DialogTitle></DialogHeader><CategoryForm cat={editingCat} onClose={() => setCatDialogOpen(false)} /></DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p> : categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{c.type}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCat(c); setCatDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCategory(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Labels Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Labels</CardTitle>
              <CardDescription>Tags for detailed tracking</CardDescription>
            </div>
            <Dialog open={labDialogOpen} onOpenChange={(open) => { setLabDialogOpen(open); if (!open) setEditingLab(null); }}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle>{editingLab ? "Edit" : "Add"} Label</DialogTitle></DialogHeader><LabelForm label={editingLab} onClose={() => setLabDialogOpen(false)} /></DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {labels.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4 w-full">No labels yet.</p> : labels.map(l => (
                <div key={l.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card text-sm font-medium group">
                  <Tag className="w-3.5 h-3.5" style={{ color: l.color }} />
                  {l.name}
                  <div className="flex -mr-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary transition-colors" onClick={() => { setEditingLab(l); setLabDialogOpen(true); }}><Pencil className="w-3 h-3" /></button>
                    <button className="p-1 hover:text-destructive transition-colors" onClick={() => handleDeleteLabel(l.id)}><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
