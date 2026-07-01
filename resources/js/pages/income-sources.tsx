import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/form/input";
import { Textarea } from "@/components/form/textarea";

interface IncomeSource {
  id: string;
  name: string;
  description: string | null;
}



function SourceForm({ source, onClose }: { source?: IncomeSource | null; onClose: () => void }) {
  const form = useForm({
    name: source?.name || "",
    description: source?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (source) {
    //   put(`/income-sources/${source.id}`, {
    //     onSuccess: () => {
    //       onClose();
    //       reset();
    //     },
    //   });
    // } else {
    //   post('/income-sources', {
    //     onSuccess: () => {
    //       onClose();
    //       reset();
    //     },
    //   });
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" form={form} label="Name" placeholder="Type in the name" />
      
      <Textarea name="description" form={form} label="" placeholder="" />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={form.processing}>Save</Button>
      </div>
    </form>
  );
}

export default function IncomeSources() {
  const { incomeSources } = usePage<{ incomeSources: IncomeSource[] }>().props;
  // const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (confirm("Delete?")) {
      router.delete(`/income-sources/${id}`, {
        // onSuccess: () => toast({ title: "Deleted" }),
      });
    }
  };

  // const handleEdit = (source: IncomeSource) => {
  //   setEditingSrc(source);
  //   setDialogOpen(true);
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income Sources</h1>
          <p className="text-muted-foreground mt-1">Manage where your money comes from.</p>
        </div>

        <Button><Plus className="w-4 h-4 mr-2" /> Add Source</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {incomeSources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl bg-card border-dashed">
            No income sources found. Add your salary or side hustle to start tracking.
          </div>
        ) : (
          incomeSources.map(s => (
            <Card key={s.id} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <BriefcaseBusiness className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{s.name}</h3>
                      {s.description && <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingSrc(s); setDialogOpen(true); }}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(s.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
