import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import Heading from "@/components/heading";
import { usePopup } from "@/contexts/popup-context";
import categories from "@/routes/categories";
import labels from "@/routes/labels";

type Category = {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

type Label = {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

type PageProps = {
  categories: Category[];
  labels: Label[];
}

function CategoryForm({ data }: { data?: Category }) {
  const { hide } = usePopup()
  const form = useForm({
    name: data?.name || "",
    color: data?.color || "#3B82F6",
    type: data?.type || "expense",
  }).withPrecognition(data ? categories.update(data.id) : categories.store());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit()
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" label="Name" placeholder="Category name" form={form} />

      <div className="grid grid-cols-2 gap-4">
        <Input name="color" type="color" label="Color" className="w-full p-0 h-10" form={form} />

        <Select
          name="type"
          options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }, { value: "both", label: "Both" }]}
          label="Type"
          placeholder="Select type"
          form={form}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={hide}>Cancel</Button>
        <Button type="submit" disabled={form.processing}>Save</Button>
      </div>
    </form>
  );
}

function LabelForm({ data }: { data?: Label }) {
  const { hide } = usePopup()
  const form = useForm({
    name: data?.name || "",
    color: data?.color || "#3B82F6",
  }).withPrecognition(data ? labels.update(data.id) : labels.store());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    form.submit()
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" label="Name" placeholder="Label name" form={form} />

      <div className="grid lg:grid-cols-3 gap-3">

        <Input name="color" type="color" className="w-full p-0 h-10 border-none" label="Color" form={form} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={hide}>Cancel</Button>
        <Button type="submit" disabled={form.processing}>Save</Button>
      </div>
    </form>
  );
}



export default function Categories() {
  const { categories, labels } = usePage<PageProps>().props;
  const { show } = usePopup()

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

  const handlModalToggle = (label: "category" | "label", data?: Label | Category) => {

    const options = {
      category: {
        title: !data ? "Add Category" : "Edit Category",
        content: <CategoryForm data={data as Category} />
      },
      label: {
        title: data ? "Add Label" : "Edit Label",
        content: <LabelForm data={data as Label} />
      }
    }

    show({
      type: "modal",
      ...options[label]
    })
  }

  return (
    <div className="space-y-8">

      <Heading headingLevel={1} title="Categories & Labels" description="Organize your transactions." />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Heading
              title="Categories"
              description="Main grouping for transactions"
              variant="small"
              headingLevel={3}
              classNames={{
                title: "text-base",
                description: "text-sm"
              }}
            />

            <Button size="sm" onClick={() => handlModalToggle("category")}>
              <Plus className="size-4" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p> : categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{category.type}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlModalToggle("category", category)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Labels Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Heading
              title="Labels"
              description="Tags for detailed tracking"
              variant="small"
              headingLevel={3}
              classNames={{
                title: "text-base",
                description: "text-sm"
              }}
            />

            <Button size="sm" onClick={() => handlModalToggle("label")}>
              <Plus className="size-4" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {labels.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4 w-full">No labels yet.</p> : labels.map(label => (
                <div key={label.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card text-sm font-medium group">
                  <Tag className="w-3.5 h-3.5" style={{ color: label.color }} />
                  {label.name}
                  <div className="flex -mr-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlModalToggle("label", label)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteLabel(label.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
