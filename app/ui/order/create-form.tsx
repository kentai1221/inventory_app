"use client";
import { useTranslations } from "next-intl";
import { updateProduct, FormState } from "@/app/lib/actions";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useState,
} from "react";
import {
  Card,
  Button,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { Product } from "@/app/lib/definitions";

type ProductRow = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
};

export default function Form({ products }: { products: Product[] }) {
  const i18n = useTranslations("order");
  const initialState: FormState = { message: null };
  const [state, formAction, isPending] = useActionState(
    updateProduct,
    initialState
  );
  const [reRender, setReRender] = useState(0);
  const [productRows, setProductRows] = useState<ProductRow[]>([
    { productId: "", quantity: 0, price: 0, total: 0 },
  ]);

  useEffect(() => {
    setReRender(reRender + 1);
  }, [state]);

  const handleAddRow = () => {
    setProductRows([
      ...productRows,
      { productId: "", quantity: 0, price: 0, total: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const rows = [...productRows];
    rows.splice(index, 1);
    setProductRows(rows);
  };

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const rows = [...productRows];
    if (name === "quantity" || name === "price") {
      rows[index][name] = parseFloat(value);
      // Update total if quantity or price changes
      rows[index].total = rows[index].quantity * rows[index].price;
    } else if (name === "productId") {
      rows[index][name] = value;
    }
    setProductRows(rows);
  };

  return (
    <div className="col-span-6 mb-5">
      <div className="grid grid-cols-1 gap-y-4">
        <Card>
          <h3 className="mb-4 text-xl font-bold dark:text-white">
            {i18n("info")}
          </h3>
          <form action={formAction}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="namev">{i18n("name")}</Label>
                <TextInput
                  id="name"
                  name="name"
                  defaultValue={state.payload?.get("name") as string}
                />
              </div>
              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="status">{i18n("status")}</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={state.payload?.get("status") as string}
                >
                  <option key={"T"} value="true">
                    {i18n("available")}
                  </option>
                  <option key={"F"} value="false">
                    {i18n("unavailable")}
                  </option>
                </Select>
              </div>

              {/* Dynamic Product Rows */}
              <div className="col-span-6">
                <div className="grid grid-cols-12 gap-4 mb-2">
                    <div className="col-span-3">
                    <Label>{i18n("product")}</Label>
                    </div>
                    <div className="col-span-3">
                    <Label>{i18n("quantity")}</Label>
                    </div>
                    <div className="col-span-3">
                    <Label>{i18n("price")}</Label>
                    </div>
                    <div className="col-span-2">
                    <Label>{i18n("total")}</Label>
                    </div>
                    <div className="col-span-1"></div>
                </div>
                {productRows.map((row, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-3">
                        <Select
                        id={`product-${index}`}
                        name="productId"
                        value={row.productId}
                        onChange={(event) => handleChange(index, event)}
                        >
                        <option key="" value="">
                            {i18n("select_product")}
                        </option>
                        {products?.map((p: Product) => (
                            <option key={p.documentId} value={p.documentId}>
                            {p.name}
                            </option>
                        ))}
                        </Select>
                    </div>
                    <div className="col-span-3">
                        <TextInput
                        id={`quantity-${index}`}
                        name="quantity"
                        type="number"
                        value={row.quantity}
                        onChange={(event) => handleChange(index, event)}
                        min="0"
                        />
                    </div>
                    <div className="col-span-3">
                        <TextInput
                        id={`price-${index}`}
                        name="price"
                        type="number"
                        value={row.price}
                        onChange={(event) => handleChange(index, event)}
                        min="0"
                        />
                    </div>
                    <div className="col-span-2">
                        <TextInput
                        id={`total-${index}`}
                        name="total"
                        type="number"
                        value={row.total}
                        disabled
                        />
                    </div>
                    <div className="col-span-1 flex items-end">
                        <Button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="bg-red-500 enabled:hover:bg-red-700 dark:bg-red-500 dark:enabled:hover:bg-red-700"
                            disabled={productRows.length <= 1}
                            >
                            {i18n("remove")}
                        </Button>
                    </div>
                    </div>
                ))}
            </div>


              <div className="col-span-6 flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddRow}
                  className="text-white p-2 rounded"
                >
                  {i18n("add_row")}
                </Button>
              </div>

              {state?.message === "failed" && (
                <p className="mt-5 text-sm text-red-500">{i18n("err")}</p>
              )}
              {state?.message === "success" && (
                <p className="mt-5 text-sm text-green-600 dark:text-green-400">
                  {i18n("success")}
                </p>
              )}
              <div className="col-span-6 flex">
                <Button type="submit">{i18n("save")}</Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
