"use client";
import { useTranslations } from "next-intl";
import { createOrder, FormState } from "@/app/lib/actions";
import {
  ChangeEvent,
  FormEvent,
  useActionState,
  useEffect,
  useState,
  startTransition
} from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
} from "flowbite-react";
import { Product } from "@/app/lib/definitions";
import { SingleValue } from "react-select";
import { TrashIcon } from '@heroicons/react/24/outline';
import { HiCurrencyDollar } from "react-icons/hi";
import { useRouter } from 'next/navigation';

type ProductRow = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
};
import React from 'react'
import Select, { OptionsOrGroups } from 'react-select'

export default function Form({ products }: { products: Product[] }) {
  const i18n = useTranslations("order");
  const initialState: FormState = { message: null };
  const [state, formAction, isPending] = useActionState(
    createOrder,
    initialState
  );
  const [orderTotal, setOrderTotal] = useState(0);
  const [productRowErrors, setProductRowErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([
    { productId: "", quantity: 0, price: 0, total: 0 },
  ]);

  const { replace } = useRouter();

  useEffect(() => {
    const total = productRows.reduce((sum, row) => sum + row.total, 0);
    setOrderTotal(total);
  }, [productRows]);

  useEffect(() => {
    if (state && state?.message=='success') {
      replace(`/order/${state?.payload?.get("oid")}/edit`);
    }
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
    eventOrOption:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | SingleValue<{ value: string; label: string }>
      | null
  ) => {
    if (!eventOrOption) {
      return;
    }
  
    const rows = [...productRows];
    const updatedErrors = [...productRowErrors]; // Clone existing errors
  
    if ("target" in eventOrOption) {
      const { name, value } = eventOrOption.target;
  
      if (name === "quantity") {
        const inputQuantity = parseFloat(value);
        const productId = rows[index].productId;
  
        if (productId) {
          const selectedProduct = products.find(
            (p) => p.documentId === productId
          );
  
          if (selectedProduct && inputQuantity > selectedProduct.quantity) {
            updatedErrors[index] = `${i18n("max_qty")} ${selectedProduct.quantity}`;
          } else {
            updatedErrors[index] = ""; // Clear the error if the quantity is valid
          }
        }
  
        rows[index][name] = inputQuantity;
        rows[index].total = rows[index].quantity * rows[index].price;
      }
    } else {
      const selectedProduct = products.find(
        (p) => p.documentId === eventOrOption.value
      );
  
      if (selectedProduct) {
        rows[index]["productId"] = eventOrOption.value;
        rows[index]["price"] = selectedProduct.price;
        rows[index]["total"] = rows[index].quantity * selectedProduct.price;
  
        // Re-validate the quantity for the newly selected product
        if (rows[index].quantity > selectedProduct.quantity) {
          updatedErrors[index] = `${i18n("max_qty")} ${selectedProduct.quantity}`;
        } else {
          updatedErrors[index] = ""; // Clear the error if the quantity is valid
        }
      }
    }
  
    setProductRows(rows);
    setProductRowErrors(updatedErrors); // Update errors without resetting other rows' errors
  };
  
  

  const options = [
    { value: 'true', label: i18n("available")},
    { value: 'false', label: i18n("unavailable") }
  ]

  const productOptions: { value: string; label: string }[] = [];
  {products?.map((p: Product) => (
    productOptions.push({ value: p.documentId, label: p.name})
  ))}

  const paymentOptions = [
    { value: 'cash', label: i18n("cash")},
    { value: 'card', label: i18n("credit") }
  ]
  
  const allSelectedProductIds = productRows.map((row) => row.productId);
  const hasAvailableProducts = products.some(
    (product) => !allSelectedProductIds.includes(product.documentId)
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission
  
    const newProductRowErrors: string[] = [];
    const newFormErrors: string[] = [];
  
    // Validate each product row
    productRows.forEach((row, index) => {
      if (!row.productId) {
        newProductRowErrors[index] = i18n("product_required");
      } else if (row.quantity <= 0) {
        newProductRowErrors[index] = i18n("quantity_required");
      } else if (
        row.quantity >
        products.find((p) => p.documentId === row.productId)?.quantity!
      ) {
        newProductRowErrors[index] = `${i18n("max_qty")} ${
          products.find((p) => p.documentId === row.productId)?.quantity
        }`;
      } else {
        newProductRowErrors[index] = ""; // No error for this row
      }
    });
  
    // Validate form-level fields
    const formData = new FormData(event.currentTarget);
  
    const name = formData.get("name")?.toString().trim();
    const contact = formData.get("contact")?.toString().trim();
    const order_date = formData.get("order_date")?.toString().trim();
    const payment_type = formData.get("payment_type")?.toString().trim();
  
    if (!name) newFormErrors.push(i18n("name_required"));
    if (!contact) newFormErrors.push(i18n("contact_required"));
    if (!order_date) newFormErrors.push(i18n("order_date_required"));
    if (!payment_type) newFormErrors.push(i18n("payment_type_required"));
  
    // Serialize product rows into form data
    formData.append("productRows", JSON.stringify(productRows));

    // Update state
    setFormErrors(newFormErrors);
    setProductRowErrors(newProductRowErrors);
  
    // Check if there are any errors
    const hasRowErrors = newProductRowErrors.some((error) => error !== "");
    const hasFormErrors = newFormErrors.length > 0;
  
    if (!hasRowErrors && !hasFormErrors) {
      startTransition(() => {
        formAction(formData);
      });
    }
  };
  
  return (
    <div className="col-span-6 mb-5">
      <div className="grid grid-cols-1 gap-y-4">
        <Card>
          <h3 className="mb-4 text-xl font-bold dark:text-white">
            {i18n("info")}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="name">{i18n("name")}</Label>
                <TextInput
                  id="name"
                  name="name"
                  defaultValue={state.payload?.get("name") as string}
                />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="contact">{i18n("contact")}</Label>
                <TextInput
                  id="contact"
                  name="contact"
                  defaultValue={state.payload?.get("contact") as string}
                />
              </div>
             

              {/* Dynamic Product Rows */}
              <div className="col-span-6">
                <div className="grid grid-cols-12 gap-4 mb-2">
                    <div className="col-span-6 md:col-span-3">
                    <Label>{i18n("product")}</Label>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                    <Label>{i18n("quantity")}</Label>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                    <Label>{i18n("price")}</Label>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                    <Label>{i18n("total")}</Label>
                    </div>
                    <div className="col-span-1"></div>
                </div>
                {productRows.map((row, index) => {
                  // Dynamically filter options for each select box
                  const filteredProductOptions = productOptions.filter(
                    (option) =>
                      !productRows.some(
                        (r, i) => r.productId === option.value && i !== index
                      )
                  );

                  return (
                    <div key={index} className="grid grid-cols-12 gap-4 mt-4">
                      <div className="col-span-6 md:col-span-3">
                        <Select
                          className="my-react-select-container"
                          classNamePrefix="my-react-select"
                          options={filteredProductOptions} // Use filtered options
                          id={`product-${index}`}
                          name="productId"
                          placeholder={i18n("select_search")}
                          noOptionsMessage={({ inputValue }) =>
                            !inputValue ? i18n("select_search") : i18n("not_found")
                          }
                          value={productOptions.find(
                            (option) => option.value === row.productId
                          )}
                          onChange={(event) => handleChange(index, event)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          id={`quantity-${index}`}
                          name="quantity"
                          type="number"
                          value={row.quantity}
                          onChange={(event) => handleChange(index, event)}
                          min="0"
                        />
                        {productRowErrors[index] && (
                          <p className="text-sm text-red-500 mt-1">{productRowErrors[index]}</p>
                        )}
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          id={`price-${index}`}
                          name="price"
                          type="number"
                          icon={HiCurrencyDollar}
                          value={row.price}
                          readOnly
                        />
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <TextInput
                          id={`total-${index}`}
                          name="total"
                          type="number"
                          icon={HiCurrencyDollar}
                          value={row.total}
                          readOnly
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1 flex items-baseline justify-end md:justify-start">
                        <Button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="text-gray-700 bg-gray-100 enabled:hover:bg-gray-300 dark:bg-gray-500 dark:enabled:hover:bg-gray-700 dark:text-gray-100"
                          disabled={productRows.length <= 1}
                        >
                          <TrashIcon className="w-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

            </div>


              <div className="col-span-6 flex">
                <Button
                  type="button"
                  onClick={handleAddRow}
                  className="text-white rounded"
                  disabled={!hasAvailableProducts}
                >
                  {i18n("add_row")}
                </Button>
              </div>

              <div className="mt-5 col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="payment_type">{i18n("payment_type")}</Label>
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  options={paymentOptions}
                  id="payment_type"
                  name="payment_type"
                  placeholder={i18n("select")}
                  isSearchable={false}
                  defaultValue={paymentOptions.find(option => option.value === state.payload?.get("payment_type") as string)}
                />
              </div>

              <div className="mt-5 col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="order_total">{i18n("order_total")}</Label>
                <TextInput
                  id="order_total"
                  name="order_total"
                  value={orderTotal.toFixed(2)}
                  icon={HiCurrencyDollar}
                  readOnly
                />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="order_date">{i18n("order_date")}</Label>
                <TextInput
                  id="order_date"
                  name="order_date"
                  type="datetime-local"
                  defaultValue={state.payload?.get("order_date") as string}
                />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="status">{i18n("status")}</Label>
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  options={options}
                  id="status"
                  name="status"
                  placeholder={i18n("select")}
                  isSearchable={false}
                  defaultValue={options.find(option => option.value === state.payload?.get("status") as string || option.value === 'false')}
                />
              </div>

              {formErrors.length > 0 && (
                  <div className="col-span-6">
                      <p key={'err'} className="text-sm text-red-500">{formErrors[0]}</p>
                  </div>
                )}
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
