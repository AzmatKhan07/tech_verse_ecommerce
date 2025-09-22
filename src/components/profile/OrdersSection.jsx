import React from "react";
import { useUser } from "@/context/UserContext";
import OrdersTable from "./OrdersTable";

const OrdersSection = () => {
  const { user } = useUser();

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Orders History
      </h2>
      <OrdersTable orders={user.orders} />
    </div>
  );
};

export default OrdersSection;
