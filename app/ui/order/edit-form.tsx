"use client";
import { useTranslations } from "next-intl";
import { updateOrder, FormState } from "@/app/lib/actions";
import {useActionState} from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
} from "flowbite-react";
import { Order } from "@/app/lib/definitions";
import { HiCurrencyDollar } from "react-icons/hi";

import React from 'react'
import Select, { OptionsOrGroups } from 'react-select'

export default function Form({ id, order }: { id: string, order: Order }) {
  const i18n = useTranslations("order");
  const initialState: FormState = { message: null };
  const [state, formAction, isPending] = useActionState(
    updateOrder,
    initialState
  );

  const options = [
    { value: 'true', label: i18n("available")},
    { value: 'false', label: i18n("unavailable") }
  ]

  const paymentOptions = [
    { value: 'cash', label: i18n("cash")},
    { value: 'card', label: i18n("credit") }
  ]
  
  return (
    <div className="col-span-6 mb-5">
      <div className="grid grid-cols-1 gap-y-4">
        <Card>
          <h3 className="mb-4 text-xl font-bold dark:text-white">
            {i18n("info")}
          </h3>
          <form action={formAction}>
            <TextInput
                id="id"
                name="id"
                type="hidden"
                defaultValue={id}
            />
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="name">{i18n("name")}</Label>
                <TextInput
                  id="name"
                  name="name"
                  defaultValue={order.name}
                />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="contact">{i18n("contact")}</Label>
                <TextInput
                  id="contact"
                  name="contact"
                  defaultValue={order.contact}
                />
              </div>
             
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

                {order.order_products.map((row, index) => {
                  return (
                    <div key={index} className="grid grid-cols-12 gap-4 mt-4">
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          value={row.product.name}
                          disabled
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          value={row.quantity}
                          disabled
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          value={row.price}
                          disabled
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <TextInput
                          value={row.total}
                          disabled
                        />
                      </div>
                    </div>
                  );
                })}

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
                  defaultValue={paymentOptions.find(option => option.value === order.payment_type)}
                />
              </div>

              <div className="mt-5 col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="order_total">{i18n("order_total")}</Label>
                <TextInput
                  id="order_total"
                  name="order_total"
                  value={order.amount}
                  icon={HiCurrencyDollar}
                  disabled
                />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="order_date">{i18n("order_date")}</Label>
                <TextInput
                  id="order_date"
                  name="order_date"
                  type="datetime-local"
                  defaultValue={new Date(order.order_date).toISOString().slice(0, 16)}
                  disabled
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
                  defaultValue={options.find(option => option.value === (order.payment_status?"true":"false"))}
                />
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
